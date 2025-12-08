import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import TicketService from "../../services/TicketService";
import ValoracionDialog from "./ValoracionDialog";
import { UserContext } from "../../context/UserContext";
import {
  Container,
  Typography,
  Box,
  Paper,
  Chip,
  IconButton,
  Grid,
  Card,
  CardContent,
  Stack,
  Divider,
  Button,
  Rating,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Pets as PetsIcon,
  Category as CategoryIcon,
  Assignment as AssignmentIcon,
  CalendarToday as CalendarIcon,
  StarRate as StarRateIcon,
} from "@mui/icons-material";

// Función para obtener el color del estado
const getStatusColor = (estado) => {
  switch (estado?.toLowerCase()) {
    case "abierto":
      return "primary"; // Azul
    case "en proceso":
      return "success"; // Verde
    case "cerrado":
      return "error"; // Rojo
    case "cancelado":
      return "warning"; // Amarillo
    default:
      return "default";
  }
};

export default function DetailTicket() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  const userDecoded = userContext?.decodeToken() || {};
  const userId = userDecoded?.id_usuario || userDecoded?.sub || userDecoded?.id;

  const [ticket, setTicket] = useState(null);
  const [history, setHistory] = useState([]);
  const [imagenes, setImagenes] = useState([]);
  const [openValoracionDialog, setOpenValoracionDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    if (!id) return;

    Promise.all([
      TicketService.get(id),
      TicketService.getHistorico(id),
      TicketService.getImagenes(id).catch(() => ({ data: [] })),
    ])
      .then(([ticketResponse, historyResponse, imagenesResponse]) => {
        setTicket(ticketResponse.data || ticketResponse.data?.[0] || null);
        setHistory(
          Array.isArray(historyResponse.data) ? historyResponse.data : []
        );
        const imagenesData = imagenesResponse?.data;
        if (Array.isArray(imagenesData) && imagenesData.length > 0) {
          setImagenes(imagenesData);
        } else {
          setImagenes([]);
        }
      })
      .catch((err) => {
        console.error("Error loading ticket details:", err);
        setTicket(null);
        setHistory([]);
        setImagenes([]);
      });
  }, [id]);

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Formatear tiempo en horas y minutos
  const formatTime = (minutes) => {
    if (!minutes) return "0 min";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) return `${hours}h ${mins}min`;
    return `${mins}min`;
  };

  // Manejar valoración
  const handleValorarClick = () => {
    setOpenValoracionDialog(true);
  };

  const handleValoracionSubmit = async (valoracionData) => {
    try {
      const payload = {
        ...valoracionData,
        id_usuario: userId,
      };

      await TicketService.valorar(id, payload);

      // Recargar el ticket para mostrar la valoración
      const ticketResponse = await TicketService.get(id);
      setTicket(ticketResponse.data || ticketResponse.data?.[0] || null);

      setSnackbar({
        open: true,
        message: "Valoración enviada exitosamente",
        severity: "success",
      });
      setOpenValoracionDialog(false);
    } catch (error) {
      console.error("Error al valorar ticket:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Error al enviar la valoración",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (!ticket)
    return <Container sx={{ p: 2 }}>{t("ticket:detail.loading")}</Container>;

  const statusColor = getStatusColor(ticket.nombre_estado);
  const isCerrado = ticket.nombre_estado?.toLowerCase() === "cerrado";

  return (
    <Container sx={{ p: 2, maxWidth: "lg" }}>
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

      {/* Encabezado */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
          <Typography variant="h4">#{ticket.id_ticket}</Typography>
          <Chip
            label={ticket.nombre_estado}
            color={statusColor}
            size="medium"
          />
        </Box>
        <Typography variant="h5" gutterBottom>
          {ticket.titulo}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {ticket.descripcion}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Información principal */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t("ticket:detail.ticketDetails")}
            </Typography>
            <Stack spacing={2} divider={<Divider />}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PersonIcon color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {t("ticket:detail.client")}
                  </Typography>
                  <Typography variant="body1">{ticket.cliente}</Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PetsIcon color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {t("ticket:detail.pet")}
                  </Typography>
                  <Typography variant="body1">{ticket.mascota}</Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CategoryIcon color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {t("ticket:detail.category")}
                  </Typography>
                  <Typography variant="body1">
                    {ticket.nombre_categoria}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <AssignmentIcon color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {t("ticket:detail.assignedTo")}
                  </Typography>
                  <Typography variant="body1">
                    {ticket.asignado_a || t("ticket:detail.unassigned")}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CalendarIcon color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {t("ticket:detail.appointmentDate")}
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(ticket.fecha_cita)}
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Paper>

          {/* Imágenes */}
          {imagenes.length > 0 && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                {t("ticket:detail.ticketImages")}
              </Typography>
              <Grid container spacing={2}>
                {imagenes.map((img) => (
                  <Grid item xs={12} sm={6} md={4} key={img.id_imagen}>
                    <Card>
                      <Box
                        component="img"
                        src={`http://localhost:81/copyvet/uploads/${img.imagen}`}
                        alt={`Imagen del ticket ${ticket.id_ticket}`}
                        sx={{
                          width: "100%",
                          height: 200,
                          objectFit: "cover",
                        }}
                      />
                      <CardContent>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(img.created_at)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          )}

          {/* Historial */}
          <Paper elevation={3} sx={{ p: 3, boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t("ticket:detail.changeHistory")}
            </Typography>
            {history.length === 0 ? (
              <Typography color="text.secondary">
                {t("ticket:detail.noHistory")}
              </Typography>
            ) : (
              <Stack spacing={2}>
                {history.map((h, index) => (
                  <Box
                    key={h.id_historico || h.id || index}
                    sx={{
                      p: 2,
                      bgcolor: "background.default",
                      borderRadius: 1,
                      borderLeft: 3,
                      borderColor: "primary.main",
                      boxShadow: 2,
                    }}
                  >
                    <Typography variant="body2" fontWeight="bold">
                      {h.usuario || "Sistema"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(h.fecha || h.fecha_creacion)}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {t("ticket:detail.status")}:{" "}
                      {h.estado || h.estado_anterior}
                    </Typography>
                    {h.comentario && (
                      <Typography variant="body2" color="text.secondary">
                        {h.comentario}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Stack>
            )}
          </Paper>
        </Grid>

        {/* Panel lateral */}
        <Grid item xs={12} md={4}>
          {/* Valoración */}
          {isCerrado && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <StarRateIcon color="warning" />
                Valoración del Servicio
              </Typography>
              
              {ticket.valoracion ? (
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <Rating value={ticket.valoracion} readOnly size="large" />
                    <Typography variant="body1" fontWeight="bold">
                      ({ticket.valoracion}/5)
                    </Typography>
                  </Box>
                  
                  {ticket.comentario_valoracion && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        Comentario:
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        {ticket.comentario_valoracion}
                      </Typography>
                    </Box>
                  )}
                  
                  <Typography variant="caption" color="text.secondary">
                    Valorado el: {formatDate(ticket.fecha_valoracion)}
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Este ticket aún no ha sido valorado.
                  </Typography>
                  {ticket.id_creado_por_usuario == userId ? (
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      startIcon={<StarRateIcon />}
                      onClick={handleValorarClick}
                    >
                      Valorar Servicio
                    </Button>
                  ) : (
                    <Alert severity="info" sx={{ fontSize: "0.875rem" }}>
                      Solo el creador del ticket puede valorarlo.
                    </Alert>
                  )}
                </Box>
              )}
            </Paper>
          )}

          {/* Tiempos y SLA */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t("ticket:detail.timeInfo")}
            </Typography>
            <Stack spacing={2}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {t("ticket:detail.creationDate")}
                </Typography>
                <Typography variant="body2">
                  {formatDate(ticket.fecha_creacion)}
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant="caption" color="text.secondary">
                  {t("ticket:detail.elapsedTime")}
                </Typography>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  color="primary.main"
                >
                  {formatTime(ticket.tiempo_transcurrido)}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  {t("ticket:detail.responseSLA")}
                </Typography>
                <Typography variant="body2">
                  {formatTime(ticket.sla_respuesta)}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  {t("ticket:detail.resolutionSLA")}
                </Typography>
                <Typography variant="body2">
                  {formatTime(ticket.sla_resolucion)}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  {t("ticket:priority.priority")}
                </Typography>
                <Chip
                  label={ticket.prioridad}
                  size="small"
                  color={
                    ticket.prioridad?.toLowerCase().includes("alta")
                      ? "error"
                      : ticket.prioridad?.toLowerCase().includes("media")
                        ? "warning"
                        : "default"
                  }
                />
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Diálogo de Valoración */}
      <ValoracionDialog
        open={openValoracionDialog}
        onClose={() => setOpenValoracionDialog(false)}
        onSubmit={handleValoracionSubmit}
        ticketTitulo={ticket?.titulo || ""}
      />

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
