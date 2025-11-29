<?php

class notificacion
{
    public function index()
    {
        try {
            $response = new Response();
            $model = new NotificacionModel();

            $id_usuario = isset($_GET['id_usuario']) ? (int)$_GET['id_usuario'] : null;

            if (!$id_usuario) {
                throw new Exception("ID de usuario requerido");
            }

            $result = $model->getByUsuario($id_usuario);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getNoLeidas($id_usuario)
    {
        try {
            $response = new Response();
            $model = new NotificacionModel();

            $result = $model->getNoLeidas($id_usuario);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function contarNoLeidas($id_usuario)
    {
        try {
            $response = new Response();
            $model = new NotificacionModel();

            $total = $model->contarNoLeidas($id_usuario);
            $response->toJSON(['total' => $total]);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($id_notificacion)
    {
        try {
            $response = new Response();
            $model = new NotificacionModel();
            $result = $model->get($id_notificacion);
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
            $data = $request->getJSON();
            $model = new NotificacionModel();

            $result = $model->create($data);
            $response->toJSON(['id_notificacion' => $result, 'success' => true]);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function update($id_notificacion)
    {
        try {
            $response = new Response();
            $request = new Request();
            $data = $request->getJSON();
            $model = new NotificacionModel();

            $result = $model->update($id_notificacion, $data);
            $response->toJSON(['success' => true, 'result' => $result]);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function delete($id_notificacion)
    {
        try {
            $response = new Response();
            $model = new NotificacionModel();

            $model->delete($id_notificacion);
            $response->toJSON(['success' => true, 'message' => 'Notificación eliminada']);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function marcarComoLeida($id_notificacion)
    {
        try {
            $response = new Response();
            $request = new Request();
            $data = $request->getJSON();
            $model = new NotificacionModel();

            if (!isset($data->id_usuario)) {
                throw new Exception("ID de usuario requerido");
            }

            $model->marcarComoLeida($id_notificacion, $data->id_usuario);
            $response->toJSON(['success' => true, 'message' => 'Notificación marcada como leída']);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function marcarTodasComoLeidas()
    {
        try {
            $response = new Response();
            $request = new Request();
            $data = $request->getJSON();
            $model = new NotificacionModel();

            if (!isset($data->id_usuario)) {
                throw new Exception("ID de usuario requerido");
            }

            $model->marcarTodasComoLeidas($data->id_usuario);
            $response->toJSON(['success' => true, 'message' => 'Todas las notificaciones marcadas como leídas']);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getByTipo($id_usuario, $tipo)
    {
        try {
            $response = new Response();
            $model = new NotificacionModel();

            $result = $model->getByTipo($id_usuario, $tipo);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
