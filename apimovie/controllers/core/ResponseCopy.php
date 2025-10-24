<?php
class Response
{
    private $status;
    private $data;
    private $message;

    public function __construct($status = "success", $data = null, $message = "")
    {
        $this->status = $status;
        $this->data = $data;
        $this->message = $message;
    }

    /**
     * Envía los datos como JSON al cliente
     */
    public function toJSON($data)
    {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode([
            'status' => 'success',
            'count' => is_array($data) ? count($data) : 1,
            'data' => $data
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }

    /**
     * Envía un error como JSON al cliente
     */
    public function toError($message)
    {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode([
            'status' => 'error',
            'message' => $message
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }
}
