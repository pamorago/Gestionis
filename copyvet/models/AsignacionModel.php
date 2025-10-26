<?php
class AsignacionModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    // Ver todas las asignaciones (para tablero o calendario)
    public function all()
    {
        try {
            $vSql = "SELECT 
                        t.id_ticket,
                        t.titulo,
                        t.descripcion,
                        t.fecha_cita,
                        e.nombre_estado,
                        c.nombre_categoria,
                        m.nombre AS mascota,
                        u1.nombre_completo AS cliente,
                        u2.nombre_completo AS asignado_a,
                        u2.id_usuario AS id_asignado_a_usuario
                    FROM tickets t
                    JOIN estadosticket e ON e.id_estado = t.id_estado
                    JOIN categorias c ON c.id_categoria = t.id_categoria
                    JOIN mascotas m ON m.id_mascota = t.id_mascota
                    JOIN usuarios u1 ON u1.id_usuario = t.id_creado_por_usuario
                    JOIN usuarios u2 ON u2.id_usuario = t.id_asignado_a_usuario
                    WHERE e.nombre_estado IN ('Abierto', 'En proceso')
                    ORDER BY t.fecha_cita ASC;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // Asignaciones de un asistente específico
    public function getByAsistente($idUsuario)
    {
        try {
            $vSql = "SELECT 
                        t.id_ticket,
                        t.titulo,
                        t.descripcion,
                        t.fecha_cita,
                        e.nombre_estado,
                        c.nombre_categoria,
                        m.nombre AS mascota,
                        u1.nombre_completo AS cliente,
                        u2.nombre_completo AS asignado_a
                    FROM tickets t
                    JOIN estadosticket e ON e.id_estado = t.id_estado
                    JOIN categorias c ON c.id_categoria = t.id_categoria
                    JOIN mascotas m ON m.id_mascota = t.id_mascota
                    JOIN usuarios u1 ON u1.id_usuario = t.id_creado_por_usuario
                    JOIN usuarios u2 ON u2.id_usuario = t.id_asignado_a_usuario
                    WHERE t.id_asignado_a_usuario = $idUsuario
                    AND e.nombre_estado IN ('Abierto', 'En proceso')
                    ORDER BY t.fecha_cita ASC;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
