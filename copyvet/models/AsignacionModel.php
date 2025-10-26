<?php
class AsignacionModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    // Ver todas las asignaciones (para tablero o calendario)
    public function all()
    {
        try {
            $vSql = "SELECT * FROM vista_asignaciones;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // Asignaciones de un técnico específico
    public function getByTecnico($idUsuario)
    {
        try {
            $vSql = "SELECT * FROM vista_asignaciones WHERE tecnico_asignado = (
                        SELECT nombre_completo FROM usuarios WHERE id_usuario = $idUsuario
                     );";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
