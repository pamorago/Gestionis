<?php
class ticket
{
    public function index()
    {
        try {
            $response = new Response();
            $model = new TicketModel();
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
            $model = new TicketModel();
            $result = $model->get($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getByRol($rol, $idUsuario)
    {
        try {
            $response = new Response();
            $model = new TicketModel();
            $result = $model->getByRol($rol, $idUsuario);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
require_once 'config/MySqlConnect.php';
require_once 'config/Response.php';
require_once 'config/functions.php';
