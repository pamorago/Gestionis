<?php
class CategoriaModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    public function all()
    {
        try {
            $vSql = "SELECT c.*, s.descripcion as sla_descripcion, 
                    s.tiempo_minutos, s.tiempo_resolucion 
                    FROM categorias c 
                    LEFT JOIN sla s ON c.id_sla = s.id_sla;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($id)
    {
        try {
            $vSql = "SELECT c.*, s.descripcion as sla_descripcion, 
                    s.tiempo_minutos, s.tiempo_resolucion 
                    FROM categorias c 
                    LEFT JOIN sla s ON c.id_sla = s.id_sla 
                    WHERE c.id_categoria = $id;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado[0];
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function create($categoria)
    {
        try {
            $vSql = "INSERT INTO categorias (nombre_categoria, id_sla) 
                    VALUES ('$categoria->nombre_categoria', $categoria->id_sla);";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function update($id, $categoria)
    {
        try {
            $vSql = "UPDATE categorias SET 
                    nombre_categoria = '$categoria->nombre_categoria',
                    id_sla = $categoria->id_sla 
                    WHERE id_categoria = $id;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function delete($id)
    {
        try {
            $vSql = "DELETE FROM categorias WHERE id_categoria = $id;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
