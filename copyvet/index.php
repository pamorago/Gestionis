<?php
// Composer autoloader
require_once 'vendor/autoload.php';
/*Encabezada de las solicitudes*/
/*CORS*/
header("Access-Control-Allow-Origin: * ");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header('Content-Type: application/json');

/*--- Requerimientos Clases o librerías*/
require_once "controllers/core/Config.php";
require_once "controllers/core/HandleException.php";
require_once "controllers/core/Logger.php";
require_once "controllers/core/MySqlConnect.php";
require_once "controllers/core/Request.php";
require_once "controllers/core/Response.php";
//Middleware
require_once "middleware/AuthMiddleware.php";

/***--- Agregar todos los modelos*/
require_once "models/RolModel.php";
require_once "models/UserModel.php";
require_once "models/TicketModel.php";
require_once "models/CategoriaModel.php";
require_once "models/HistoricoModel.php";
require_once "models/MascotaModel.php";
require_once "models/EstadoTicketModel.php";
require_once "models/SlaModel.php";
require_once "models/VeterinarioModel.php";
require_once "models/AsignacionModel.php";

/***--- Agregar todos los controladores*/
require_once "controllers/UserController.php";
require_once "controllers/TicketController.php";
require_once "controllers/CategoriaController.php";
require_once "controllers/HistoricoController.php";
require_once "controllers/MascotaController.php";
require_once "controllers/EstadoTicketController.php";
require_once "controllers/SlaController.php";
require_once "controllers/VeterinarioController.php";
require_once "controllers/AsignacionController.php";

//Enrutador
require_once "routes/RoutesController.php";
$index = new RoutesController();
$index->index();
