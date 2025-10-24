<?php
class TecnicoModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    // Listado general de técnicos
    public function all()
    {
        try {
            $vSql = "SELECT * FROM vista_tecnicos;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // Detalle de técnico
    public function get($id)
    {
        try {
            $vSql = "SELECT * FROM vista_detalle_tecnico WHERE id_tecnico = $id;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado[0];
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
require_once 'config/MySqlConnect.php';
require_once 'config/Response.php';
require_once 'config/functions.php';
