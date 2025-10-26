<?php
class rol
{
    public function index()
    {
        try {
            $response = new Response();
            $model = new RolModel();
            $result = $model->all();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($id)
    {
        try {
            $response = new Response();
            $model = new RolModel();
            $result = $model->get($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getRolUser($idUser)
    {
        try {
            $response = new Response();
            $model = new RolModel();
            $result = $model->getRolUser($idUser);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
