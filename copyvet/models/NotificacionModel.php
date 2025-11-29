<?php

class NotificacionModel
{
    private $enlace;
    private $sanitize;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
        // Define a fallback sanitize function if MySqlConnect does not have one
        $this->sanitize = method_exists($this->enlace, 'sanitize')
            ? [$this->enlace, 'sanitize']
            : function ($value) {
                return addslashes($value);
            };
    }

    // Obtener todas las notificaciones de un usuario
    public function getByUsuario($id_usuario)
    {
        try {
            $vSql = "SELECT 
                        id_notificacion,
                        tipo,
                        descripcion,
                        fecha_evento,
                        id_usuario,
                        id_evento,
                        estado_leida,
                        importancia,
                        responsable
                    FROM notificaciones
                    WHERE id_usuario = $id_usuario
                    ORDER BY fecha_evento DESC";
            $result = $this->enlace->ExecuteSQL($vSql);

            // Convertir tipos de datos para el frontend
            if ($result && is_array($result)) {
                foreach ($result as $notif) {
                    $notif->estado_leida = (bool)$notif->estado_leida;
                    $notif->id_notificacion = (int)$notif->id_notificacion;
                    $notif->id_usuario = (int)$notif->id_usuario;
                    $notif->id_evento = $notif->id_evento ? (int)$notif->id_evento : null;
                }
            }

            return $result;
        } catch (Exception $e) {
            throw $e;
        }
    }

    // Obtener notificaciones no leídas de un usuario
    public function getNoLeidas($id_usuario)
    {
        try {
            $vSql = "SELECT 
                        id_notificacion,
                        tipo,
                        descripcion,
                        fecha_evento,
                        id_usuario,
                        id_evento,
                        estado_leida,
                        importancia,
                        responsable
                    FROM notificaciones
                    WHERE id_usuario = $id_usuario 
                    AND estado_leida = FALSE
                    ORDER BY fecha_evento DESC";
            $result = $this->enlace->ExecuteSQL($vSql);

            // Convertir tipos de datos para el frontend
            if ($result && is_array($result)) {
                foreach ($result as $notif) {
                    $notif->estado_leida = (bool)$notif->estado_leida;
                    $notif->id_notificacion = (int)$notif->id_notificacion;
                    $notif->id_usuario = (int)$notif->id_usuario;
                    $notif->id_evento = $notif->id_evento ? (int)$notif->id_evento : null;
                }
            }

            return $result;
        } catch (Exception $e) {
            throw $e;
        }
    }

    // Contar notificaciones no leídas
    public function contarNoLeidas($id_usuario)
    {
        try {
            $vSql = "SELECT COUNT(*) as total 
                    FROM notificaciones
                    WHERE id_usuario = $id_usuario 
                    AND estado_leida = FALSE";
            $result = $this->enlace->ExecuteSQL($vSql);
            return $result ? $result[0]->total : 0;
        } catch (Exception $e) {
            throw $e;
        }
    }

    // Obtener una notificación específica
    public function get($id_notificacion)
    {
        try {
            $vSql = "SELECT 
                        id_notificacion,
                        tipo,
                        descripcion,
                        fecha_evento,
                        id_usuario,
                        id_evento,
                        estado_leida,
                        importancia,
                        responsable
                    FROM notificaciones
                    WHERE id_notificacion = $id_notificacion";
            $result = $this->enlace->ExecuteSQL($vSql);
            return $result ? $result[0] : null;
        } catch (Exception $e) {
            throw $e;
        }
    }

    // Crear una notificación
    public function create($data)
    {
        try {
            if (!isset($data->tipo) || !isset($data->descripcion) || !isset($data->id_usuario)) {
                throw new Exception("Faltan campos requeridos para crear la notificación");
            }

            $tipo = call_user_func($this->sanitize, $data->tipo);
            $descripcion = call_user_func($this->sanitize, $data->descripcion);
            $id_usuario = (int)$data->id_usuario;
            $id_evento = isset($data->id_evento) ? (int)$data->id_evento : 'NULL';
            $importancia = isset($data->importancia) ? call_user_func($this->sanitize, $data->importancia) : 'normal';
            $responsable = isset($data->responsable) ? call_user_func($this->sanitize, $data->responsable) : 'NULL';
            $vSql = "INSERT INTO notificaciones
                            (tipo, descripcion, id_usuario, id_evento, importancia, responsable, estado_leida, fecha_evento)
                            VALUES 
                            ('$tipo', '$descripcion', $id_usuario, $id_evento, '$importancia', $responsable, FALSE, NOW())";

            $result = $this->enlace->executeSQL_DML_last($vSql);
            return $result;
        } catch (Exception $e) {
            throw $e;
        }
    }

    // Marcar como leída
    public function marcarComoLeida($id_notificacion, $id_usuario)
    {
        try {
            // Validar que la notificación pertenece al usuario
            $notificacion = $this->get($id_notificacion);
            if (!$notificacion || $notificacion->id_usuario != $id_usuario) {
                throw new Exception("No autorizado para modificar esta notificación");
            }

            $vSql = "UPDATE notificaciones 
                    SET estado_leida = TRUE 
                    WHERE id_notificacion = $id_notificacion 
                    AND id_usuario = $id_usuario";

            return $this->enlace->ExecuteSQL_DML($vSql);
        } catch (Exception $e) {
            throw $e;
        }
    }

    // Marcar todas como leídas
    public function marcarTodasComoLeidas($id_usuario)
    {
        try {
            $vSql = "UPDATE notificaciones 
                    SET estado_leida = TRUE 
                    WHERE id_usuario = $id_usuario 
                    AND estado_leida = FALSE";

            return $this->enlace->ExecuteSQL_DML($vSql);
        } catch (Exception $e) {
            throw $e;
        }
    }

    // Crear notificación de cambio de estado de ticket (helper)
    public function crearNotificacionTicket($id_ticket, $id_usuario_destinatario, $estado_anterior, $estado_nuevo, $id_usuario_responsable)
    {
        try {
            $descripcion = "El ticket ha cambiado de estado: $estado_anterior → $estado_nuevo";
            $importancia = in_array($estado_nuevo, ['Urgente', 'En proceso']) ? 'alta' : 'normal';

            $data = new stdClass();
            $data->tipo = 'ticket_estado';
            $data->descripcion = $descripcion;
            $data->id_usuario = $id_usuario_destinatario;
            $data->id_evento = $id_ticket;
            $data->importancia = $importancia;
            $data->responsable = null;

            // Obtener nombre del usuario responsable
            $vSql = "SELECT nombre_completo FROM usuarios WHERE id_usuario = $id_usuario_responsable";
            $usuario = $this->enlace->ExecuteSQL($vSql);
            if ($usuario) {
                $data->responsable = $usuario[0]->nombre_completo;
            }

            return $this->create($data);
        } catch (Exception $e) {
            throw $e;
        }
    }

    // Crear notificación de login
    public function crearNotificacionLogin($id_usuario)
    {
        try {
            $data = new stdClass();
            $data->tipo = 'login';
            $data->descripcion = "Has iniciado sesión en el sistema";
            $data->id_usuario = $id_usuario;
            $data->importancia = 'baja';

            return $this->create($data);
        } catch (Exception $e) {
            throw $e;
        }
    }

    // Obtener notificaciones por tipo
    public function getByTipo($id_usuario, $tipo)
    {
        try {
            $tipo_sanitized = call_user_func($this->sanitize, $tipo);
            $vSql = "SELECT 
                        id_notificacion,
                        tipo,
                        descripcion,
                        fecha_evento,
                        id_usuario,
                        id_evento,
                        estado_leida,
                        importancia,
                        responsable
                    FROM notificaciones
                    WHERE id_usuario = $id_usuario 
                    AND tipo = '$tipo_sanitized'
                    ORDER BY fecha_evento DESC";
            $result = $this->enlace->ExecuteSQL($vSql);
            return $result;
        } catch (Exception $e) {
            throw $e;
        }
    }

    // Actualizar una notificación
    public function update($id_notificacion, $data)
    {
        try {
            $updates = [];

            if (isset($data->descripcion)) {
                $descripcion = call_user_func($this->sanitize, $data->descripcion);
                $updates[] = "descripcion = '$descripcion'";
            }

            if (isset($data->estado_leida)) {
                $estado = $data->estado_leida ? 'TRUE' : 'FALSE';
                $updates[] = "estado_leida = $estado";
            }

            if (isset($data->importancia)) {
                $importancia = call_user_func($this->sanitize, $data->importancia);
                $updates[] = "importancia = '$importancia'";
            }
            if (empty($updates)) {
                throw new Exception("No hay campos para actualizar");
            }

            $vSql = "UPDATE notificaciones SET " . implode(", ", $updates) . " WHERE id_notificacion = $id_notificacion";
            return $this->enlace->ExecuteSQL($vSql);
        } catch (Exception $e) {
            throw $e;
        }
    }

    // Eliminar una notificación
    public function delete($id_notificacion)
    {
        try {
            $vSql = "DELETE FROM notificaciones WHERE id_notificacion = $id_notificacion";
            return $this->enlace->ExecuteSQL($vSql);
        } catch (Exception $e) {
            throw $e;
        }
    }

    // Eliminar notificaciones antiguas (limpieza)
    public function limpiarAntiguas($dias = 30)
    {
        try {
            $vSql = "DELETE FROM notificaciones 
                    WHERE fecha_evento < DATE_SUB(NOW(), INTERVAL $dias DAY) 
                    AND estado_leida = TRUE";

            return $this->enlace->ExecuteSQL($vSql);
        } catch (Exception $e) {
            throw $e;
        }
    }
}
