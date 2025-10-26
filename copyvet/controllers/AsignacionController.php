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

    public function getByAsistente($idUsuario)
    {
        try {
            $response = new Response();
            $model = new AsignacionModel();
            $result = $model->getByAsistente($idUsuario);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
