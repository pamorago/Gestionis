import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Rating,
  CircularProgress,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import StarIcon from "@mui/icons-material/Star";

function RatingSummaryCard({ overallRating }) {
  const { t } = useTranslation();

  if (!overallRating) {
    return (
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {t("common:dashboard.ratingSummary.title")}
          </Typography>
          <Box sx={{ textAlign: "center", py: 2 }}>
            <CircularProgress size={40} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  const rating = parseFloat(overallRating.promedio_valoracion || 0);
  const totalRatings = overallRating.total_valoraciones || 0;

  const getRatingColor = (value) => {
    const num = parseFloat(value || 0);
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
        <Stack spacing={2}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <StarIcon sx={{ color: "#FFB300", fontSize: 28 }} />
              <Typography variant="h6" sx={{ m: 0 }}>
                {t("common:dashboard.ratingSummary.title")}
              </Typography>
            </Stack>
          </Box>

          {/* Calificación Principal */}
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="h2"
              fontWeight="bold"
              color={`${getRatingColor(rating)}.main`}
            >
              {rating.toFixed(2)}
            </Typography>
            <Rating
              value={rating / 1}
              readOnly
              max={5}
              sx={{ justifyContent: "center", display: "flex", mt: 1 }}
            />
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              {getRatingLabel(rating)}
            </Typography>
          </Box>

          {/* Estadísticas */}
          <Box
            sx={{ pt: 1, borderTop: "1px solid #e0e0e0", textAlign: "center" }}
          >
            <Typography
              variant="subtitle2"
              color="text.secondary"
              display="block"
              gutterBottom
            >
              Total de calificaciones
            </Typography>
            <Typography variant="h5" fontWeight="bold">
              {totalRatings}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

RatingSummaryCard.propTypes = {
  overallRating: PropTypes.shape({
    promedio_valoracion: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    total_valoraciones: PropTypes.number,
  }),
};

export default RatingSummaryCard;
