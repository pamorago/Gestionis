import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import VeterinarioService from "../../services/VeterinarioService";
import {
  Container,
  Typography,
  Box,
  Paper,
  IconButton,
  Chip,
  Stack,
  Tabs,
  Tab,
  Grid,
  Card,
  CardActionArea,
  CardContent,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  AccessTime as AccessTimeIcon,
  Assignment as AssignmentIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";

export default function DetailVeterinarian() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tech, setTech] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    if (!id) return;

    // Cargar detalles del veterinario y sus tickets
    Promise.all([
      VeterinarioService.get(id).catch(() => ({ data: null })),
      VeterinarioService.getTickets(id).catch(() => ({ data: [] })),
    ])
      .then(([techResponse, ticketsResponse]) => {
        setTech(techResponse.data || techResponse.data?.[0] || null);
        setTickets(
          Array.isArray(ticketsResponse.data) ? ticketsResponse.data : []
        );
      })
      .catch((err) => {
        console.error("Error loading veterinarian details:", err);
        setTech(null);
        setTickets([]);
      });
  }, [id]);

  // Calcular tiempo disponible en horas
  const calcularTiempoDisponible = (horasComprometidas, horasTotal = 24) => {
    const horasComprometidasReal = (horasComprometidas || 0) / 60;
    const disponible = horasTotal - horasComprometidasReal;
    return {
      disponible: Math.max(0, disponible).toFixed(1),
      comprometidas: horasComprometidasReal.toFixed(1),
      total: horasTotal,
    };
  };

  // Obtener color según disponibilidad
  const getDisponibilidadColor = (disponible, total) => {
    const porcentaje = (disponible / total) * 100;
    if (porcentaje > 60) return "success";
    if (porcentaje > 30) return "warning";
    return "error";
  };

  // Filtrar tickets por estado
  const getTicketsByStatus = (status) => {
    const filtered = tickets.filter((t) => {
      const estado = (t.nombre_estado || "").toLowerCase();
      if (status === "abierto") return estado === "abierto";
      if (status === "en proceso") return estado === "en proceso";
      if (status === "cerrado") return estado === "cerrado";
      return false;
    });

    // Ordenar por fecha (más próximos primero)
    return filtered.sort((a, b) => {
      const dateA = new Date(a.fecha_cita || a.fecha_creacion || 0);
      const dateB = new Date(b.fecha_cita || b.fecha_creacion || 0);
      return dateA - dateB;
    });
  };

  // Obtener color del estado
  const getStatusColor = (estado) => {
    const estadoLower = (estado || "").toLowerCase();
    if (estadoLower === "abierto") return "primary";
    if (estadoLower === "en proceso") return "success";
    if (estadoLower === "cerrado") return "error";
    if (estadoLower === "cancelado") return "warning";
    return "default";
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return "Sin fecha";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (!tech)
    return <Container sx={{ p: 2 }}>Cargando veterinario...</Container>;

  const tiempo = calcularTiempoDisponible(
    tech.horas_comprometidas,
    tech.horas_disponibles_total
  );
  const disponibilidadColor = getDisponibilidadColor(
    parseFloat(tiempo.disponible),
    parseFloat(tiempo.total)
  );

  const ticketsAbiertos = getTicketsByStatus("abierto");
  const ticketsEnProceso = getTicketsByStatus("en proceso");
  const ticketsCerrados = getTicketsByStatus("cerrado");

  // Calcular carga de trabajo (solo abiertos + en proceso)
  const cargaTrabajo = ticketsAbiertos.length + ticketsEnProceso.length;

  // Renderizar cards de tickets
  const renderTicketCards = (ticketList) => {
    if (ticketList.length === 0) {
      return (
        <Typography sx={{ p: 2, textAlign: "center" }} color="text.secondary">
          No hay tickets en esta categoría
        </Typography>
      );
    }

    return (
      <Grid container spacing={2}>
        {ticketList.map((t) => (
          <Grid item xs={12} sm={6} md={4} key={t.id_ticket}>
            <Card
              sx={{
                height: "100%",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 4,
                },
              }}
            >
              <CardActionArea
                component={Link}
                to={`/ticket/${t.id_ticket}`}
                sx={{ height: "100%", textDecoration: "none" }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 1,
                    }}
                  >
                    <Typography variant="h6" sx={{ fontSize: "1rem" }}>
                      {t.titulo}
                    </Typography>
                    <Chip
                      label={t.nombre_estado}
                      color={getStatusColor(t.nombre_estado)}
                      size="small"
                    />
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {t.nombre_categoria}
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <CalendarIcon fontSize="small" color="action" />
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(t.fecha_cita || t.fecha_creacion)}
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
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

      <Typography variant="h4" gutterBottom>
        🩺 {tech.nombre_veterinario || tech.nombre_completo || "Veterinario"}
      </Typography>

      {/* Información principal */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          {/* Especialidad */}
          <Grid item xs={12}>
            <Chip
              label={tech.especialidad || "Sin especialidad"}
              color="primary"
              size="medium"
            />
          </Grid>

          {/* Contacto */}
          <Grid item xs={12} md={6}>
            <Stack spacing={2}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <EmailIcon fontSize="small" color="action" />
                <Typography variant="body1">{tech.email}</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PhoneIcon fontSize="small" color="action" />
                <Typography variant="body1">{tech.telefono}</Typography>
              </Box>
            </Stack>
          </Grid>

          {/* Carga de trabajo */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 2,
              }}
            >
              <AssignmentIcon fontSize="small" color="action" />
              <Typography variant="body1">
                <strong>Carga de Trabajo:</strong> {cargaTrabajo} tickets
                activos
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {ticketsAbiertos.length} abiertos • {ticketsEnProceso.length} en
              proceso
            </Typography>
          </Grid>

          {/* Tiempo Disponible */}
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                p: 2,
                bgcolor: "background.default",
                borderRadius: 1,
                borderLeft: 4,
                borderColor: `${disponibilidadColor}.main`,
              }}
            >
              <AccessTimeIcon fontSize="small" color="action" />
              <Box>
                <Typography variant="body1" fontWeight="bold">
                  Disponible: {tiempo.disponible}h / {tiempo.total}h
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {tiempo.comprometidas}h comprometidas
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs para tickets */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Tickets Asignados
        </Typography>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}
        >
          <Tab label={`Abiertos (${ticketsAbiertos.length})`} />
          <Tab label={`En Proceso (${ticketsEnProceso.length})`} />
          <Tab label={`Cerrados (${ticketsCerrados.length})`} />
        </Tabs>

        {/* Contenido de tabs */}
        {tabValue === 0 && renderTicketCards(ticketsAbiertos)}
        {tabValue === 1 && renderTicketCards(ticketsEnProceso)}
        {tabValue === 2 && renderTicketCards(ticketsCerrados)}
      </Box>
    </Container>
  );
}
