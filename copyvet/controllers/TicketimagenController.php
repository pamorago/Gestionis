<?php
class ticketimagen
{
    // POST Crear imagen de ticket
    public function create()
    {
        try {
            $request = new Request();
            $response = new Response();

            // Obtener datos enviados (incluye $_FILES y $_POST)
            $inputFILE = $request->getBody();

            // Instancia del modelo
            $imageModel = new ImageModel();

            // Acción del modelo a ejecutar
            $result = $imageModel->uploadFile($inputFILE);

            // Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function index()
    {
        try {
            $response = new Response();
            $json = array(
                'status' => 200,
                'result' => 'Endpoint de imágenes de tickets. Use POST para subir imágenes.'
            );
            echo json_encode($json);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($idTicket)
    {
        try {
            $response = new Response();
            $model = new ImageModel();
            $result = $model->getImageTicket($idTicket);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
