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

    public function getByVeterinario($idUsuario)
    {
        try {
            $response = new Response();
            $model = new AsignacionModel();
            $result = $model->getByVeterinario($idUsuario);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
