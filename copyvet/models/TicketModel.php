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

            $vSql = "INSERT INTO tickets (titulo, descripcion, fecha_creacion, fecha_cita, 
                    id_estado, id_categoria, id_mascota, id_creado_por_usuario, id_asignado_a_usuario) 
                    VALUES ('$ticket->titulo', '$ticket->descripcion', NOW(), 
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

            // Construir query de actualización
            $id_asignado = isset($ticket->id_asignado_a_usuario) && $ticket->id_asignado_a_usuario !== null
                ? $ticket->id_asignado_a_usuario
                : 'NULL';

            $fecha_cita = isset($ticket->fecha_cita) && $ticket->fecha_cita !== null
                ? "'$ticket->fecha_cita'"
                : 'NULL';

            $vSql = "UPDATE tickets SET 
                    titulo = '$ticket->titulo',
                    descripcion = '$ticket->descripcion',
                    fecha_cita = $fecha_cita,
                    id_estado = $ticket->id_estado,
                    id_categoria = $ticket->id_categoria,
                    id_mascota = $ticket->id_mascota,
                    id_asignado_a_usuario = $id_asignado
                    WHERE id_ticket = $id;";

            $vResultado = $this->enlace->ExecuteSQL_DML($vSql);

            // Crear entrada en el histórico - SIEMPRE se crea (incluso si no hubo cambios)
            // $vResultado puede ser 0 si no hubo cambios en los datos
            $historicoModel = new HistoricoModel();
            $historico = new stdClass();
            $historico->id_ticket = $id;

            // Determinar qué cambió para el comentario
            $cambios = [];
            if ($ticketAnterior->id_estado != $ticket->id_estado) {
                $estadoNuevo = $this->getEstadoNombre($ticket->id_estado);
                $cambios[] = "Estado cambiado a: $estadoNuevo";
            }
            if ($ticketAnterior->titulo != $ticket->titulo) {
                $cambios[] = "Título actualizado";
            }
            if ($ticketAnterior->descripcion != $ticket->descripcion) {
                $cambios[] = "Descripción actualizada";
            }
            if ($ticketAnterior->id_asignado_a_usuario != $ticket->id_asignado_a_usuario) {
                $cambios[] = "Veterinario asignado actualizado";
            }

            // Si hay comentario personalizado, usarlo; sino, usar resumen de cambios
            if (isset($ticket->comentario) && !empty($ticket->comentario)) {
                $historico->comentario = $ticket->comentario;
            } else {
                $historico->comentario = count($cambios) > 0
                    ? 'Ticket actualizado: ' . implode(', ', $cambios)
                    : 'Ticket actualizado';
            }

            $historico->estado = $this->getEstadoNombre($ticket->id_estado);
            $historico->id_usuario = $ticket->id_usuario;

            $historicoModel->create($historico);

            return ['id' => $id, 'success' => true];
        } catch (Exception $e) {
            handleException($e);
        }
    }

    private function getEstadoNombre($id_estado)
    {
        $vSql = "SELECT nombre_estado FROM estadosticket WHERE id_estado = $id_estado;";
        $resultado = $this->enlace->ExecuteSQL($vSql);
        return $resultado[0]->nombre_estado;
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
            $this->enlace->ExecuteSQL_DML($vSql);

            // Retornar el ID insertado
            $lastId = $this->enlace->getLastInsertId();
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
