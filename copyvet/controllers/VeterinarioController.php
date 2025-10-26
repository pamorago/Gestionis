<?php
class veterinario
{
    public function index()
    {
        try {
            $response = new Response();
            $model = new VeterinarioModel();
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
            $model = new VeterinarioModel();
            $result = $model->get($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function tickets($id)
    {
        try {
            $response = new Response();
            $model = new VeterinarioModel();
            $result = $model->getTickets($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
