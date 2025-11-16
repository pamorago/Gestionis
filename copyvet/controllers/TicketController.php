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
            $data = $request->getJSON();

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
            $data = $request->getJSON();

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

    public function getImagenes($id)
    {
        try {
            $response = new Response();
            $model = new TicketModel();
            $result = $model->getImagenes($id);

            // Si no hay resultados, devolver array vacío con status 200
            if (!$result || !is_array($result) || count($result) === 0) {
                // Forzar status 200 y devolver array vacío
                http_response_code(200);
                echo json_encode([]);
                return;
            }

            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function createImage()
    {
        try {
            error_log("=== createImage called ===");
            error_log("FILES: " . print_r($_FILES, true));
            error_log("POST: " . print_r($_POST, true));

            $response = new Response();

            // Validar que se recibió un archivo
            if (!isset($_FILES['imagen']) || $_FILES['imagen']['error'] !== UPLOAD_ERR_OK) {
                error_log("Error: No imagen file or upload error");
                throw new Exception('No se recibió ninguna imagen o hubo un error en la carga');
            }

            // Validar que se recibió el id_ticket
            if (!isset($_POST['id_ticket']) || empty($_POST['id_ticket'])) {
                error_log("Error: No id_ticket in POST");
                throw new Exception('El id_ticket es requerido');
            }

            $id_ticket = $_POST['id_ticket'];
            $file = $_FILES['imagen'];

            // Validar tipo de archivo
            $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (!in_array($file['type'], $allowedTypes)) {
                error_log("Error: Invalid file type: " . $file['type']);
                throw new Exception('Tipo de archivo no permitido. Solo se aceptan imágenes.');
            }

            // Validar tamaño (máximo 5MB)
            $maxSize = 5 * 1024 * 1024; // 5MB en bytes
            if ($file['size'] > $maxSize) {
                error_log("Error: File too large: " . $file['size']);
                throw new Exception('El archivo es demasiado grande. Máximo 5MB.');
            }

            // Generar nombre único para el archivo
            $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
            $nombreArchivo = 'ticket_' . $id_ticket . '_' . time() . '_' . uniqid() . '.' . $extension;

            // Crear directorio uploads si no existe
            $uploadDir = __DIR__ . '/../uploads/';
            if (!file_exists($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }

            // Mover archivo al directorio uploads
            $rutaDestino = $uploadDir . $nombreArchivo;
            if (!move_uploaded_file($file['tmp_name'], $rutaDestino)) {
                error_log("Error: Could not move uploaded file");
                throw new Exception('Error al guardar la imagen en el servidor');
            }

            // Guardar registro en base de datos
            $model = new TicketModel();
            $result = $model->createImage($id_ticket, $nombreArchivo);

            error_log("Success: Image uploaded - " . $nombreArchivo);

            $response->toJSON([
                'success' => true,
                'message' => 'Imagen subida exitosamente',
                'data' => $result
            ]);
        } catch (Exception $e) {
            error_log("Exception in createImage: " . $e->getMessage());
            // Si hubo error y se creó el archivo, eliminarlo
            if (isset($rutaDestino) && file_exists($rutaDestino)) {
                unlink($rutaDestino);
            }
            handleException($e);
        }
    }
}
