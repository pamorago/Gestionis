<?php
class especialidad
{
    public function index()
    {
        try {
            $response = new Response();
            $enlace = new MySqlConnect();
            $vSql = "SELECT * FROM especialidades ORDER BY nombre_especialidad";
            $result = $enlace->ExecuteSQL($vSql);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
