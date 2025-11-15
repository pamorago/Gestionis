import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CategoryService from "../../services/CategoryService";
import {
  Container,
  Typography,
  Paper,
  Box,
  IconButton,
  Chip,
  Stack,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function DetailCategory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cat, setCat] = useState(null);

  useEffect(() => {
    if (!id) return;
    CategoryService.get(id)
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

  // Obtener emoji según categoría
  const getCategoryEmoji = (categoria) => {
    const cat = categoria?.toLowerCase();
    if (cat?.includes("vacun")) return "💉";
    if (cat?.includes("cirugía")) return "🏥";
    if (cat?.includes("desparasit")) return "💊";
    if (cat?.includes("consulta")) return "🩺";
    if (cat?.includes("emergencia")) return "🚨";
    if (cat?.includes("exótica")) return "🦎";
    if (cat?.includes("dermatolog")) return "🐕";
    if (cat?.includes("traumatolog")) return "🦴";
    if (cat?.includes("control")) return "📋";
    return "🏥";
  };

  // Etiquetas sugeridas (Tipo de servicio + Urgencia)
  const getServiceTags = (categoria) => {
    const cat = categoria?.toLowerCase();
    if (cat?.includes("vacun")) return ["Preventivo", "Programable"];
    if (cat?.includes("cirugía mayor")) return ["Quirúrgico", "Urgente"];
    if (cat?.includes("cirugía menor")) return ["Quirúrgico", "Programable"];
    if (cat?.includes("desparasit")) return ["Preventivo", "Programable"];
    if (cat?.includes("consulta")) return ["Diagnóstico", "Programable"];
    if (cat?.includes("emergencia")) return ["Urgente", "Inmediato"];
    if (cat?.includes("exótica")) return ["Especializado", "Programable"];
    if (cat?.includes("dermatolog")) return ["Especializado", "Programable"];
    if (cat?.includes("traumatolog")) return ["Especializado", "Urgente"];
    if (cat?.includes("control")) return ["Preventivo", "Programable"];
    return ["General"];
  };

  return (
    <Container sx={{ p: 2 }}>
      {/* Botón de regresar */}
      <Box sx={{ mb: 2 }}>
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            bgcolor: "primary.main",
            color: "white",
            "&:hover": {
              bgcolor: "primary.dark",
            },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Typography variant="h3">
          {getCategoryEmoji(cat.nombre_categoria)}
        </Typography>
        <Typography variant="h4" gutterBottom>
          {cat.nombre_categoria || "Categoría"}
        </Typography>
      </Box>

      {/* Etiquetas */}
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" spacing={1}>
          {getServiceTags(cat.nombre_categoria).map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              color="primary"
              variant="outlined"
              size="medium"
            />
          ))}
        </Stack>
      </Box>

      {/* Información en formato de párrafos */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            ⚡ Nivel de Prioridad
          </Typography>
          <Typography variant="body1" color="text.primary" sx={{ mb: 1 }}>
            <strong>{cat.sla_descripcion || "No especificado"}</strong>
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            ⏱️ Tiempo de Respuesta
          </Typography>
          <Typography variant="body1" color="text.primary" sx={{ mb: 1 }}>
            <strong>{formatTime(cat.tiempo_minutos)}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tiempo máximo para dar la primera respuesta al ticket
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            ✅ Tiempo de Resolución
          </Typography>
          <Typography variant="body1" color="text.primary" sx={{ mb: 1 }}>
            <strong>{formatTime(cat.tiempo_resolucion)}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tiempo máximo para resolver completamente el caso
          </Typography>
        </Box>

        <Box>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            📝 Descripción
          </Typography>
          <Typography variant="body1" sx={{ fontStyle: "italic" }}>
            Esta categoría agrupa todos los casos relacionados con{" "}
            <strong>{cat.nombre_categoria}</strong> y se rige por los SLA de
            prioridad <strong>{cat.sla_descripcion}</strong>.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
