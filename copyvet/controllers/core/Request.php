<?php
class Request
{
    public $params;
    public $reqMethod;
    public $contentType;

    public function __construct($params = [])
    {
        $this->params = $params;
        $this->reqMethod = trim($_SERVER['REQUEST_METHOD']);
        $this->contentType = !empty($_SERVER["CONTENT_TYPE"]) ? trim($_SERVER["CONTENT_TYPE"]) : '';
    }

    public function getBody()
    {
        if ($this->reqMethod !== 'POST') {
            return '';
        }

        $body = [];

        // Obtiene los datos de $_POST
        foreach ($_POST as $key => $value) {
            $body[$key] = filter_input(INPUT_POST, $key, FILTER_SANITIZE_SPECIAL_CHARS);
        }
        // Iterar sobre los archivos enviados con $_FILES
        foreach ($_FILES as $key => $file) {
            if (is_array($file['name'])) {
                // Si se suben múltiples archivos
                $fileCount = count($file['name']);
                for ($i = 0; $i < $fileCount; $i++) {
                    $body[$key][] = [
                        'name' => $file['name'][$i],
                        'type' => $file['type'][$i],
                        'tmp_name' => $file['tmp_name'][$i],
                        'error' => $file['error'][$i],
                        'size' => $file['size'][$i],
                    ];
                }
            } else {
                // Para un solo archivo
                $body[$key] = $file;
            }
        }

        return $body;
    }

    public function getJSON()
    {
        $content = trim(file_get_contents("php://input"));

        if (empty($content)) {
            return null;
        }

        $decoded = json_decode($content);

        if (json_last_error() !== JSON_ERROR_NONE) {
            return null;
        }

        return $decoded;
    }
}
