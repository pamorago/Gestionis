import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Rating,
  LinearProgress,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import StarIcon from "@mui/icons-material/Star";

function RatingByCategoryPanel({ data }) {
  const { t } = useTranslation();

  if (!data || data.length === 0) {
    return (
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Valoraciones
          </Typography>
          <Box sx={{ textAlign: "center", py: 2 }}>
            <Typography color="text.secondary">
              {t("common:dashboard.noData")}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  // Calcular promedio general de todas las valoraciones
  // Solo de categorías que tienen valoraciones
  const categoriesWithRatings = data.filter(
    (cat) => parseFloat(cat.valoracion_promedio || 0) > 0
  );

  let overallAverage = 0;
  let totalRatings = 0;
  let totalClosedTickets = 0;

  if (categoriesWithRatings.length > 0) {
    totalRatings = categoriesWithRatings.reduce(
      (sum, category) => sum + (parseFloat(category.total_valoraciones) || 0),
      0
    );
    totalClosedTickets = categoriesWithRatings.reduce(
      (sum, category) => sum + (parseFloat(category.total_tickets) || 0),
      0
    );

    // Promedio ponderado
    overallAverage =
      categoriesWithRatings.reduce((sum, category) => {
        return (
          sum +
          parseFloat(category.valoracion_promedio || 0) *
            parseFloat(category.total_valoraciones || 0)
        );
      }, 0) / Math.max(totalRatings, 1);
  }

  const getRatingColor = (rating) => {
    const num = parseFloat(rating || 0);
    if (num >= 4.5) return "success";
    if (num >= 3.5) return "warning";
    return "error";
  };

  const getRatingLabel = (value) => {
    const num = parseFloat(value || 0);
    if (num >= 4.5) return "Excelente";
    if (num >= 4) return "Muy Bueno";
    if (num >= 3.5) return "Bueno";
    if (num >= 3) return "Aceptable";
    if (num >= 2) return "Deficiente";
    return "Muy Deficiente";
  };

  return (
    <Card elevation={3}>
      <CardContent>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
          <StarIcon sx={{ color: "primary.main" }} />
          <Typography variant="h6" sx={{ m: 0 }}>
            Valoraciones
          </Typography>
        </Stack>

        {/* Escala de Promedio */}
        <Box sx={{ mb: 3 }}>
          <Stack spacing={2}>
            {/* Valor del promedio grande */}
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={`${getRatingColor(overallAverage)}.main`}
              >
                {overallAverage.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Promedio de valoraciones
              </Typography>
            </Box>

            {/* Estrellas visuales */}
            <Box sx={{ textAlign: "center" }}>
              <Rating
                value={overallAverage / 1}
                readOnly
                max={5}
                size="large"
                sx={{ justifyContent: "center", display: "flex" }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {getRatingLabel(overallAverage)}
              </Typography>
            </Box>

            {/* Barra de progreso */}
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                gutterBottom
              >
                Escala de 0 a 5
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(overallAverage / 5) * 100}
                sx={{
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: "action.disabledBackground",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor:
                      getRatingColor(overallAverage) === "success"
                        ? "#4caf50"
                        : getRatingColor(overallAverage) === "warning"
                          ? "#ff9800"
                          : "#f44336",
                    borderRadius: 6,
                  },
                }}
              />
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}
              >
                <Typography variant="caption" color="text.secondary">
                  0
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  5.0
                </Typography>
              </Box>
            </Box>

            {/* Estadísticas */}
            <Stack
              direction="row"
              spacing={2}
              sx={{ pt: 2, borderTop: "1px solid #e0e0e0" }}
            >
              <Box sx={{ flex: 1, textAlign: "center" }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  gutterBottom
                >
                  Calificaciones
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {totalRatings}
                </Typography>
              </Box>
              <Box sx={{ flex: 1, textAlign: "center" }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  gutterBottom
                >
                  Cobertura
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {totalClosedTickets > 0
                    ? ((totalRatings / totalClosedTickets) * 100).toFixed(1)
                    : 0}
                  %
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}

RatingByCategoryPanel.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id_categoria: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      nombre_categoria: PropTypes.string.isRequired,
      valoracion_promedio: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
      total_valoraciones: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
      total_tickets: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
};

export default RatingByCategoryPanel;
