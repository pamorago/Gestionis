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

  // Convertir minutos a formato legible
  const formatTime = (minutes) => {
    if (!minutes) return "N/A";
    if (minutes < 60) return `${minutes} minutos`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0
      ? `${hours}h ${mins}min`
      : `${hours} hora${hours > 1 ? "s" : ""}`;
  };

  return (
    <Container sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        {cat.nombre_categoria || "Categoría"}
      </Typography>

      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          SLA (Service Level Agreement)
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              bgcolor: "primary.50",
              border: "1px solid",
              borderColor: "primary.200",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "bold", color: "primary.main", mb: 1 }}
            >
              Nivel de Prioridad: {cat.sla_descripcion || "No especificado"}
            </Typography>

            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                ⏱️ <strong>Tiempo máximo de respuesta:</strong>{" "}
                {formatTime(cat.tiempo_minutos)}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                sx={{ ml: 3, mb: 2 }}
              >
                Tiempo máximo para dar la primera respuesta al ticket
              </Typography>

              <Typography variant="body1" sx={{ mb: 1 }}>
                ✅ <strong>Tiempo máximo de resolución:</strong>{" "}
                {formatTime(cat.tiempo_resolucion)}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                sx={{ ml: 3 }}
              >
                Tiempo máximo para resolver completamente el caso
              </Typography>
            </Box>
          </Paper>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 3, fontStyle: "italic" }}
        >
          Esta categoría agrupa todos los casos relacionados con{" "}
          <strong>{cat.nombre_categoria}</strong> y se rige por los SLA de
          prioridad <strong>{cat.sla_descripcion}</strong>.
        </Typography>
      </Paper>
    </Container>
  );
}
