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

    public function getTicketsByCliente($id_usuario)
    {
        try {
            $response = new Response();
            $model = new TicketModel();
            $result = $model->getTicketsByCliente($id_usuario);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getTicketsByVeterinario($id_usuario)
    {
        try {
            $response = new Response();
            $model = new TicketModel();
            $result = $model->getTicketsByVeterinario($id_usuario);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getHistorico($id_ticket)
    {
        try {
            $response = new Response();
            $model = new TicketModel();
            $result = $model->getHistorico($id_ticket);
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

            $model = new TicketModel();
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

            $model = new TicketModel();
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
            $model = new TicketModel();
            $result = $model->delete($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
