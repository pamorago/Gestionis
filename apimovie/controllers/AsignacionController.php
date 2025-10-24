<?php
class asignacion
{
    public function index()
    {
        try {
            $response = new Response();
            $model = new AsignacionModel();
            $result = $model->all();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getByTecnico($idUsuario)
    {
        try {
            $response = new Response();
            $model = new AsignacionModel();
            $result = $model->getByTecnico($idUsuario);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}

require_once 'config/MySqlConnect.php';
require_once 'config/Response.php';
require_once 'config/functions.php';
