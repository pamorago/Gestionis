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
                        u.estado as activo,
                        24 as carga_maxima,
                        CAST(COALESCE(SUM(CASE WHEN e.nombre_estado IN ('Abierto', 'En proceso') THEN s.tiempo_resolucion / 60 END), 0) AS UNSIGNED) as carga_actual,
                        SUBSTRING(u.email, 1, LOCATE('@', u.email) - 1) as cedula,
                        COALESCE(COUNT(CASE WHEN e.nombre_estado IN ('Abierto', 'En proceso') THEN 1 END), 0) AS tickets_activos,
                        CAST((24 - COALESCE(SUM(CASE WHEN e.nombre_estado IN ('Abierto', 'En proceso') THEN s.tiempo_resolucion / 60 END), 0)) AS UNSIGNED) AS horas_disponibles
                    FROM usuarios u
                    LEFT JOIN tickets t ON u.id_usuario = t.id_asignado_a_usuario
                    LEFT JOIN estadosticket e ON e.id_estado = t.id_estado
                    LEFT JOIN categorias c ON c.id_categoria = t.id_categoria
                    LEFT JOIN sla s ON s.id_sla = c.id_sla
                    WHERE u.id_rol = 2
                    GROUP BY u.id_usuario
                    ORDER BY u.nombre_completo;";
            $vResultado = $this->enlace->executeSQL($vSql);

            // Cargar especialidades para cada veterinario
            if ($vResultado && is_array($vResultado)) {
                foreach ($vResultado as $veterinario) {
                    $veterinario->especialidades = $this->getEspecialidades($veterinario->id_veterinario);
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
                        u.estado as activo,
                        24 as carga_maxima,
                        CAST(COALESCE(SUM(CASE WHEN e.nombre_estado IN ('Abierto', 'En proceso') THEN s.tiempo_resolucion / 60 END), 0) AS UNSIGNED) as carga_actual,
                        '' as cedula,
                        COALESCE(COUNT(CASE WHEN e.nombre_estado IN ('Abierto', 'En proceso') THEN 1 END), 0) AS tickets_activos,
                        COALESCE(COUNT(CASE WHEN e.nombre_estado = 'Cerrado' THEN 1 END), 0) AS tickets_cerrados,
                        CAST((24 - COALESCE(SUM(CASE WHEN e.nombre_estado IN ('Abierto', 'En proceso') THEN s.tiempo_resolucion / 60 END), 0)) AS UNSIGNED) AS horas_disponibles
                    FROM usuarios u
                    LEFT JOIN tickets t ON u.id_usuario = t.id_asignado_a_usuario
                    LEFT JOIN estadosticket e ON e.id_estado = t.id_estado
                    LEFT JOIN categorias c ON c.id_categoria = t.id_categoria
                    LEFT JOIN sla s ON s.id_sla = c.id_sla
                    WHERE u.id_rol = 2 AND u.id_usuario = $id
                    GROUP BY u.id_usuario;";
            $vResultado = $this->enlace->executeSQL($vSql);

            if ($vResultado && !empty($vResultado)) {
                $veterinario = $vResultado[0];

                // Cargar especialidades desde la tabla de relación
                $veterinario->especialidades = $this->getEspecialidades($id);

                // Obtener tickets asignados
                $veterinario->tickets_asignados = $this->getTicketsAsignados($id);

                return $veterinario;
            }
            return null;
        } catch (Exception $e) {
            error_log("Error en VeterinarioModel::get: " . $e->getMessage());
            throw new Exception("Error al obtener veterinario: " . $e->getMessage());
        }
    }

    // Obtener especialidades de un veterinario
    private function getEspecialidades($id_veterinario)
    {
        try {
            $vSql = "SELECT e.nombre_especialidad 
                    FROM especialidades e
                    INNER JOIN veterinario_especialidades ve ON e.id_especialidad = ve.id_especialidad
                    WHERE ve.id_veterinario = $id_veterinario
                    ORDER BY e.nombre_especialidad;";
            $resultado = $this->enlace->ExecuteSQL($vSql);

            $especialidades = [];
            if (is_array($resultado)) {
                foreach ($resultado as $row) {
                    $especialidades[] = $row->nombre_especialidad;
                }
            }
            return $especialidades;
        } catch (Exception $e) {
            return [];
        }
    }

    // Obtener tickets asignados a un veterinario
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
                        CAST(s.tiempo_resolucion / 60 AS UNSIGNED) as horas_estimadas,
                        t.fecha_creacion,
                        t.fecha_cita,
                        m.nombre AS mascota,
                        u1.nombre_completo AS cliente
                    FROM tickets t
                    JOIN estadosticket e ON e.id_estado = t.id_estado
                    JOIN categorias c ON c.id_categoria = t.id_categoria
                    JOIN sla s ON s.id_sla = c.id_sla
                    LEFT JOIN mascotas m ON m.id_mascota = t.id_mascota
                    LEFT JOIN usuarios u1 ON u1.id_usuario = t.id_creado_por_usuario
                    WHERE t.id_asignado_a_usuario = $id
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
