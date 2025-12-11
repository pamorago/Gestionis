import {
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  Stack,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import StarIcon from "@mui/icons-material/Star";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
export default function TechniciansRankingPanel({ data }) {
  const { t } = useTranslation();

  if (!data || data.length === 0) {
    return (
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {t("common:dashboard.techniciansRanking.title")}
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

  const getMedalColor = (position) => {
    switch (position) {
      case 0:
        return "#FFD700"; // Gold
      case 1:
        return "#C0C0C0"; // Silver
      case 2:
        return "#CD7F32"; // Bronze
      default:
        return "#e0e0e0";
    }
  };

  return (
    <Card elevation={3}>
      <CardContent>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <EmojiEventsIcon sx={{ color: "primary.main" }} />
          <Typography variant="h6" sx={{ m: 0 }}>
            {t("common:dashboard.techniciansRanking.title")}
          </Typography>
        </Stack>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "action.hover" }}>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  {t("common:dashboard.techniciansRanking.position")}
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  {t("common:dashboard.techniciansRanking.name")}
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  {t("common:dashboard.techniciansRanking.solved")}
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  {t("common:dashboard.techniciansRanking.rating")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.slice(0, 10).map((tech, index) => (
                <TableRow
                  key={tech.id_usuario}
                  sx={{
                    backgroundColor:
                      index === 0
                        ? "#FFF9C4"
                        : index === 1
                          ? "#F5F5F5"
                          : "transparent",
                    "&:hover": { backgroundColor: "action.hover" },
                  }}
                >
                  <TableCell align="center">
                    {index < 3 ? (
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          backgroundColor: getMedalColor(index),
                          color: "black",
                          fontWeight: "bold",
                          margin: "0 auto",
                        }}
                      >
                        {index + 1}
                      </Avatar>
                    ) : (
                      <Chip label={index + 1} size="small" variant="outlined" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      fontWeight={index < 3 ? "bold" : "normal"}
                    >
                      {tech.nombre_completo}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Chip
                      label={tech.tickets_resueltos}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Stack
                      direction="row"
                      spacing={0.5}
                      justifyContent="flex-end"
                      alignItems="center"
                    >
                      <StarIcon sx={{ fontSize: 16, color: "#FFB300" }} />
                      <Typography variant="body2" fontWeight="bold">
                        {parseFloat(tech.valoracion_promedio || 0).toFixed(2)}
                      </Typography>
                      {tech.total_valoraciones > 0 && (
                        <Typography variant="caption" color="text.secondary">
                          ({tech.total_valoraciones})
                        </Typography>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}

TechniciansRankingPanel.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id_usuario: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      nombre_completo: PropTypes.string.isRequired,
      tickets_resueltos: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]).isRequired,
      valoracion_promedio: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
      total_valoraciones: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]).isRequired,
    })
  ),
};
