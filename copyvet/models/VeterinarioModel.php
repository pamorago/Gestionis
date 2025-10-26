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
                        COALESCE(COUNT(CASE WHEN e.nombre_estado IN ('Abierto', 'En proceso') THEN 1 END), 0) AS tickets_activos,
                        COALESCE(SUM(CASE WHEN e.nombre_estado IN ('Abierto', 'En proceso') THEN s.tiempo_resolucion ELSE 0 END), 0) AS horas_comprometidas,
                        24 AS horas_disponibles_total
                    FROM usuarios u
                    LEFT JOIN tickets t ON u.id_usuario = t.id_asignado_a_usuario
                    LEFT JOIN estadosticket e ON e.id_estado = t.id_estado
                    LEFT JOIN categorias c ON c.id_categoria = t.id_categoria
                    LEFT JOIN sla s ON s.id_sla = c.id_sla
                    WHERE u.id_rol = 2
                    GROUP BY u.id_usuario
                    ORDER BY u.nombre_completo;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // Detalle de veterinario
    public function get($id)
    {
        try {
            $vSql = "SELECT 
                        u.id_usuario AS id_veterinario,
                        u.nombre_completo,
                        u.email,
                        u.telefono,
                        u.especialidad,
                        COALESCE(COUNT(t.id_ticket), 0) AS total_tickets,
                        COALESCE(SUM(CASE WHEN e.nombre_estado = 'Cerrado' THEN 1 ELSE 0 END), 0) AS tickets_cerrados,
                        COALESCE(SUM(CASE WHEN e.nombre_estado = 'En proceso' THEN 1 ELSE 0 END), 0) AS tickets_en_proceso,
                        COALESCE(SUM(CASE WHEN e.nombre_estado = 'Abierto' THEN 1 ELSE 0 END), 0) AS tickets_abiertos,
                        COALESCE(SUM(CASE WHEN e.nombre_estado IN ('Abierto', 'En proceso') THEN s.tiempo_resolucion ELSE 0 END), 0) AS horas_comprometidas,
                        24 AS horas_disponibles_total
                    FROM usuarios u
                    LEFT JOIN tickets t ON u.id_usuario = t.id_asignado_a_usuario
                    LEFT JOIN estadosticket e ON e.id_estado = t.id_estado
                    LEFT JOIN categorias c ON c.id_categoria = t.id_categoria
                    LEFT JOIN sla s ON s.id_sla = c.id_sla
                    WHERE u.id_rol = 2 AND u.id_usuario = $id
                    GROUP BY u.id_usuario;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return ($vResultado && !empty($vResultado)) ? $vResultado[0] : null;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // Obtener tickets asignados a un veterinario
    public function getTickets($id)
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
                        t.fecha_creacion,
                        t.fecha_cita
                    FROM tickets t
                    JOIN estadosticket e ON e.id_estado = t.id_estado
                    JOIN categorias c ON c.id_categoria = t.id_categoria
                    JOIN sla s ON s.id_sla = c.id_sla
                    JOIN mascotas m ON m.id_mascota = t.id_mascota
                    JOIN usuarios u1 ON u1.id_usuario = t.id_creado_por_usuario
                    WHERE t.id_asignado_a_usuario = $id
                    ORDER BY t.fecha_cita DESC;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
