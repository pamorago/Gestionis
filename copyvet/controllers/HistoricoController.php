<?php
class historico
{
    public function index()
    {
        try {
            $response = new Response();
            $model = new HistoricoModel();
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
            $model = new HistoricoModel();
            $result = $model->get($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

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

    public function create()
    {
        try {
            $response = new Response();
            $request = new Request();
            $data = $request->getBody();

            $model = new HistoricoModel();
            $result = $model->create($data);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
