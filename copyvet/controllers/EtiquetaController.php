<?php
class etiqueta
{
    public function index()
    {
        try {
            $response = new Response();
            $enlace = new MySqlConnect();
            $vSql = "SELECT * FROM etiquetas ORDER BY nombre_etiqueta";
            $result = $enlace->ExecuteSQL($vSql);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
