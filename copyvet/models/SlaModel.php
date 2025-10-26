<?php
class SlaModel
{
    public $enlace;
    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    public function all()
    {
        try {
            $vSql = "SELECT * FROM sla;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($id)
    {
        try {
            $vSql = "SELECT * FROM sla WHERE id_sla = $id;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado[0];
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function create($sla)
    {
        try {
            $vSql = "INSERT INTO sla (descripcion, tiempo_minutos, tiempo_resolucion) 
                    VALUES ('$sla->descripcion', $sla->tiempo_minutos, $sla->tiempo_resolucion);";

            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function update($id, $sla)
    {
        try {
            $vSql = "UPDATE sla SET 
                    descripcion = '$sla->descripcion',
                    tiempo_minutos = $sla->tiempo_minutos,
                    tiempo_resolucion = $sla->tiempo_resolucion
                    WHERE id_sla = $id;";

            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function delete($id)
    {
        try {
            $vSql = "DELETE FROM sla WHERE id_sla = $id;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
