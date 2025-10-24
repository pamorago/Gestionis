<?php
class TicketModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    // Listar todos los tickets (Administrador)
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

    // Obtener detalle de un ticket
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

    // Listar tickets según rol
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
                    $vSql = "SELECT * FROM vista_tickets WHERE tecnico = (
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
}
require_once 'config/MySqlConnect.php';
require_once 'config/Response.php';
require_once 'config/functions.php';
