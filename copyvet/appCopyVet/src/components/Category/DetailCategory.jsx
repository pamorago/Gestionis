import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CategoriaService from "../../services/CategoriaService";
import { Container, Typography, Paper, Box } from "@mui/material";

export default function DetailCategory() {
  const { id } = useParams();
  const [cat, setCat] = useState(null);

  useEffect(() => {
    if (!id) return;
    CategoriaService.get(id)
      .then((r) => setCat(r.data || null))
      .catch((err) => {
        console.error("Error loading category:", err);
        setCat(null);
      });
  }, [id]);

  if (!cat) return <Container sx={{ p: 2 }}>Cargando categoría...</Container>;

  return (
    <Container sx={{ p: 2 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h4">
          {cat.nombre_categoria || "Categoría"}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography>{cat.descripcion || "Sin descripción"}</Typography>
        </Box>
      </Paper>
    </Container>
  );
}
