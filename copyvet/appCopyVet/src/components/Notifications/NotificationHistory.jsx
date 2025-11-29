import { useContext, useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Box,
  Button,
  Stack,
  TextField,
  MenuItem,
  CircularProgress,
  Pagination,
} from "@mui/material";
import { UserContext } from "../../context/UserContext";
import NotificacionService from "../../services/NotificacionService";

const NotificationHistory = () => {
  useTranslation();
  const { decodeToken } = useContext(UserContext);
  const userData = decodeToken() || {};
  const userId = userData?.id_usuario || userData?.sub || userData?.id;

  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState("todas");
  const [filtroEstado, setFiltroEstado] = useState("todas");
  const [pagina, setPagina] = useState(1);
  const itemsPorPagina = 10;

  // Cargar notificaciones
  const cargarNotificaciones = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const response = await NotificacionService.getByUsuario(userId);
      setNotificaciones(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error cargando historial:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    cargarNotificaciones();
  }, [userId, cargarNotificaciones]);

  // Filtrar notificaciones
  let notificacionesFiltradas = notificaciones;

  if (filtroTipo !== "todas") {
    notificacionesFiltradas = notificacionesFiltradas.filter(
      (n) => n.tipo === filtroTipo
    );
  }

  if (filtroEstado !== "todas") {
    const estaLeida = filtroEstado === "leida";
    notificacionesFiltradas = notificacionesFiltradas.filter(
      (n) => n.estado_leida === estaLeida
    );
  }

  // Paginación
  const totalPages = Math.ceil(notificacionesFiltradas.length / itemsPorPagina);
  const inicio = (pagina - 1) * itemsPorPagina;
  const fin = inicio + itemsPorPagina;
  const notificacionesPaginadas = notificacionesFiltradas.slice(inicio, fin);

  // Obtener color por importancia
  const getColorImportancia = (importancia) => {
    switch (importancia) {
      case "alta":
        return "error";
      case "normal":
        return "info";
      case "baja":
        return "success";
      default:
        return "default";
    }
  };

  // Obtener ícono por tipo
  const getIconoTipo = (tipo) => {
    switch (tipo) {
      case "ticket_estado":
        return "🎫 Ticket";
      case "login":
        return "🔐 Login";
      default:
        return "📢 Evento";
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        {/* Encabezado */}
        <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
          📋 Historial de Notificaciones
        </Typography>

        {/* Filtros */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <TextField
            select
            label="Tipo de evento"
            value={filtroTipo}
            onChange={(e) => {
              setFiltroTipo(e.target.value);
              setPagina(1);
            }}
            size="small"
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="todas">Todos</MenuItem>
            <MenuItem value="ticket_estado">Cambio de ticket</MenuItem>
            <MenuItem value="login">Inicio de sesión</MenuItem>
          </TextField>

          <TextField
            select
            label="Estado"
            value={filtroEstado}
            onChange={(e) => {
              setFiltroEstado(e.target.value);
              setPagina(1);
            }}
            size="small"
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="todas">Todas</MenuItem>
            <MenuItem value="leida">Leídas</MenuItem>
            <MenuItem value="noLeida">No leídas</MenuItem>
          </TextField>

          <Button
            variant="outlined"
            onClick={cargarNotificaciones}
            disabled={loading}
          >
            🔄 Actualizar
          </Button>
        </Stack>

        {/* Tabla */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : notificacionesFiltradas.length === 0 ? (
          <Box sx={{ textAlign: "center", p: 4 }}>
            <Typography color="textSecondary">
              No hay notificaciones disponibles
            </Typography>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableRow>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Descripción</TableCell>
                    <TableCell>Responsable</TableCell>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Importancia</TableCell>
                    <TableCell>Estado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {notificacionesPaginadas.map((notificacion) => (
                    <TableRow
                      key={notificacion.id_notificacion}
                      sx={{
                        backgroundColor: notificacion.estado_leida
                          ? "#f9f9f9"
                          : "#f0f8ff",
                        "&:hover": {
                          backgroundColor: "#f0f0f0",
                        },
                      }}
                    >
                      <TableCell sx={{ fontWeight: "bold" }}>
                        {getIconoTipo(notificacion.tipo)}
                      </TableCell>
                      <TableCell>{notificacion.descripcion}</TableCell>
                      <TableCell>{notificacion.responsable || "—"}</TableCell>
                      <TableCell>
                        {new Date(notificacion.fecha_evento).toLocaleDateString(
                          "es-ES",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={notificacion.importancia}
                          color={getColorImportancia(notificacion.importancia)}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={
                            notificacion.estado_leida ? "✓ Leída" : "○ No leída"
                          }
                          variant={
                            notificacion.estado_leida ? "outlined" : "filled"
                          }
                          size="small"
                          color={
                            notificacion.estado_leida ? "default" : "error"
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Paginación */}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Pagination
                count={totalPages}
                page={pagina}
                onChange={(e, value) => setPagina(value)}
              />
            </Box>

            {/* Info */}
            <Typography variant="caption" color="textSecondary" sx={{ mt: 2 }}>
              Mostrando {inicio + 1} a{" "}
              {Math.min(fin, notificacionesFiltradas.length)} de{" "}
              {notificacionesFiltradas.length} notificaciones
            </Typography>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default NotificationHistory;
