<?php
class MascotaModel
{
    public $enlace;
    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    public function all()
    {
        try {
            $vSql = "SELECT * FROM mascotas;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($id)
    {
        try {
            $vSql = "SELECT * FROM mascotas WHERE id_mascota = $id;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado[0];
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getMascotasByResponsable($id_responsable)
    {
        try {
            $vSql = "SELECT * FROM mascotas WHERE id_responsable = $id_responsable;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function create($mascota)
    {
        try {
            $vSql = "INSERT INTO mascotas (nombre, edad, especie, raza, id_responsable, 
                    nombre_responsable, correo_responsable, telefono_responsable) 
                    VALUES ('$mascota->nombre', $mascota->edad, '$mascota->especie', 
                    '$mascota->raza', $mascota->id_responsable, '$mascota->nombre_responsable', 
                    '$mascota->correo_responsable', '$mascota->telefono_responsable');";

            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function update($id, $mascota)
    {
        try {
            $vSql = "UPDATE mascotas SET 
                    nombre = '$mascota->nombre',
                    edad = $mascota->edad,
                    especie = '$mascota->especie',
                    raza = '$mascota->raza',
                    id_responsable = $mascota->id_responsable,
                    nombre_responsable = '$mascota->nombre_responsable',
                    correo_responsable = '$mascota->correo_responsable',
                    telefono_responsable = '$mascota->telefono_responsable'
                    WHERE id_mascota = $id;";

            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function delete($id)
    {
        try {
            $vSql = "DELETE FROM mascotas WHERE id_mascota = $id;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
