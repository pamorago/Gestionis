<?php
class HistoricoModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    public function all()
    {
        try {
            $vSql = "SELECT h.*, t.titulo as ticket_titulo, 
                    u.nombre_completo as nombre_usuario 
                    FROM historico h
                    LEFT JOIN tickets t ON h.id_ticket = t.id_ticket
                    LEFT JOIN usuarios u ON h.id_usuario = u.id_usuario
                    ORDER BY h.fecha DESC;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($id)
    {
        try {
            $vSql = "SELECT h.*, t.titulo as ticket_titulo, 
                    u.nombre_completo as nombre_usuario 
                    FROM historico h
                    LEFT JOIN tickets t ON h.id_ticket = t.id_ticket
                    LEFT JOIN usuarios u ON h.id_usuario = u.id_usuario
                    WHERE h.id_historico = $id;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado[0];
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getByTicket($id_ticket)
    {
        try {
            $vSql = "SELECT h.*, u.nombre_completo as nombre_usuario 
                    FROM historico h
                    LEFT JOIN usuarios u ON h.id_usuario = u.id_usuario
                    WHERE h.id_ticket = $id_ticket
                    ORDER BY h.fecha DESC;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function create($historico)
    {
        try {
            $vSql = "INSERT INTO historico (id_ticket, fecha, comentario, estado, id_usuario)
                    VALUES ($historico->id_ticket, NOW(), 
                    '$historico->comentario', '$historico->estado', 
                    $historico->id_usuario);";

            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function delete($id)
    {
        try {
            $vSql = "DELETE FROM historico WHERE id_historico = $id;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
