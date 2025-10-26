<?php

use Firebase\JWT\JWT;

class UserModel
{
    public $enlace;
    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    public function all()
    {
        try {
            $vSql = "SELECT u.*, r.nombre_rol as rol 
                    FROM usuarios u 
                    LEFT JOIN roles r ON u.id_rol = r.id_rol 
                    ORDER BY u.nombre_completo;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($id)
    {
        try {
            $vSql = "SELECT u.*, r.nombre_rol as rol 
                    FROM usuarios u 
                    LEFT JOIN roles r ON u.id_rol = r.id_rol 
                    WHERE u.id_usuario = $id;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado ? $vResultado[0] : null;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getByRol($id_rol)
    {
        try {
            $vSql = "SELECT u.*, r.nombre_rol as rol 
                    FROM usuarios u 
                    LEFT JOIN roles r ON u.id_rol = r.id_rol 
                    WHERE u.id_rol = $id_rol;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getVeterinarios()
    {
        try {
            $vSql = "SELECT * FROM vista_veterinarios;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getTecnicos()
    {
        try {
            $vSql = "SELECT * FROM vista_asistentes;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }
    public function login($objeto)
    {
        try {
            $vSql = "SELECT * FROM usuarios WHERE correo = '$objeto->correo';";

            $vResultado = $this->enlace->ExecuteSQL($vSql);
            if (!empty($vResultado) && is_object($vResultado[0])) {
                $user = $vResultado[0];
                // Nota: En copyvet necesitamos implementar el manejo de contraseñas
                $usuario = $this->get($user->id_usuario);
                if (!empty($usuario)) {
                    // Datos para el token JWT
                    $data = [
                        'id' => $usuario->id_usuario,
                        'nombre' => $usuario->nombre_completo,
                        'correo' => $usuario->correo,
                        'rol' => $usuario->rol,
                        'iat' => time(),  // Hora de emisión
                        'exp' => time() + 3600 // Expiración en 1 hora
                    ];

                    // Generar el token JWT
                    $jwt_token = JWT::encode($data, config::get('SECRET_KEY'), 'HS256');

                    // Enviar el token como respuesta
                    return $jwt_token;
                }
            } else {
                return false;
            }
        } catch (Exception $e) {
            handleException($e);
        }
    }
    public function create($objeto)
    {
        try {
            //Consulta sql            
            $vSql = "INSERT INTO usuarios (nombre_completo, correo, telefono, id_rol, especialidad) 
                     VALUES ('$objeto->nombre_completo', '$objeto->correo', '$objeto->telefono', 
                             $objeto->id_rol, " . ($objeto->especialidad ? "'$objeto->especialidad'" : "NULL") . ")";

            //Ejecutar la consulta
            $vResultado = $this->enlace->executeSQL_DML_last($vSql);
            // Retornar el objeto creado
            return $this->get($vResultado);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
