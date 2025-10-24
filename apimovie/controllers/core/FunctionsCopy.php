<?php

/**
 * Manejo global de excepciones
 */
function handleException($e)
{
    error_log("⚠️ Error: " . $e->getMessage());

    $response = new Response();
    $response->toError($e->getMessage());
    exit; // Detiene ejecución para evitar errores encadenados
}

/**
 * Función para obtener parámetros seguros desde GET o POST
 */
function getParam($name)
{
    return isset($_REQUEST[$name]) ? htmlspecialchars($_REQUEST[$name]) : null;
}
