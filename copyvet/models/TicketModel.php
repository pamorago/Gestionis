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
            $vSql = "SELECT * FROM vista_tickets;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($id)
    {
        try {
            $vSql = "SELECT * FROM vista_detalle_ticket WHERE id_ticket = $id;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado[0];
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // Listar tickets según rol (método consolidado)
    public function getByRol($rol, $idUsuario)
    {
        try {
            switch ($rol) {
                case 'Administrador':
                    $vSql = "SELECT * FROM vista_tickets;";
                    break;
                case 'Cliente':
                    $vSql = "SELECT * FROM vista_tickets WHERE cliente = (
                                SELECT nombre_completo FROM usuarios WHERE id_usuario = $idUsuario
                             );";
                    break;
                case 'Técnico':
                case 'Veterinario':
                    $vSql = "SELECT * FROM vista_tickets WHERE tecnico = (
                                SELECT nombre_completo FROM usuarios WHERE id_usuario = $idUsuario
                             ) OR veterinario = (
                                SELECT nombre_completo FROM usuarios WHERE id_usuario = $idUsuario
                             );";
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
            $vSql = "INSERT INTO tickets (titulo, descripcion, fecha_creacion, fecha_cita, 
                    id_estado, id_categoria, id_mascota, id_creado_por_usuario, id_asignado_a_usuario) 
                    VALUES ('$ticket->titulo', '$ticket->descripcion', NOW(), 
                    '$ticket->fecha_cita', $ticket->id_estado, $ticket->id_categoria, 
                    $ticket->id_mascota, $ticket->id_creado_por_usuario, $ticket->id_asignado_a_usuario);";

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

            return $this->get($vResultado);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function update($id, $ticket)
    {
        try {
            $vSql = "UPDATE tickets SET 
                    titulo = '$ticket->titulo',
                    descripcion = '$ticket->descripcion',
                    fecha_cita = '$ticket->fecha_cita',
                    id_estado = $ticket->id_estado,
                    id_categoria = $ticket->id_categoria,
                    id_mascota = $ticket->id_mascota,
                    id_asignado_a_usuario = $ticket->id_asignado_a_usuario
                    WHERE id_ticket = $id;";

            $vResultado = $this->enlace->ExecuteSQL($vSql);

            // Agregar entrada al histórico usando HistoricoModel
            if ($vResultado && isset($ticket->comentario)) {
                $estado = $this->getEstadoNombre($ticket->id_estado);

                $historicoModel = new HistoricoModel();
                $historico = new stdClass();
                $historico->id_ticket = $id;
                $historico->comentario = $ticket->comentario;
                $historico->estado = $estado;
                $historico->id_usuario = $ticket->id_usuario;
                $historicoModel->create($historico);
            }

            return $this->get($id);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    private function getEstadoNombre($id_estado)
    {
        $vSql = "SELECT nombre_estado FROM estadosticket WHERE id_estado = $id_estado;";
        $resultado = $this->enlace->ExecuteSQL($vSql);
        return $resultado[0]['nombre_estado'];
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
}
