import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  LinearProgress,
  Grid,
  Chip,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

export default function SLAComplianceCard({ data }) {
  const { t } = useTranslation();

  if (!data) {
    return (
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {t("common:dashboard.slaCompliance.title")}
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

  const total = data.total_tickets || 0;
  const dentro = data.dentro_sla || 0;
  const fuera = data.fuera_sla || 0;
  const porcentajeDentro = total > 0 ? (dentro / total) * 100 : 0;
  const porcentajeFuera = total > 0 ? (fuera / total) * 100 : 0;

  return (
    <Card elevation={3}>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6" gutterBottom sx={{ m: 0 }}>
            {t("common:dashboard.slaCompliance.title")}
          </Typography>

          <Grid container spacing={2}>
            {/* SLA Response */}
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="subtitle2" fontWeight="bold">
                    {t("common:dashboard.slaCompliance.response")}
                  </Typography>
                  <TrendingUpIcon
                    sx={{ color: "success.main", fontSize: 20 }}
                  />
                </Stack>
                <Chip
                  label={`${porcentajeDentro.toFixed(1)}%`}
                  color="success"
                  size="small"
                />
              </Box>
              <LinearProgress
                variant="determinate"
                value={Math.min(porcentajeDentro, 100)}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: "action.disabled",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "#4CAF50",
                  },
                }}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1, display: "block" }}
              >
                {dentro} / {total} {t("common:dashboard.slaCompliance.tickets")}
              </Typography>
            </Grid>

            {/* SLA Resolution */}
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="subtitle2" fontWeight="bold">
                    {t("common:dashboard.slaCompliance.resolution")}
                  </Typography>
                  <TrendingDownIcon
                    sx={{ color: "error.main", fontSize: 20 }}
                  />
                </Stack>
                <Chip
                  label={`${porcentajeFuera.toFixed(1)}%`}
                  color={porcentajeFuera > 20 ? "error" : "warning"}
                  size="small"
                />
              </Box>
              <LinearProgress
                variant="determinate"
                value={Math.min(porcentajeFuera, 100)}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: "action.disabled",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor:
                      porcentajeFuera > 20 ? "#F44336" : "#FF9800",
                  },
                }}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1, display: "block" }}
              >
                {fuera} / {total}{" "}
                {t("common:dashboard.slaCompliance.ticketsOutOfSla")}
              </Typography>
            </Grid>
          </Grid>

          {/* Summary */}
          <Box sx={{ pt: 2, borderTop: "1px solid", borderColor: "divider" }}>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              {t("common:dashboard.slaCompliance.summary")}:
            </Typography>
            <Typography variant="body2" fontWeight="bold" sx={{ mt: 1 }}>
              {porcentajeDentro >= 80
                ? t("common:dashboard.slaCompliance.statusGood")
                : porcentajeDentro >= 60
                  ? t("common:dashboard.slaCompliance.statusWarning")
                  : t("common:dashboard.slaCompliance.statusCritical")}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

SLAComplianceCard.propTypes = {
  data: PropTypes.shape({
    total_tickets: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    dentro_sla: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    fuera_sla: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
};
