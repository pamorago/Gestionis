<?php
class dashboard
{
    public function getEstadisticas()
    {
        try {
            $response = new Response();
            $enlace = new MySqlConnect();

            // Estadísticas de tickets por estado
            $vSqlEstados = "SELECT 
                e.nombre_estado,
                COUNT(t.id_ticket) as total
            FROM estadosticket e
            LEFT JOIN tickets t ON t.id_estado = e.id_estado
            GROUP BY e.id_estado, e.nombre_estado
            ORDER BY e.id_estado";
            $ticketsPorEstado = $enlace->ExecuteSQL($vSqlEstados);

            // Estadísticas de tickets por categoría
            $vSqlCategorias = "SELECT 
                c.nombre_categoria,
                COUNT(t.id_ticket) as total
            FROM categorias c
            LEFT JOIN tickets t ON t.id_categoria = c.id_categoria
            GROUP BY c.id_categoria, c.nombre_categoria
            ORDER BY total DESC
            LIMIT 10";
            $ticketsPorCategoria = $enlace->ExecuteSQL($vSqlCategorias);

            // Estadísticas de SLA
            $vSqlSLA = "SELECT 
                COUNT(*) as total_tickets,
                SUM(CASE 
                    WHEN TIMESTAMPDIFF(MINUTE, t.fecha_creacion, 
                        CASE WHEN t.id_estado = 3 THEN DATE_ADD(t.fecha_creacion, INTERVAL s.tiempo_resolucion MINUTE)
                        ELSE NOW() END
                    ) <= s.tiempo_resolucion 
                    THEN 1 ELSE 0 END
                ) as dentro_sla,
                SUM(CASE 
                    WHEN TIMESTAMPDIFF(MINUTE, t.fecha_creacion, NOW()) > s.tiempo_resolucion 
                    AND t.id_estado != 3 AND t.id_estado != 4
                    THEN 1 ELSE 0 END
                ) as fuera_sla
            FROM tickets t
            JOIN categorias c ON c.id_categoria = t.id_categoria
            JOIN sla s ON s.id_sla = c.id_sla"; // Incluir todos los tickets
            $estadisticasSLA = $enlace->ExecuteSQL($vSqlSLA);

            // Top veterinarios por tickets resueltos
            $vSqlTopVets = "SELECT 
                u.id_usuario,
                u.nombre_completo,
                COUNT(t.id_ticket) as tickets_resueltos,
                COALESCE(AVG(t.valoracion), 0) as valoracion_promedio,
                COUNT(CASE WHEN t.valoracion IS NOT NULL THEN 1 END) as total_valoraciones
            FROM usuarios u
            JOIN tickets t ON t.id_asignado_a_usuario = u.id_usuario
            WHERE u.id_rol = 2 AND t.id_estado = 3
            GROUP BY u.id_usuario, u.nombre_completo
            ORDER BY tickets_resueltos DESC
            LIMIT 5";
            $topVeterinarios = $enlace->ExecuteSQL($vSqlTopVets);

            // Tickets urgentes sin asignar
            $vSqlUrgentes = "SELECT 
                t.id_ticket,
                t.titulo as asunto,
                c.nombre_categoria,
                e.nombre_especialidad,
                s.descripcion as nombre_prioridad,
                TIMESTAMPDIFF(MINUTE, t.fecha_creacion, NOW()) as minutos_transcurridos
            FROM tickets t
            JOIN categorias c ON c.id_categoria = t.id_categoria
            LEFT JOIN categoria_especialidades ce ON ce.id_categoria = c.id_categoria
            LEFT JOIN especialidades e ON e.id_especialidad = ce.id_especialidad
            JOIN sla s ON s.id_sla = c.id_sla
            WHERE (t.id_asignado_a_usuario IS NULL OR t.id_estado = 1)
            AND s.id_sla IN (1, 2)
            ORDER BY s.id_sla ASC, t.fecha_creacion ASC
            LIMIT 10";
            $ticketsUrgentes = $enlace->ExecuteSQL($vSqlUrgentes);

            // Tickets próximos a vencer SLA
            $vSqlProximosVencer = "SELECT 
                t.id_ticket,
                t.titulo as asunto,
                e.nombre_estado,
                c.nombre_categoria,
                s.descripcion as nombre_prioridad,
                u.nombre_completo as nombre_veterinario,
                s.tiempo_resolucion,
                TIMESTAMPDIFF(MINUTE, t.fecha_creacion, NOW()) as tiempo_transcurrido,
                DATE_ADD(t.fecha_creacion, INTERVAL s.tiempo_resolucion MINUTE) as fecha_vencimiento_sla,
                (s.tiempo_resolucion - TIMESTAMPDIFF(MINUTE, t.fecha_creacion, NOW())) as minutos_restantes
            FROM tickets t
            JOIN estadosticket e ON e.id_estado = t.id_estado
            JOIN categorias c ON c.id_categoria = t.id_categoria
            JOIN sla s ON s.id_sla = c.id_sla
            LEFT JOIN usuarios u ON u.id_usuario = t.id_asignado_a_usuario
            WHERE t.id_estado IN (1, 2)
            AND TIMESTAMPDIFF(MINUTE, t.fecha_creacion, NOW()) < s.tiempo_resolucion
            AND (s.tiempo_resolucion - TIMESTAMPDIFF(MINUTE, t.fecha_creacion, NOW())) <= 60
            ORDER BY minutos_restantes ASC
            LIMIT 10";
            $ticketsProximosVencer = $enlace->ExecuteSQL($vSqlProximosVencer);

            // Promedio de valoraciones general
            $vSqlRatingPromedio = "SELECT 
                COALESCE(AVG(t.valoracion), 0) as promedio_valoracion,
                COUNT(CASE WHEN t.valoracion IS NOT NULL THEN 1 END) as total_valoraciones
            FROM tickets t";
            $ratingPromedio = $enlace->ExecuteSQL($vSqlRatingPromedio);

            // Tickets creados por mes (últimos 12 meses)
            $vSqlTicketsMonth = "SELECT 
                DATE_FORMAT(t.fecha_creacion, '%Y-%m') as mes,
                COUNT(t.id_ticket) as total
            FROM tickets t
            WHERE t.fecha_creacion >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
            GROUP BY DATE_FORMAT(t.fecha_creacion, '%Y-%m')
            ORDER BY mes ASC";
            $ticketsCreatedByMonth = $enlace->ExecuteSQL($vSqlTicketsMonth);

            // Categorías con más incumplimientos
            $vSqlCategoriesNoncompliance = "SELECT 
                c.nombre_categoria,
                COUNT(t.id_ticket) as total,
                SUM(CASE 
                    WHEN TIMESTAMPDIFF(MINUTE, t.fecha_creacion, NOW()) > s.tiempo_resolucion 
                    AND t.id_estado != 3 AND t.id_estado != 4
                    THEN 1 ELSE 0 END
                ) as incumplimientos
            FROM categorias c
            LEFT JOIN tickets t ON t.id_categoria = c.id_categoria
            LEFT JOIN sla s ON s.id_sla = c.id_sla
            GROUP BY c.id_categoria, c.nombre_categoria
            HAVING incumplimientos > 0
            ORDER BY incumplimientos DESC
            LIMIT 10";
            $categoriesNoncompliance = $enlace->ExecuteSQL($vSqlCategoriesNoncompliance);

            // Valoraciones por categoría
            $vSqlRatingByCategory = "SELECT 
                c.id_categoria,
                c.nombre_categoria,
                COALESCE(AVG(t.valoracion), 0) as valoracion_promedio,
                COUNT(CASE WHEN t.valoracion IS NOT NULL THEN 1 END) as total_valoraciones,
                COUNT(t.id_ticket) as total_tickets
            FROM categorias c
            LEFT JOIN tickets t ON t.id_categoria = c.id_categoria AND t.id_estado = 3
            GROUP BY c.id_categoria, c.nombre_categoria
            ORDER BY valoracion_promedio DESC";
            $ratingByCategory = $enlace->ExecuteSQL($vSqlRatingByCategory);

            // Consolidar todas las estadísticas
            $estadisticas = [
                'tickets_por_estado' => $ticketsPorEstado,
                'tickets_por_categoria' => $ticketsPorCategoria,
                'estadisticas_sla' => $estadisticasSLA[0] ?? null,
                'top_veterinarios' => $topVeterinarios,
                'tickets_urgentes' => $ticketsUrgentes,
                'tickets_proximos_vencer' => $ticketsProximosVencer,
                'rating_promedio' => $ratingPromedio[0] ?? null,
                'tickets_por_mes' => $ticketsCreatedByMonth,
                'categorias_incumplimiento' => $categoriesNoncompliance,
                'rating_por_categoria' => $ratingByCategory
            ];

            $response->toJSON([
                'success' => true,
                'data' => $estadisticas
            ]);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
