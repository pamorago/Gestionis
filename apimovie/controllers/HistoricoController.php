<?php
class historico
{
    public function getByTicket($idTicket)
    {
        try {
            $response = new Response();
            $model = new HistoricoModel();
            $result = $model->getByTicket($idTicket);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
require_once 'config/MySqlConnect.php';
require_once 'config/Response.php';
require_once 'config/functions.php';
