import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Alert,
  AlertTitle,
  Chip,
  Box,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useTranslation } from "react-i18next";

export default function AlertasUrgentes({ ticketsUrgentes, ticketsProximos }) {
  const { t } = useTranslation();
  const [tiemposRestantes, setTiemposRestantes] = useState({});

  useEffect(() => {
    const calcularTiempoRestante = (fechaVencimiento) => {
      const ahora = new Date();
      const vencimiento = new Date(fechaVencimiento);
      const diferencia = vencimiento - ahora;

      if (diferencia <= 0) {
        return {
          texto: t("common:dashboard.statistics.urgentAlerts.expired"),
          color: "error",
          vencido: true,
        };
      }

      const minutos = Math.floor(diferencia / 1000 / 60);
      const segundos = Math.floor((diferencia / 1000) % 60);

      if (minutos <= 10) {
        return {
          texto: `${minutos}m ${segundos}s`,
          color: "error",
          vencido: false,
        };
      } else if (minutos <= 30) {
        return {
          texto: `${minutos} minutos`,
          color: "warning",
          vencido: false,
        };
      } else {
        return { texto: `${minutos} minutos`, color: "info", vencido: false };
      }
    };

    const actualizarTiempos = () => {
      const nuevosTiempos = {};
      ticketsProximos.forEach((ticket) => {
        nuevosTiempos[ticket.id_ticket] = calcularTiempoRestante(
          ticket.fecha_vencimiento_sla
        );
      });
      setTiemposRestantes(nuevosTiempos);
    };

    actualizarTiempos();
    const intervalo = setInterval(actualizarTiempos, 1000);

    return () => clearInterval(intervalo);
  }, [ticketsProximos, t]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {ticketsUrgentes.length > 0 && (
        <Alert severity="error" icon={<WarningIcon />}>
          <AlertTitle>
            {t("common:dashboard.statistics.urgentAlerts.urgentTickets")} (
            {ticketsUrgentes.length})
          </AlertTitle>
          <List dense>
            {ticketsUrgentes.slice(0, 5).map((ticket) => (
              <ListItem key={ticket.id_ticket} disablePadding>
                <ListItemText
                  primary={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="body2">
                        #{ticket.id_ticket} - {ticket.asunto}
                      </Typography>
                      <Chip
                        label={ticket.nombre_prioridad}
                        size="small"
                        color="error"
                        variant="outlined"
                      />
                    </Box>
                  }
                  secondary={`${t("common:dashboard.statistics.urgentAlerts.category")}: ${ticket.nombre_categoria} - ${ticket.nombre_especialidad || t("common:dashboard.statistics.urgentAlerts.specialty")}`}
                />
              </ListItem>
            ))}
          </List>
          {ticketsUrgentes.length > 5 && (
            <Typography variant="caption" color="text.secondary">
              +{ticketsUrgentes.length - 5}{" "}
              {t("common:dashboard.statistics.urgentAlerts.moreTickets")}
            </Typography>
          )}
        </Alert>
      )}

      {ticketsProximos.length > 0 && (
        <Paper sx={{ p: 2 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <AccessTimeIcon color="warning" />
            Tickets Próximos a Vencer ({ticketsProximos.length})
          </Typography>
          <List>
            {ticketsProximos.map((ticket) => {
              const tiempoInfo = tiemposRestantes[ticket.id_ticket] || {
                texto: "Calculando...",
                color: "default",
                vencido: false,
              };
              return (
                <ListItem
                  key={ticket.id_ticket}
                  sx={{
                    bgcolor: tiempoInfo.vencido
                      ? "rgba(211, 47, 47, 0.08)"
                      : "rgba(237, 108, 2, 0.08)",
                    borderRadius: 1,
                    mb: 1,
                  }}
                >
                  <ListItemText
                    primary={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          flexWrap: "wrap",
                        }}
                      >
                        <Typography variant="subtitle2">
                          #{ticket.id_ticket} - {ticket.asunto}
                        </Typography>
                        <Chip
                          label={tiempoInfo.texto}
                          size="small"
                          color={tiempoInfo.color}
                          sx={{ fontWeight: "bold" }}
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="caption" display="block">
                          Asignado a:{" "}
                          {ticket.nombre_veterinario || "Sin asignar"}
                        </Typography>
                        <Typography variant="caption" display="block">
                          Estado: {ticket.nombre_estado} - Prioridad:{" "}
                          {ticket.nombre_prioridad}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              );
            })}
          </List>
        </Paper>
      )}

      {(ticketsUrgentes === null || ticketsUrgentes.length === 0) &&
        (ticketsProximos === null || ticketsProximos.length === 0) && (
          <Alert severity="success">
            <AlertTitle>
              {t("common:dashboard.statistics.urgentAlerts.allClear.title")}
            </AlertTitle>
            {t("common:dashboard.statistics.urgentAlerts.allClear.message")}
          </Alert>
        )}
    </Box>
  );
}

AlertasUrgentes.propTypes = {
  ticketsUrgentes: PropTypes.arrayOf(
    PropTypes.shape({
      id_ticket: PropTypes.number.isRequired,
      asunto: PropTypes.string.isRequired,
      nombre_categoria: PropTypes.string.isRequired,
      nombre_especialidad: PropTypes.string,
      nombre_prioridad: PropTypes.string.isRequired,
    })
  ).isRequired,
  ticketsProximos: PropTypes.arrayOf(
    PropTypes.shape({
      id_ticket: PropTypes.number.isRequired,
      asunto: PropTypes.string.isRequired,
      nombre_estado: PropTypes.string.isRequired,
      nombre_prioridad: PropTypes.string.isRequired,
      nombre_veterinario: PropTypes.string,
      fecha_vencimiento_sla: PropTypes.string.isRequired,
    })
  ).isRequired,
};
