<?php
class estadoticket
{
    public function index()
    {
        try {
            $response = new Response();
            $model = new EstadoTicketModel();
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
            $model = new EstadoTicketModel();
            $result = $model->get($id);
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

            $model = new EstadoTicketModel();
            $result = $model->create($data);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function update($id)
    {
        try {
            $response = new Response();
            $request = new Request();
            $data = $request->getBody();

            $model = new EstadoTicketModel();
            $result = $model->update($id, $data);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function delete($id)
    {
        try {
            $response = new Response();
            $model = new EstadoTicketModel();
            $result = $model->delete($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
