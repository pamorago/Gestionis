<?php
// index.php o router.php
require_once 'config/MySqlConnect.php';
require_once 'config/Response.php';
require_once 'config/functions.php';

// Ejemplo simple de enrutador
$uri = explode('/', trim($_SERVER['REQUEST_URI'], '/'));
$controllerName = $uri[1] ?? null; // Ejemplo: copyvet/tecnico
$action = $uri[2] ?? 'index';       // Ejemplo: get o index
$param = $uri[3] ?? null;           // Ejemplo: /copyvet/tecnico/get/2

if ($controllerName) {
    require_once "controllers/{$controllerName}.controller.php";
    $controller = new $controllerName();
    if (method_exists($controller, $action)) {
        if ($param) {
            $controller->$action($param);
        } else {
            $controller->$action();
        }
    } else {
        echo json_encode(["error" => "Método no encontrado"]);
    }
} else {
    echo json_encode(["mensaje" => "API CopyVet en ejecución"]);
}
