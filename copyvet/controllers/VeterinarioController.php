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
            $result = $model->getTicketsAsignados($id);
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

            $model = new VeterinarioModel();
            $result = $model->create($data);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function update()
    {
        try {
            $response = new Response();
            $request = new Request();
            $data = $request->getJSON();

            $model = new VeterinarioModel();

            // Validar si se está intentando cambiar carga_maxima y si tiene tickets asignados
            if (isset($data->carga_maxima) && isset($data->id_veterinario)) {
                $veterinario = $model->get($data->id_veterinario);
                if ($veterinario && isset($veterinario['tickets_asignados']) && $veterinario['tickets_asignados'] > 0) {
                    $response->toJSON([
                        'success' => false,
                        'message' => 'No se puede modificar la carga máxima de un veterinario que tiene tickets asignados'
                    ]);
                    return;
                }
            }

            $result = $model->update($data);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function delete($id)
    {
        try {
            $response = new Response();
            $model = new VeterinarioModel();
            $result = $model->delete($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
