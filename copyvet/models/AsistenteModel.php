<?php
class AsistenteModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    // Listado general de asistentes
    public function all()
    {
        try {
            $vSql = "SELECT 
                        u.id_usuario AS id_asistente,
                        u.nombre_completo AS nombre_asistente,
                        u.correo,
                        u.telefono,
                        COUNT(CASE WHEN e.nombre_estado IN ('Abierto', 'En proceso') THEN 1 END) AS tickets_activos
                    FROM usuarios u
                    LEFT JOIN tickets t ON u.id_usuario = t.id_creado_por_usuario
                    LEFT JOIN estadosticket e ON e.id_estado = t.id_estado
                    WHERE u.id_rol = 3
                    GROUP BY u.id_usuario;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // Detalle de asistente
    public function get($id)
    {
        try {
            $vSql = "SELECT 
                        u.id_usuario AS id_asistente,
                        u.nombre_completo,
                        u.correo,
                        u.telefono,
                        COUNT(t.id_ticket) AS total_tickets_creados,
                        SUM(CASE WHEN e.nombre_estado = 'Cerrado' THEN 1 ELSE 0 END) AS tickets_cerrados,
                        SUM(CASE WHEN e.nombre_estado = 'En proceso' THEN 1 ELSE 0 END) AS tickets_en_proceso,
                        SUM(CASE WHEN e.nombre_estado = 'Abierto' THEN 1 ELSE 0 END) AS tickets_abiertos
                    FROM usuarios u
                    LEFT JOIN tickets t ON u.id_usuario = t.id_creado_por_usuario
                    LEFT JOIN estadosticket e ON e.id_estado = t.id_estado
                    WHERE u.id_rol = 3 AND u.id_usuario = $id
                    GROUP BY u.id_usuario;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado[0];
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
