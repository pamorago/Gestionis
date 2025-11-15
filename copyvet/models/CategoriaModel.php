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

            // Cargar etiquetas y especialidades para cada categoría
            foreach ($vResultado as $categoria) {
                $categoria->etiquetas = $this->getEtiquetas($categoria->id_categoria);
                $categoria->especialidades = $this->getEspecialidades($categoria->id_categoria);
            }

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

            if (!empty($vResultado)) {
                $vResultado[0]->etiquetas = $this->getEtiquetas($id);
                $vResultado[0]->especialidades = $this->getEspecialidades($id);
                return $vResultado[0];
            }

            return null;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    private function getEtiquetas($id_categoria)
    {
        try {
            $vSql = "SELECT e.nombre_etiqueta 
                    FROM etiquetas e
                    INNER JOIN categoria_etiquetas ce ON e.id_etiqueta = ce.id_etiqueta
                    WHERE ce.id_categoria = $id_categoria;";
            $resultado = $this->enlace->ExecuteSQL($vSql);

            // Convertir objetos a arrays y extraer nombres
            $etiquetas = [];
            if (is_array($resultado)) {
                foreach ($resultado as $row) {
                    $row_array = (array)$row;
                    $etiquetas[] = $row_array['nombre_etiqueta'];
                }
            }
            return $etiquetas;
        } catch (Exception $e) {
            return [];
        }
    }

    private function getEspecialidades($id_categoria)
    {
        try {
            $vSql = "SELECT es.nombre_especialidad 
                    FROM especialidades es
                    INNER JOIN categoria_especialidades ce ON es.id_especialidad = ce.id_especialidad
                    WHERE ce.id_categoria = $id_categoria;";
            $resultado = $this->enlace->ExecuteSQL($vSql);

            // Convertir objetos a arrays y extraer nombres
            $especialidades = [];
            if (is_array($resultado)) {
                foreach ($resultado as $row) {
                    $row_array = (array)$row;
                    $especialidades[] = $row_array['nombre_especialidad'];
                }
            }
            return $especialidades;
        } catch (Exception $e) {
            return [];
        }
    }

    public function create($categoria)
    {
        try {
            // Insertar categoría
            $vSql = "INSERT INTO categorias (nombre_categoria, id_sla) 
                    VALUES ('$categoria->nombre_categoria', $categoria->id_sla);";
            $id_categoria = $this->enlace->ExecuteSQL_DML_last($vSql);

            // Insertar etiquetas
            if (isset($categoria->etiquetas) && is_array($categoria->etiquetas)) {
                $this->saveEtiquetas($id_categoria, $categoria->etiquetas);
            }

            // Insertar especialidades
            if (isset($categoria->especialidades) && is_array($categoria->especialidades)) {
                $this->saveEspecialidades($id_categoria, $categoria->especialidades);
            }

            return ['id' => $id_categoria, 'success' => true];
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function update($categoria)
    {
        try {
            // Actualizar categoría
            $vSql = "UPDATE categorias SET 
                    nombre_categoria = '$categoria->nombre_categoria',
                    id_sla = $categoria->id_sla 
                    WHERE id_categoria = $categoria->id_categoria;";
            $this->enlace->ExecuteSQL_DML($vSql);

            // Actualizar etiquetas
            if (isset($categoria->etiquetas) && is_array($categoria->etiquetas)) {
                // Eliminar etiquetas existentes
                $this->enlace->ExecuteSQL_DML("DELETE FROM categoria_etiquetas WHERE id_categoria = $categoria->id_categoria");
                // Insertar nuevas etiquetas
                $this->saveEtiquetas($categoria->id_categoria, $categoria->etiquetas);
            }

            // Actualizar especialidades
            if (isset($categoria->especialidades) && is_array($categoria->especialidades)) {
                // Eliminar especialidades existentes
                $this->enlace->ExecuteSQL_DML("DELETE FROM categoria_especialidades WHERE id_categoria = $categoria->id_categoria");
                // Insertar nuevas especialidades
                $this->saveEspecialidades($categoria->id_categoria, $categoria->especialidades);
            }

            return ['success' => true];
        } catch (Exception $e) {
            handleException($e);
        }
    }

    private function saveEtiquetas($id_categoria, $etiquetas)
    {
        foreach ($etiquetas as $nombre_etiqueta) {
            // Buscar o crear etiqueta
            $vSql = "SELECT id_etiqueta FROM etiquetas WHERE nombre_etiqueta = '$nombre_etiqueta'";
            $resultado = $this->enlace->ExecuteSQL($vSql);

            if (!empty($resultado)) {
                $id_etiqueta = $resultado[0]->id_etiqueta;
            } else {
                // Si no existe, crearla
                $id_etiqueta = $this->enlace->ExecuteSQL_DML_last("INSERT INTO etiquetas (nombre_etiqueta) VALUES ('$nombre_etiqueta')");
            }

            // Insertar relación
            $this->enlace->ExecuteSQL_DML("INSERT INTO categoria_etiquetas (id_categoria, id_etiqueta) VALUES ($id_categoria, $id_etiqueta)");
        }
    }

    private function saveEspecialidades($id_categoria, $especialidades)
    {
        foreach ($especialidades as $nombre_especialidad) {
            // Buscar o crear especialidad
            $vSql = "SELECT id_especialidad FROM especialidades WHERE nombre_especialidad = '$nombre_especialidad'";
            $resultado = $this->enlace->ExecuteSQL($vSql);

            if (!empty($resultado)) {
                $id_especialidad = $resultado[0]->id_especialidad;
            } else {
                // Si no existe, crearla
                $id_especialidad = $this->enlace->ExecuteSQL_DML_last("INSERT INTO especialidades (nombre_especialidad) VALUES ('$nombre_especialidad')");
            }

            // Insertar relación
            $this->enlace->ExecuteSQL_DML("INSERT INTO categoria_especialidades (id_categoria, id_especialidad) VALUES ($id_categoria, $id_especialidad)");
        }
    }

    public function delete($id)
    {
        try {
            $vSql = "DELETE FROM categorias WHERE id_categoria = $id;";
            $vResultado = $this->enlace->ExecuteSQL_DML($vSql);
            return ['success' => true, 'affected_rows' => $vResultado];
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
