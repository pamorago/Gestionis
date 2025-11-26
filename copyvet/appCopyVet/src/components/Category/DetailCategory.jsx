import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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

  if (!cat)
    return <Container sx={{ p: 2 }}>{t("category:detail.loading")}</Container>;

  // Convertir minutos a formato legible
  const formatTime = (minutes) => {
    if (!minutes) return t("category:detail.time.na");
    if (minutes < 60) return `${minutes} ${t("category:detail.time.minutes")}`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const hourLabel =
      hours > 1
        ? t("category:detail.time.hours").split(" | ")[1]
        : t("category:detail.time.hours").split(" | ")[0];
    return mins > 0 ? `${hours}h ${mins}min` : `${hours} ${hourLabel}`;
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

  // Obtener color de etiqueta
  const getTagColor = (etiqueta) => {
    const tag = etiqueta?.toLowerCase();
    if (tag?.includes("urgente") || tag?.includes("emergencia")) return "error";
    if (tag?.includes("preventivo")) return "success";
    if (tag?.includes("tratamiento")) return "warning";
    if (tag?.includes("seguimiento")) return "info";
    return "primary";
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
          {cat.nombre_categoria || t("category:detail.title")}
        </Typography>
      </Box>

      {/* Etiquetas reales desde el backend */}
      {cat.etiquetas && cat.etiquetas.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom fontWeight="bold">
            🏷️ {t("category:detail.sections.tags")}
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {cat.etiquetas.map((etiqueta) => (
              <Chip
                key={etiqueta.id_etiqueta}
                label={etiqueta.nombre_etiqueta}
                color={getTagColor(etiqueta.nombre_etiqueta)}
                variant="outlined"
                size="medium"
              />
            ))}
          </Stack>
        </Box>
      )}

      {/* Especialidades reales desde el backend */}
      {cat.especialidades && cat.especialidades.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom fontWeight="bold">
            ⚕️ {t("category:detail.sections.specialties")}
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {cat.especialidades.map((especialidad, index) => (
              <Chip
                key={index}
                label={especialidad}
                color="secondary"
                variant="filled"
                size="medium"
              />
            ))}
          </Stack>
        </Box>
      )}

      {/* Información en formato de párrafos */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            ⚡ {t("category:detail.sections.priority")}
          </Typography>
          <Typography variant="body1" color="text.primary" sx={{ mb: 1 }}>
            <strong>
              {cat.sla_descripcion || t("category:detail.helpers.notSpecified")}
            </strong>
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            ⏱️ {t("category:detail.sections.responseTime")}
          </Typography>
          <Typography variant="body1" color="text.primary" sx={{ mb: 1 }}>
            <strong>{formatTime(cat.tiempo_minutos)}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("category:detail.helpers.responseTimeDescription")}
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            ✅ {t("category:detail.sections.resolutionTime")}
          </Typography>
          <Typography variant="body1" color="text.primary" sx={{ mb: 1 }}>
            <strong>{formatTime(cat.tiempo_resolucion)}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("category:detail.helpers.resolutionTimeDescription")}
          </Typography>
        </Box>

        <Box>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            📝 {t("category:detail.sections.description")}
          </Typography>
          <Typography variant="body1" sx={{ fontStyle: "italic" }}>
            {t("category:detail.helpers.descriptionTemplate", {
              categoryName: cat.nombre_categoria,
              slaDescription: cat.sla_descripcion,
            })}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
