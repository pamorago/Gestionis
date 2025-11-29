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
            $vSql = "SELECT 
                        u.id_usuario AS id_veterinario,
                        u.nombre_completo AS nombre_veterinario,
                        u.especialidad,
                        COUNT(
                            CASE
                                WHEN e.nombre_estado IN ('Abierto', 'En proceso') THEN 1
                            END
                        ) AS tickets_activos
                    FROM usuarios u
                    LEFT JOIN tickets t ON u.id_usuario = t.id_asignado_a_usuario
                    LEFT JOIN estadosticket e ON e.id_estado = t.id_estado
                    WHERE u.id_rol = 2
                    GROUP BY u.id_usuario
                    ORDER BY u.nombre_completo;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getAsistentes()
    {
        try {
            $vSql = "SELECT 
                        u.id_usuario AS id_asistente,
                        u.nombre_completo AS nombre_asistente,
                        u.email,
                        u.telefono
                    FROM usuarios u
                    WHERE u.id_rol = 3
                    ORDER BY u.nombre_completo;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }
    public function login($objeto)
    {
        try {
            // Validar que el objeto tenga las propiedades necesarias
            if (!isset($objeto->email) || empty($objeto->email)) {
                return false;
            }

            $vSql = "SELECT * FROM usuarios WHERE email = '$objeto->email';";

            $vResultado = $this->enlace->ExecuteSQL($vSql);
            if (!empty($vResultado) && is_object($vResultado[0])) {
                $user = $vResultado[0];

                // Verificar la contraseña
                if (!isset($objeto->password) || !password_verify($objeto->password, $user->password)) {
                    return false;
                }

                $usuario = $this->get($user->id_usuario);
                if (!empty($usuario)) {
                    // Generar notificación de login
                    $this->generarNotificacionLogin($usuario);

                    // Datos para el token JWT
                    $data = [
                        'id' => $usuario->id_usuario,
                        'nombre' => $usuario->nombre_completo,
                        'email' => $usuario->email,
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

    private function generarNotificacionLogin($usuario)
    {
        try {
            $notificacionModel = new NotificacionModel();

            $ahora = date('Y-m-d H:i:s');

            $datosNotificacion = [
                'tipo' => 'login',
                'descripcion' => 'Usuario ' . $usuario->nombre_completo . ' inició sesión',
                'fecha_evento' => $ahora,
                'id_usuario' => $usuario->id_usuario,
                'id_evento' => $usuario->id_usuario,
                'estado_leida' => false,
                'importancia' => 'normal',
                'responsable' => $usuario->nombre_completo
            ];

            $notificacionModel->create($datosNotificacion);
        } catch (Exception $e) {
            // Log el error pero no interrumpir el login
            error_log("Error generando notificación de login: " . $e->getMessage());
        }
    }
    public function create($objeto)
    {
        try {
            // Hash de la contraseña
            $password_hash = password_hash($objeto->password, PASSWORD_BCRYPT);

            // Manejar teléfono vacío - poner cadena vacía si es null
            $telefono = (!empty($objeto->telefono)) ? $objeto->telefono : "";

            //Consulta sql - sin especialidad que está en tabla veterinarios          
            $vSql = "INSERT INTO usuarios (nombre_completo, email, password, telefono, id_rol) 
                     VALUES ('$objeto->nombre_completo', '$objeto->email', '$password_hash', '$telefono', $objeto->id_rol)";

            //Ejecutar la consulta
            $vResultado = $this->enlace->executeSQL_DML_last($vSql);
            // Retornar el objeto creado
            return $this->get($vResultado);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
