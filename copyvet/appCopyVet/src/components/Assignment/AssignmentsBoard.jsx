import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import VeterinarioService from "../../services/VeterinarioService";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Chip,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Divider,
  Stack,
  CircularProgress,
} from "@mui/material";
import { Link } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

// Calcula color del chip según tiempo restante SLA
function slaColor(remainingMinutes) {
  if (remainingMinutes <= 0) return "error";
  if (remainingMinutes < 60) return "warning";
  return "success";
}

// Componente para mostrar tickets de un veterinario
function VeterinarianTickets({ id }) {
  const { t } = useTranslation();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    VeterinarioService.getTickets(id)
      .then((r) => {
        const allTickets = Array.isArray(r.data) ? r.data : [];

        // Filtrar solo tickets abiertos y en proceso
        const filteredTickets = allTickets.filter((t) => {
          const estado = (t.nombre_estado || "").toLowerCase();
          return estado === "abierto" || estado === "en proceso";
        });

        // Ordenar: primero por estado (Abierto > En Proceso), luego por fecha
        const sortedTickets = filteredTickets.sort((a, b) => {
          const estadoA = (a.nombre_estado || "").toLowerCase();
          const estadoB = (b.nombre_estado || "").toLowerCase();

          // Prioridad: Abierto (1) > En Proceso (2)
          const prioridadA = estadoA === "abierto" ? 1 : 2;
          const prioridadB = estadoB === "abierto" ? 1 : 2;

          if (prioridadA !== prioridadB) {
            return prioridadA - prioridadB;
          }

          // Si tienen el mismo estado, ordenar por fecha (más reciente primero)
          const fechaA = new Date(a.fecha_creacion || 0);
          const fechaB = new Date(b.fecha_creacion || 0);
          return fechaB - fechaA;
        });

        setTickets(sortedTickets);
      })
      .catch((err) => {
        console.error("Error loading vet tickets:", err);
        setTickets([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  return (
    <Box>
      {tickets.map((t) => {
        // tiempo restante: sla_resolucion - tiempo_transcurrido (en min)
        const remaining =
          (t.sla_resolucion ?? 0) - (t.tiempo_transcurrido ?? 0);
        return (
          <Card
            key={t.id_ticket}
            elevation={1}
            sx={{
              mt: 1.5,
              transition: "all 0.2s",
              "&:hover": {
                elevation: 3,
                transform: "translateY(-2px)",
              },
            }}
          >
            <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                spacing={1}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    component={Link}
                    to={`/ticket/${t.id_ticket}`}
                    sx={{
                      textDecoration: "none",
                      color: "primary.main",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    <AssignmentIcon
                      sx={{ fontSize: 16, mr: 0.5, verticalAlign: "middle" }}
                    />
                    #{t.id_ticket} - {t.titulo}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                    <Chip
                      label={t.nombre_categoria}
                      size="small"
                      variant="outlined"
                      sx={{ height: 20, fontSize: "0.7rem" }}
                    />
                    <Chip
                      label={t.nombre_estado}
                      size="small"
                      color="default"
                      sx={{ height: 20, fontSize: "0.7rem" }}
                    />
                  </Stack>
                </Box>
                <Chip
                  icon={<AccessTimeIcon />}
                  size="small"
                  color={slaColor(remaining)}
                  label={`${remaining} ${t("assignmentsBoard.slaRemaining")}`}
                  sx={{ fontWeight: 600 }}
                />
              </Stack>
            </CardContent>
          </Card>
        );
      })}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", pt: 3 }}>
          <CircularProgress size={30} />
        </Box>
      )}
      {!loading && tickets.length === 0 && (
        <Typography
          variant="body2"
          align="center"
          sx={{ pt: 3, pb: 1, color: "text.secondary", fontStyle: "italic" }}
        >
          {t("assignmentsBoard.noTickets")}
        </Typography>
      )}
    </Box>
  );
}

VeterinarianTickets.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default function AssignmentsBoard() {
  const { t } = useTranslation();
  const [vets, setVets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    VeterinarioService.list()
      .then((r) => setVets(Array.isArray(r.data) ? r.data : []))
      .catch((err) => {
        console.error("Error loading vets:", err);
        setVets([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 3, mb: 4, bgcolor: "primary.main" }}>
        <Typography variant="h4" gutterBottom color="white" fontWeight={600}>
          📋 {t("assignmentsBoard.title")}
        </Typography>
        <Typography variant="body2" color="rgba(255,255,255,0.9)">
          {t("assignmentsBoard.subtitle")}
        </Typography>
      </Paper>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress size={50} />
        </Box>
      )}

      {!loading && vets.length === 0 && (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            {t("assignmentsBoard.noVeterinarians")}
          </Typography>
        </Paper>
      )}

      <Grid container spacing={3}>
        {vets.map((v) => (
          <Grid item xs={12} md={6} lg={4} key={v.id_veterinario || v.id}>
            <Card
              elevation={3}
              sx={{
                height: "100%",
                transition: "all 0.3s",
                "&:hover": {
                  elevation: 6,
                  transform: "translateY(-4px)",
                },
              }}
            >
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: "primary.main" }}>
                    <PersonIcon />
                  </Avatar>
                }
                title={
                  <Typography variant="h6" fontWeight={600}>
                    {v.nombre_completo}
                  </Typography>
                }
                subheader={
                  <Typography variant="caption" color="text.secondary">
                    {v.especialidad || t("assignmentsBoard.veterinarian")}
                  </Typography>
                }
                sx={{ pb: 1 }}
              />
              <Divider />
              <CardContent sx={{ pt: 2 }}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                  sx={{ mb: 1 }}
                >
                  {t("assignmentsBoard.assignedTickets")} (
                  {v.tickets_activos ?? 0})
                </Typography>
                <VeterinarianTickets id={v.id_veterinario || v.id} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
