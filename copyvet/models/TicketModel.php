<?php
class TicketModel
{
    public $enlace;
    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    public function all()
    {
        try {
            $vSql = "SELECT 
                        t.id_ticket,
                        t.titulo,
                        t.descripcion,
                        e.nombre_estado,
                        c.nombre_categoria,
                        s.descripcion AS prioridad,
                        m.nombre AS mascota,
                        u1.nombre_completo AS cliente,
                        u2.nombre_completo AS asignado_a,
                        t.fecha_creacion,
                        t.fecha_cita,
                        s.tiempo_minutos AS sla_respuesta,
                        s.tiempo_resolucion AS sla_resolucion,
                        TIMESTAMPDIFF(MINUTE, t.fecha_creacion, NOW()) AS tiempo_transcurrido
                    FROM tickets t
                    JOIN estadosticket e ON e.id_estado = t.id_estado
                    JOIN categorias c ON c.id_categoria = t.id_categoria
                    JOIN sla s ON s.id_sla = c.id_sla
                    JOIN mascotas m ON m.id_mascota = t.id_mascota
                    JOIN usuarios u1 ON u1.id_usuario = t.id_creado_por_usuario
                    LEFT JOIN usuarios u2 ON u2.id_usuario = t.id_asignado_a_usuario
                    ORDER BY t.fecha_creacion DESC;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($id)
    {
        try {
            $vSql = "SELECT 
                        t.id_ticket,
                        t.titulo,
                        t.descripcion,
                        e.nombre_estado,
                        e.id_estado,
                        c.nombre_categoria,
                        c.id_categoria,
                        s.descripcion AS prioridad,
                        m.nombre AS mascota,
                        m.id_mascota,
                        u1.nombre_completo AS cliente,
                        u1.id_usuario AS id_creado_por_usuario,
                        u2.nombre_completo AS asignado_a,
                        u2.id_usuario AS id_asignado_a_usuario,
                        t.fecha_creacion,
                        t.fecha_cita,
                        s.tiempo_minutos AS sla_respuesta,
                        s.tiempo_resolucion AS sla_resolucion,
                        TIMESTAMPDIFF(MINUTE, t.fecha_creacion, NOW()) AS tiempo_transcurrido
                    FROM tickets t
                    JOIN estadosticket e ON e.id_estado = t.id_estado
                    JOIN categorias c ON c.id_categoria = t.id_categoria
                    JOIN sla s ON s.id_sla = c.id_sla
                    JOIN mascotas m ON m.id_mascota = t.id_mascota
                    JOIN usuarios u1 ON u1.id_usuario = t.id_creado_por_usuario
                    LEFT JOIN usuarios u2 ON u2.id_usuario = t.id_asignado_a_usuario
                    WHERE t.id_ticket = $id;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return !empty($vResultado) ? $vResultado[0] : null;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // Listar tickets según rol (método consolidado)
    public function getByRol($rol, $idUsuario)
    {
        try {
            $baseQuery = "SELECT 
                        t.id_ticket,
                        t.titulo,
                        t.descripcion,
                        e.nombre_estado,
                        c.nombre_categoria,
                        s.descripcion AS prioridad,
                        m.nombre AS mascota,
                        u1.nombre_completo AS cliente,
                        u2.nombre_completo AS asignado_a,
                        t.fecha_creacion,
                        t.fecha_cita,
                        s.tiempo_minutos AS sla_respuesta,
                        s.tiempo_resolucion AS sla_resolucion,
                        TIMESTAMPDIFF(MINUTE, t.fecha_creacion, NOW()) AS tiempo_transcurrido
                    FROM tickets t
                    JOIN estadosticket e ON e.id_estado = t.id_estado
                    JOIN categorias c ON c.id_categoria = t.id_categoria
                    JOIN sla s ON s.id_sla = c.id_sla
                    JOIN mascotas m ON m.id_mascota = t.id_mascota
                    JOIN usuarios u1 ON u1.id_usuario = t.id_creado_por_usuario
                    LEFT JOIN usuarios u2 ON u2.id_usuario = t.id_asignado_a_usuario";

            switch ($rol) {
                case 'Administrador':
                    $vSql = $baseQuery . " ORDER BY t.fecha_creacion DESC;";
                    break;
                case 'Cliente':
                    $vSql = $baseQuery . " WHERE t.id_creado_por_usuario = $idUsuario ORDER BY t.fecha_creacion DESC;";
                    break;
                case 'Técnico':
                case 'Veterinario':
                case 'Asistente':
                    $vSql = $baseQuery . " WHERE t.id_asignado_a_usuario = $idUsuario ORDER BY t.fecha_creacion DESC;";
                    break;
                default:
                    throw new Exception('Rol no válido');
            }

            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // Mantener compatibilidad con métodos anteriores
    public function getTicketsByCliente($id_usuario)
    {
        return $this->getByRol('Cliente', $id_usuario);
    }

    public function getTicketsByVeterinario($id_usuario)
    {
        return $this->getByRol('Veterinario', $id_usuario);
    }

    public function create($ticket)
    {
        try {
            $id_asignado = isset($ticket->id_asignado_a_usuario) && $ticket->id_asignado_a_usuario !== null
                ? $ticket->id_asignado_a_usuario
                : 'NULL';

            $fecha_cita = isset($ticket->fecha_cita) && $ticket->fecha_cita !== null
                ? "'$ticket->fecha_cita'"
                : 'NULL';

            // Escapar comillas simples en strings para evitar errores SQL
            $titulo = str_replace("'", "''", $ticket->titulo);
            $descripcion = str_replace("'", "''", $ticket->descripcion);

            $vSql = "INSERT INTO tickets (titulo, descripcion, fecha_creacion, fecha_cita, 
                    id_estado, id_categoria, id_mascota, id_creado_por_usuario, id_asignado_a_usuario) 
                    VALUES ('$titulo', '$descripcion', NOW(), 
                    $fecha_cita, $ticket->id_estado, $ticket->id_categoria, 
                    $ticket->id_mascota, $ticket->id_creado_por_usuario, $id_asignado);";

            $vResultado = $this->enlace->ExecuteSQL_DML_last($vSql);

            // Crear entrada en el histórico usando HistoricoModel
            if ($vResultado) {
                $historicoModel = new HistoricoModel();
                $historico = new stdClass();
                $historico->id_ticket = $vResultado;
                $historico->comentario = 'Ticket creado';
                $historico->estado = 'Abierto';
                $historico->id_usuario = $ticket->id_creado_por_usuario;
                $historicoModel->create($historico);
            }

            return ['id' => $vResultado, 'success' => true];
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function update($id, $ticket)
    {
        try {
            // Obtener ticket anterior para comparar cambios
            $ticketAnterior = $this->get($id);

            // Verificar que el ticket existe
            if (!$ticketAnterior) {
                return ['success' => false, 'error' => 'Ticket no encontrado'];
            }

            // Validar transición de estado si hubo cambio
            if ($ticketAnterior->id_estado != $ticket->id_estado) {
                $transicionValida = $this->validarTransicionEstado(
                    $ticketAnterior->id_estado,
                    $ticket->id_estado
                );

                if (!$transicionValida['valido']) {
                    throw new Exception($transicionValida['mensaje']);
                }
            }

            // Validar que no se puede cambiar de estado sin técnico asignado (excepto Pendiente)
            $estadoNuevo = $this->getEstadoNombre($ticket->id_estado);
            if ($estadoNuevo !== 'Abierto' && $estadoNuevo !== 'Pendiente' && $estadoNuevo !== 'Cancelado') {
                if (!isset($ticket->id_asignado_a_usuario) || $ticket->id_asignado_a_usuario === null || $ticket->id_asignado_a_usuario === '') {
                    throw new Exception("No se puede cambiar a estado '$estadoNuevo' sin un veterinario asignado");
                }
            }

            // Construir query de actualización
            $id_asignado = isset($ticket->id_asignado_a_usuario) && $ticket->id_asignado_a_usuario !== null
                ? $ticket->id_asignado_a_usuario
                : 'NULL';

            $fecha_cita = isset($ticket->fecha_cita) && $ticket->fecha_cita !== null
                ? "'$ticket->fecha_cita'"
                : 'NULL';

            // Escapar comillas simples en strings para evitar errores SQL
            $titulo = str_replace("'", "''", $ticket->titulo);
            $descripcion = str_replace("'", "''", $ticket->descripcion);

            $vSql = "UPDATE tickets SET 
                    titulo = '$titulo',
                    descripcion = '$descripcion',
                    fecha_cita = $fecha_cita,
                    id_estado = $ticket->id_estado,
                    id_categoria = $ticket->id_categoria,
                    id_mascota = $ticket->id_mascota,
                    id_asignado_a_usuario = $id_asignado
                    WHERE id_ticket = $id;";

            $vResultado = $this->enlace->ExecuteSQL_DML($vSql);

            // Crear entrada en el histórico - SIEMPRE se crea
            $historicoModel = new HistoricoModel();

            // Validar que el comentario no esté vacío
            if (!isset($ticket->comentario) || empty(trim($ticket->comentario))) {
                throw new Exception("El comentario es obligatorio para registrar cambios en el histórico");
            }

            // Determinar qué cambió
            $cambioEstado = $ticketAnterior->id_estado != $ticket->id_estado;

            // Comparar asignaciones considerando NULL y valores vacíos
            $asignadoAnterior = $ticketAnterior->id_asignado_a_usuario ?? null;
            $asignadoNuevo = $ticket->id_asignado_a_usuario ?? null;

            // Normalizar valores vacíos a null
            if ($asignadoAnterior === '' || $asignadoAnterior === 'NULL') {
                $asignadoAnterior = null;
            }
            if ($asignadoNuevo === '' || $asignadoNuevo === 'NULL') {
                $asignadoNuevo = null;
            }

            $cambioAsignacion = $asignadoAnterior != $asignadoNuevo;

            // Registrar cambio de estado si aplica
            if ($cambioEstado) {
                $historico = new stdClass();
                $historico->id_ticket = $id;
                $historico->comentario = $ticket->comentario;
                $historico->estado = $this->getEstadoNombre($ticket->id_estado);
                $historico->id_usuario = $ticket->id_usuario;
                $historicoModel->create($historico);
            }

            // Registrar reasignación si aplica (independiente del cambio de estado)
            if ($cambioAsignacion) {
                $historico = new stdClass();
                $historico->id_ticket = $id;
                $historico->comentario = $ticket->comentario;
                $historico->estado = $this->getEstadoNombre($ticket->id_estado);
                $historico->id_usuario = $ticket->id_usuario;

                // Solo crear si no se registró ya por cambio de estado
                if (!$cambioEstado) {
                    $historicoModel->create($historico);
                }
            }

            // Si no hubo cambios significativos pero hay comentario, registrar como actualización general
            if (!$cambioEstado && !$cambioAsignacion) {
                $historico = new stdClass();
                $historico->id_ticket = $id;
                $historico->comentario = $ticket->comentario;
                $historico->estado = $this->getEstadoNombre($ticket->id_estado);
                $historico->id_usuario = $ticket->id_usuario;
                $historicoModel->create($historico);
            }

            return ['id' => $id, 'success' => true];
        } catch (Exception $e) {
            handleException($e);
        }
    }

    private function getEstadoNombre($id_estado)
    {
        try {
            $vSql = "SELECT nombre_estado FROM estadosticket WHERE id_estado = $id_estado;";
            $resultado = $this->enlace->ExecuteSQL($vSql);
            if ($resultado && !empty($resultado)) {
                return $resultado[0]->nombre_estado;
            }
            return 'Desconocido';
        } catch (Exception $e) {
            error_log("Error en getEstadoNombre: " . $e->getMessage());
            return 'Desconocido';
        }
    }

    private function getUsuarioNombre($id_usuario)
    {
        try {
            $vSql = "SELECT nombre_completo FROM usuarios WHERE id_usuario = $id_usuario;";
            $resultado = $this->enlace->ExecuteSQL($vSql);
            if ($resultado && !empty($resultado)) {
                return $resultado[0]->nombre_completo;
            }
            return 'Usuario desconocido';
        } catch (Exception $e) {
            error_log("Error en getUsuarioNombre: " . $e->getMessage());
            return 'Usuario desconocido';
        }
    }

    private function validarTransicionEstado($id_estado_actual, $id_estado_nuevo)
    {
        // Obtener nombres de estados
        $estadoActual = $this->getEstadoNombre($id_estado_actual);
        $estadoNuevo = $this->getEstadoNombre($id_estado_nuevo);

        // Definir flujo válido: Pendiente/Abierto → En proceso → Cerrado
        // También se permite Cancelado desde cualquier estado
        $transicionesValidas = [
            'Abierto' => ['En proceso', 'Cancelado'],
            'Pendiente' => ['En proceso', 'Cancelado'],
            'En proceso' => ['Cerrado', 'Cancelado'],
            'Cerrado' => [], // No se puede cambiar desde cerrado
            'Cancelado' => [] // No se puede cambiar desde cancelado
        ];

        // Si el estado no cambió, es válido
        if ($estadoActual === $estadoNuevo) {
            return ['valido' => true];
        }

        // Verificar si la transición está permitida
        if (!isset($transicionesValidas[$estadoActual])) {
            return [
                'valido' => false,
                'mensaje' => "Estado actual '$estadoActual' no es válido"
            ];
        }

        if (!in_array($estadoNuevo, $transicionesValidas[$estadoActual])) {
            return [
                'valido' => false,
                'mensaje' => "No se puede cambiar de '$estadoActual' a '$estadoNuevo'. Estados permitidos: "
                    . implode(', ', $transicionesValidas[$estadoActual])
            ];
        }

        return ['valido' => true];
    }

    public function delete($id)
    {
        try {
            // Primero eliminamos el histórico relacionado
            $vSql = "DELETE FROM historico WHERE id_ticket = $id;";
            $this->enlace->ExecuteSQL($vSql);

            // Luego eliminamos el ticket
            $vSql = "DELETE FROM tickets WHERE id_ticket = $id;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getHistorico($id_ticket)
    {
        try {
            $vSql = "SELECT h.*, u.nombre_completo as usuario 
                    FROM historico h 
                    JOIN usuarios u ON h.id_usuario = u.id_usuario 
                    WHERE h.id_ticket = $id_ticket 
                    ORDER BY h.fecha DESC;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getImagenes($id_ticket)
    {
        try {
            $vSql = "SELECT * FROM ticketimage WHERE id_ticket = $id_ticket ORDER BY created_at DESC;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function createImage($id_ticket, $nombreArchivo)
    {
        try {
            $vSql = "INSERT INTO ticketimage (id_ticket, imagen, created_at) 
                     VALUES ($id_ticket, '$nombreArchivo', NOW());";
            $lastId = $this->enlace->ExecuteSQL_DML_last($vSql);

            // Retornar el ID insertado
            return [
                'id_imagen' => $lastId,
                'id_ticket' => $id_ticket,
                'imagen' => $nombreArchivo
            ];
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
