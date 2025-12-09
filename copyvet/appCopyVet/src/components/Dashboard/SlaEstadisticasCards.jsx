import PropTypes from "prop-types";
import { Paper, Typography, Grid, Box } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { useTranslation } from "react-i18next";

export default function SlaEstadisticasCards({ data }) {
  const { t } = useTranslation();
  const totalTickets = parseInt(data.total_tickets) || 0;
  const dentroSla = parseInt(data.dentro_sla) || 0;
  const fueraSla = parseInt(data.fuera_sla) || 0;
  const porcentajeDentroSla =
    totalTickets > 0 ? ((dentroSla / totalTickets) * 100).toFixed(1) : 0;
  const porcentajeFueraSla =
    totalTickets > 0 ? ((fueraSla / totalTickets) * 100).toFixed(1) : 0;

  const cards = [
    {
      title: t("common:dashboard.statistics.slaCards.totalTickets"),
      value: totalTickets,
      icon: <AssessmentIcon sx={{ fontSize: 40 }} />,
      color: "primary.main",
      bgcolor: "rgba(25, 118, 210, 0.08)",
    },
    {
      title: t("common:dashboard.statistics.slaCards.withinSla"),
      value: dentroSla,
      subtitle: `${porcentajeDentroSla}% ${t("common:dashboard.statistics.slaCards.ofTotal")}`,
      icon: <CheckCircleIcon sx={{ fontSize: 40 }} />,
      color: "success.main",
      bgcolor: "rgba(46, 125, 50, 0.08)",
    },
    {
      title: t("common:dashboard.statistics.slaCards.outsideSla"),
      value: fueraSla,
      subtitle: `${porcentajeFueraSla}% ${t("common:dashboard.statistics.slaCards.ofTotal")}`,
      icon: <ErrorIcon sx={{ fontSize: 40 }} />,
      color: "error.main",
      bgcolor: "rgba(211, 47, 47, 0.08)",
    },
  ];

  return (
    <Grid container spacing={2}>
      {cards.map((card, index) => (
        <Grid item xs={12} sm={4} key={index}>
          <Paper
            sx={{
              p: 3,
              display: "flex",
              flexDirection: "column",
              height: "100%",
              bgcolor: card.bgcolor,
              borderLeft: 4,
              borderColor: card.color,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  {card.title}
                </Typography>
                <Typography
                  variant="h3"
                  sx={{ color: card.color, fontWeight: "bold" }}
                >
                  {card.value}
                </Typography>
                {card.subtitle && (
                  <Typography variant="caption" color="text.secondary">
                    {card.subtitle}
                  </Typography>
                )}
              </Box>
              <Box sx={{ color: card.color, opacity: 0.8 }}>{card.icon}</Box>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}

SlaEstadisticasCards.propTypes = {
  data: PropTypes.shape({
    total_tickets: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    dentro_sla: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    fuera_sla: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
  }).isRequired,
};
