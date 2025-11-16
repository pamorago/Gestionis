<?php
class VeterinarioModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    // Listado general de veterinarios
    public function all()
    {
        try {
            $vSql = "SELECT 
                        u.id_usuario AS id_veterinario,
                        u.nombre_completo AS nombre_veterinario,
                        u.email,
                        u.telefono,
                        u.especialidad,
                        u.estado as activo,
                        u.carga_maxima,
                        SUBSTRING(u.email, 1, LOCATE('@', u.email) - 1) as cedula,
                        COALESCE(COUNT(CASE WHEN e.nombre_estado IN ('Abierto', 'En proceso') THEN 1 END), 0) AS tickets_activos,
                        COALESCE(SUM(CASE WHEN vt.estado_asignacion = 'activo' THEN vt.horas_estimadas ELSE 0 END), 0) AS horas_comprometidas,
                        (u.carga_maxima - COALESCE(SUM(CASE WHEN vt.estado_asignacion = 'activo' THEN vt.horas_estimadas ELSE 0 END), 0)) AS horas_disponibles
                    FROM usuarios u
                    LEFT JOIN veterinario_tickets vt ON u.id_usuario = vt.id_veterinario AND vt.estado_asignacion = 'activo'
                    LEFT JOIN tickets t ON vt.id_ticket = t.id_ticket
                    LEFT JOIN estadosticket e ON e.id_estado = t.id_estado
                    WHERE u.id_rol = 2
                    GROUP BY u.id_usuario, u.carga_maxima
                    ORDER BY u.nombre_completo;";
            $vResultado = $this->enlace->executeSQL($vSql);

            // Convertir especialidades de string a array para cada veterinario
            if ($vResultado && is_array($vResultado)) {
                foreach ($vResultado as $veterinario) {
                    if ($veterinario->especialidad) {
                        $veterinario->especialidades = array_map('trim', explode(',', $veterinario->especialidad));
                    } else {
                        $veterinario->especialidades = [];
                    }
                }
            }

            return $vResultado;
        } catch (Exception $e) {
            error_log("Error en VeterinarioModel::all: " . $e->getMessage());
            throw new Exception("Error al listar veterinarios: " . $e->getMessage());
        }
    }    // Detalle de veterinario
    public function get($id)
    {
        try {
            $id = (int)$id;
            $vSql = "SELECT 
                        u.id_usuario AS id_veterinario,
                        u.nombre_completo AS nombre_veterinario,
                        u.email,
                        u.telefono,
                        u.especialidad,
                        u.estado as activo,
                        u.carga_maxima,
                        '' as cedula,
                        COALESCE(COUNT(vt.id_ticket), 0) AS total_tickets,
                        COALESCE(SUM(CASE WHEN e.nombre_estado = 'Cerrado' THEN 1 ELSE 0 END), 0) AS tickets_cerrados,
                        COALESCE(SUM(CASE WHEN e.nombre_estado = 'En proceso' THEN 1 ELSE 0 END), 0) AS tickets_en_proceso,
                        COALESCE(SUM(CASE WHEN e.nombre_estado = 'Abierto' THEN 1 ELSE 0 END), 0) AS tickets_abiertos,
                        COALESCE(SUM(CASE WHEN vt.estado_asignacion = 'activo' THEN vt.horas_estimadas ELSE 0 END), 0) AS horas_comprometidas,
                        (u.carga_maxima - COALESCE(SUM(CASE WHEN vt.estado_asignacion = 'activo' THEN vt.horas_estimadas ELSE 0 END), 0)) AS horas_disponibles
                    FROM usuarios u
                    LEFT JOIN veterinario_tickets vt ON u.id_usuario = vt.id_veterinario
                    LEFT JOIN tickets t ON vt.id_ticket = t.id_ticket
                    LEFT JOIN estadosticket e ON e.id_estado = t.id_estado
                    WHERE u.id_rol = 2 AND u.id_usuario = $id
                    GROUP BY u.id_usuario, u.carga_maxima;";
            $vResultado = $this->enlace->executeSQL($vSql);

            if ($vResultado && !empty($vResultado)) {
                $veterinario = $vResultado[0];
                // Convertir especialidades de string a array
                if ($veterinario->especialidad) {
                    $veterinario->especialidades = array_map('trim', explode(',', $veterinario->especialidad));
                } else {
                    $veterinario->especialidades = [];
                }

                // Obtener tickets asignados
                $veterinario->tickets_asignados = $this->getTicketsAsignados($id);

                return $veterinario;
            }
            return null;
        } catch (Exception $e) {
            error_log("Error en VeterinarioModel::get: " . $e->getMessage());
            throw new Exception("Error al obtener veterinario: " . $e->getMessage());
        }
    }    // Obtener tickets asignados a un veterinario
    public function getTicketsAsignados($id)
    {
        try {
            $vSql = "SELECT 
                        t.id_ticket,
                        t.titulo,
                        t.descripcion,
                        e.nombre_estado,
                        c.nombre_categoria,
                        s.descripcion AS prioridad,
                        COALESCE(vt.horas_estimadas, 1.0) as horas_estimadas,
                        vt.estado_asignacion,
                        vt.fecha_asignacion,
                        m.nombre AS mascota,
                        u1.nombre_completo AS cliente,
                        t.fecha_creacion,
                        t.fecha_cita
                    FROM veterinario_tickets vt
                    JOIN tickets t ON vt.id_ticket = t.id_ticket
                    JOIN estadosticket e ON e.id_estado = t.id_estado
                    JOIN categorias c ON c.id_categoria = t.id_categoria
                    JOIN sla s ON s.id_sla = c.id_sla
                    LEFT JOIN mascotas m ON m.id_mascota = t.id_mascota
                    LEFT JOIN usuarios u1 ON u1.id_usuario = t.id_creado_por_usuario
                    WHERE vt.id_veterinario = $id AND vt.estado_asignacion = 'activo'
                    ORDER BY t.fecha_cita DESC;";
            $vResultado = $this->enlace->executeSQL($vSql);
            return $vResultado ?: [];
        } catch (Exception $e) {
            error_log("Error en VeterinarioModel::getTicketsAsignados: " . $e->getMessage());
            return [];
        }
    }

    // Crear veterinario
    public function create($data)
    {
        try {
            // Validar campos obligatorios
            if (!isset($data->nombre_veterinario) || !isset($data->email)) {
                throw new Exception("Faltan campos obligatorios para crear el veterinario");
            }

            // Verificar si el email ya existe
            $emailCheck = $this->enlace->executeSQL("SELECT id_usuario FROM usuarios WHERE email = '$data->email'");
            if (!empty($emailCheck)) {
                throw new Exception("Ya existe un usuario con este email");
            }

            // Convertir array de especialidades a string
            $especialidades_str = '';
            if (isset($data->especialidades) && is_array($data->especialidades)) {
                $especialidades_str = implode(', ', $data->especialidades);
            } elseif (isset($data->especialidades)) {
                $especialidades_str = $data->especialidades;
            }

            // Generar contraseña temporal (email sin dominio)
            $password_temp = explode('@', $data->email)[0] . '123';
            $password_hash = password_hash($password_temp, PASSWORD_BCRYPT);

            // Preparar valores para inserción
            $telefono = isset($data->telefono) ? $data->telefono : '';
            $estado = isset($data->activo) ? ($data->activo ? 'TRUE' : 'FALSE') : 'TRUE';
            $carga_maxima = isset($data->carga_maxima) ? (int)$data->carga_maxima : 24;

            // Insertar veterinario (usuario con rol 2)
            $vSql = "INSERT INTO usuarios (nombre_completo, email, password, telefono, id_rol, especialidad, estado, carga_maxima) 
                     VALUES ('$data->nombre_veterinario', '$data->email', '$password_hash', '$telefono', 2, '$especialidades_str', $estado, $carga_maxima)";

            $id_veterinario = $this->enlace->executeSQL_DML_last($vSql);

            if ($id_veterinario) {
                return [
                    'id' => $id_veterinario,
                    'success' => true,
                    'message' => 'Veterinario creado exitosamente',
                    'password_temporal' => $password_temp
                ];
            } else {
                throw new Exception("Error al crear el veterinario");
            }
        } catch (Exception $e) {
            error_log("Error en VeterinarioModel::create: " . $e->getMessage());
            throw new Exception("Error al crear veterinario: " . $e->getMessage());
        }
    }

    // Actualizar veterinario
    public function update($data)
    {
        try {
            // Validar campos obligatorios
            if (!isset($data->id_veterinario) || !isset($data->nombre_veterinario) || !isset($data->email)) {
                throw new Exception("Faltan campos obligatorios para actualizar el veterinario");
            }

            // Validar ID y preparar datos
            $id_veterinario = (int)$data->id_veterinario;
            $telefono = isset($data->telefono) ? $data->telefono : '';
            $estado = isset($data->activo) ? ($data->activo ? 'TRUE' : 'FALSE') : 'TRUE';
            $carga_maxima = isset($data->carga_maxima) ? (int)$data->carga_maxima : 24;

            // Verificar si el email ya existe (excluyendo el veterinario actual)
            $emailCheck = $this->enlace->executeSQL(
                "SELECT id_usuario FROM usuarios WHERE email = '$data->email' AND id_usuario != $id_veterinario"
            );
            if (!empty($emailCheck)) {
                throw new Exception("Ya existe otro usuario con este email");
            }

            // Convertir array de especialidades a string
            $especialidades_str = '';
            if (isset($data->especialidades) && is_array($data->especialidades)) {
                $especialidades_str = implode(', ', $data->especialidades);
            } elseif (isset($data->especialidades)) {
                $especialidades_str = $data->especialidades;
            }

            // Actualizar veterinario
            $vSql = "UPDATE usuarios SET 
                        nombre_completo = '$data->nombre_veterinario',
                        email = '$data->email',
                        telefono = '$telefono',
                        especialidad = '$especialidades_str',
                        estado = $estado,
                        carga_maxima = $carga_maxima
                     WHERE id_usuario = $id_veterinario AND id_rol = 2";

            $vResultado = $this->enlace->executeSQL_DML($vSql);

            if ($vResultado !== false) {
                return ['success' => true, 'message' => 'Veterinario actualizado exitosamente'];
            } else {
                throw new Exception("Error al actualizar el veterinario o el veterinario no existe");
            }
        } catch (Exception $e) {
            error_log("Error en VeterinarioModel::update: " . $e->getMessage());
            throw new Exception("Error al actualizar veterinario: " . $e->getMessage());
        }
    }

    // Eliminar veterinario
    public function delete($id)
    {
        try {
            // Verificar si el veterinario tiene tickets asociados
            $ticketsCheck = $this->enlace->executeSQL(
                "SELECT COUNT(*) as total FROM tickets WHERE id_asignado_a_usuario = $id"
            );

            if (!empty($ticketsCheck) && $ticketsCheck[0]->total > 0) {
                throw new Exception("No se puede eliminar el veterinario porque tiene tickets asociados");
            }

            // Eliminar veterinario (solo usuarios con rol 2)
            $vSql = "DELETE FROM usuarios WHERE id_usuario = $id AND id_rol = 2";
            $vResultado = $this->enlace->executeSQL_DML($vSql);

            if ($vResultado !== false) {
                return ['success' => true, 'affected_rows' => $vResultado, 'message' => 'Veterinario eliminado exitosamente'];
            } else {
                throw new Exception("Error al eliminar el veterinario o el veterinario no existe");
            }
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
