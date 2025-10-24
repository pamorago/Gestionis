<?php
class HistoricoModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    // Obtener historial de un ticket
    public function getByTicket($idTicket)
    {
        try {
            $vSql = "SELECT h.fecha, h.comentario, h.estado, u.nombre_completo AS usuario
                     FROM historico h
                     JOIN usuarios u ON u.id_usuario = h.id_usuario
                     WHERE h.id_ticket = $idTicket
                     ORDER BY h.fecha ASC;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
require_once 'config/MySqlConnect.php';
require_once 'config/Response.php';
require_once 'config/functions.php';
