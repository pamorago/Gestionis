<?php
class CategoriaModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    // Listado de categorías
    public function all()
    {
        try {
            $vSql = "SELECT * FROM vista_categorias;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // Detalle de categoría
    public function get($id)
    {
        try {
            $vSql = "SELECT * FROM vista_detalle_categoria WHERE id_categoria = $id;";
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
