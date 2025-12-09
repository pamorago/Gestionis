import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  LinearProgress,
  Chip,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

function RatingAverageCard({ data }) {
  const { t } = useTranslation();

  if (!data) {
    return (
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {t("common:dashboard.ratingAverage.title")}
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

  const promedio = parseFloat(data.promedio_valoracion) || 0;
  const totalValoraciones = parseInt(data.total_valoraciones) || 0;
  const porcentaje = (promedio / 5) * 100;
  const color = promedio >= 4 ? "success" : promedio >= 3 ? "warning" : "error";

  return (
    <Card elevation={3}>
      <CardContent>
        <Stack spacing={2}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ m: 0 }}>
              {t("common:dashboard.ratingAverage.title")}
            </Typography>
            {promedio >= 4 ? (
              <CheckCircleIcon sx={{ color: "success.main", fontSize: 32 }} />
            ) : (
              <ErrorIcon sx={{ color: "warning.main", fontSize: 32 }} />
            )}
          </Box>

          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h3" color={`${color}.main`} fontWeight="bold">
              {promedio.toFixed(2)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t("common:dashboard.ratingAverage.outOf")} 5.0
            </Typography>
          </Box>

          <LinearProgress
            variant="determinate"
            value={porcentaje}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: "action.disabled",
              "& .MuiLinearProgress-bar": {
                backgroundColor:
                  color === "success"
                    ? "#4CAF50"
                    : color === "warning"
                      ? "#FF9800"
                      : "#F44336",
              },
            }}
          />

          <Box
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Chip
              label={`${t("common:dashboard.ratingAverage.count")}: ${totalValoraciones}`}
              size="small"
              variant="outlined"
            />
            <Chip
              label={`${t("common:dashboard.ratingAverage.quality")}: ${promedio >= 4 ? "Bueno" : "Mejorable"}`}
              size="small"
              color={color}
              variant="outlined"
            />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

RatingAverageCard.propTypes = {
  data: PropTypes.shape({
    promedio_valoracion: PropTypes.number,
    total_valoraciones: PropTypes.number,
  }),
};

export default RatingAverageCard;
