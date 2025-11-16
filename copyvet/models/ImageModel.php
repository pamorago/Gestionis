<?php
class ImageModel
{
    private $upload_path = 'uploads/';
    private $valid_extensions = array('jpeg', 'jpg', 'png', 'gif', 'webp');

    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    // Subir imagen de un ticket registrado
    public function uploadFile($object)
    {
        try {
            $file = $object['file'];
            $ticket_id = $object['ticket_id'];

            // Obtener la información del archivo
            $fileName = $file['name'];
            $tempPath = $file['tmp_name'];
            $fileSize = $file['size'];
            $fileError = $file['error'];

            if (!empty($fileName)) {
                // Crear un nombre único para el archivo
                $fileExt = explode('.', $fileName);
                $fileActExt = strtolower(end($fileExt));
                $fileName = "ticket-" . $ticket_id . "-" . uniqid() . "." . $fileActExt;

                // Validar el tipo de archivo
                if (in_array($fileActExt, $this->valid_extensions)) {
                    // Validar que no exista
                    if (!file_exists($this->upload_path . $fileName)) {
                        // Validar que no sobrepase el tamaño (5MB)
                        if ($fileSize < 5000000 && $fileError == 0) {
                            // Moverlo a la carpeta del servidor del API
                            if (move_uploaded_file($tempPath, $this->upload_path . $fileName)) {
                                // Guardarlo en la BD
                                $sql = "INSERT INTO ticketimage (id_ticket, imagen, created_at) VALUES ($ticket_id, '$fileName', NOW())";
                                $vResultado = $this->enlace->ExecuteSQL_DML($sql);
                                if ($vResultado > 0) {
                                    return ['success' => true, 'message' => 'Imagen creada', 'filename' => $fileName];
                                }
                                return false;
                            }
                        }
                    }
                }
            }
            return false;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // Obtener imágenes de un ticket
    public function getImageTicket($idTicket)
    {
        try {
            // Consulta sql
            $vSql = "SELECT * FROM ticketimage WHERE id_ticket=$idTicket ORDER BY created_at DESC";

            // Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
