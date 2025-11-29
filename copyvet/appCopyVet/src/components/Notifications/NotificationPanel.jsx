import { useContext, useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  IconButton,
  Badge,
  Menu,
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  Divider,
  Chip,
  Button,
  Tooltip,
  CircularProgress,
  Avatar,
  Stack,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  NotificationsActive as NotificationsActiveIcon,
  DoneAll as DoneAllIcon,
} from "@mui/icons-material";
import { UserContext } from "../../context/UserContext";
import NotificacionService from "../../services/NotificacionService";

const NotificationPanel = () => {
  const { t } = useTranslation();
  const { decodeToken } = useContext(UserContext);
  const userData = decodeToken() || {};
  const userId = userData?.id_usuario || userData?.sub || userData?.id;

  const [anchorEl, setAnchorEl] = useState(null);
  const [notificaciones, setNotificaciones] = useState([]);
  const [noLeidas, setNoLeidas] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filtro, setFiltro] = useState("todas"); // 'todas', 'noLeidas'

  // Cargar notificaciones
  const cargarNotificaciones = useCallback(async () => {
    if (!userId) {
      // Si no hay usuario, limpiar las notificaciones
      setNotificaciones([]);
      setNoLeidas(0);
      return;
    }

    try {
      setLoading(true);
      const response = await NotificacionService.getByUsuario(userId);
      setNotificaciones(Array.isArray(response.data) ? response.data : []);

      // Contar no leídas
      const noLeidasResponse = await NotificacionService.contarNoLeidas(userId);
      setNoLeidas(noLeidasResponse.data?.total || 0);
    } catch (error) {
      console.error("Error cargando notificaciones:", error);
      // En caso de error, limpiar también
      setNotificaciones([]);
      setNoLeidas(0);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Cargar notificaciones al montar y cada 30 segundos (polling)
  useEffect(() => {
    cargarNotificaciones();
    const intervalo = setInterval(cargarNotificaciones, 30000); // Polling cada 30 segundos
    return () => clearInterval(intervalo);
  }, [userId, cargarNotificaciones]);

  // Abrir panel
  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Cerrar panel
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Marcar como leída
  const handleMarcarComoLeida = async (id_notificacion) => {
    try {
      await NotificacionService.marcarComoLeida(id_notificacion, userId);
      // Actualizar estado local sin hacer request
      setNotificaciones((prev) =>
        prev.map((n) =>
          n.id_notificacion === id_notificacion
            ? { ...n, estado_leida: true }
            : n
        )
      );
      setNoLeidas((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error al marcar como leída:", error);
    }
  };

  // Marcar todas como leídas
  const handleMarcarTodasComoLeidas = async () => {
    try {
      await NotificacionService.marcarTodasComoLeidas(userId);
      // Actualizar estado local sin hacer request
      setNotificaciones((prev) =>
        prev.map((n) => ({ ...n, estado_leida: true }))
      );
      setNoLeidas(0);
    } catch (error) {
      console.error("Error al marcar todas como leídas:", error);
    }
  };

  // Filtrar notificaciones
  const notificacionesFiltradas =
    filtro === "noLeidas"
      ? notificaciones.filter((n) => !n.estado_leida)
      : notificaciones;

  // Obtener icono por tipo
  const getIconoTipo = (tipo) => {
    switch (tipo) {
      case "ticket_estado":
        return "🎫";
      case "login":
        return "🔐";
      default:
        return "📢";
    }
  };

  // Obtener color por importancia
  const getColorImportancia = (importancia) => {
    switch (importancia) {
      case "alta":
        return "#ff6b6b";
      case "normal":
        return "#4dabf7";
      case "baja":
        return "#a6e3a1";
      default:
        return "#868e96";
    }
  };

  const open = Boolean(anchorEl);

  // No mostrar nada si no hay usuario autenticado
  if (!userId) {
    return null;
  }

  return (
    <>
      <Tooltip title={t("common:messages.loading")}>
        <IconButton
          onClick={handleOpen}
          color="inherit"
          sx={{
            position: "relative",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          <Badge badgeContent={noLeidas} color="error">
            {noLeidas > 0 ? (
              <NotificationsActiveIcon
                sx={{ animation: "pulse 2s infinite" }}
                color="primary"
              />
            ) : (
              <NotificationsIcon color="primary" />
            )}
          </Badge>
        </IconButton>
      </Tooltip>

      {/* Panel de notificaciones */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: "420px",
            maxHeight: "600px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            borderRadius: "12px",
          },
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {/* Encabezado */}
        <Box sx={{ p: 2, borderBottom: "1px solid #e0e0e0" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {t("common:navigation.notifications") || "Notificaciones"}
            </Typography>
            {noLeidas > 0 && (
              <Tooltip title="Marcar todas como leídas">
                <IconButton size="small" onClick={handleMarcarTodasComoLeidas}>
                  <DoneAllIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Stack>

          {/* Filtros */}
          <Stack direction="row" gap={1} sx={{ mt: 1 }}>
            <Chip
              label="Todas"
              onClick={() => setFiltro("todas")}
              variant={filtro === "todas" ? "filled" : "outlined"}
              size="small"
              sx={{ cursor: "pointer" }}
            />
            <Chip
              label={`No leídas (${noLeidas})`}
              onClick={() => setFiltro("noLeidas")}
              variant={filtro === "noLeidas" ? "filled" : "outlined"}
              size="small"
              sx={{ cursor: "pointer" }}
            />
          </Stack>
        </Box>

        {/* Lista de notificaciones */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress size={40} />
          </Box>
        ) : notificacionesFiltradas.length === 0 ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography color="textSecondary">
              {filtro === "noLeidas"
                ? "No tienes notificaciones sin leer"
                : "No hay notificaciones disponibles"}
            </Typography>
          </Box>
        ) : (
          <List
            sx={{
              maxHeight: "450px",
              overflowY: "auto",
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-track": {
                background: "#f1f1f1",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#888",
                borderRadius: "3px",
              },
            }}
          >
            {notificacionesFiltradas.map((notificacion, index) => (
              <Box key={notificacion.id_notificacion}>
                <ListItem
                  disablePadding
                  sx={{
                    backgroundColor: notificacion.estado_leida
                      ? "#f9f9f9"
                      : "#f0f8ff",
                    borderLeft: `4px solid ${getColorImportancia(notificacion.importancia)}`,
                    "&:hover": {
                      backgroundColor: notificacion.estado_leida
                        ? "#f5f5f5"
                        : "#e8f4fd",
                    },
                  }}
                >
                  <ListItemButton
                    sx={{ py: 1.5, pl: 1.5, pr: 1 }}
                    onClick={() => {
                      if (!notificacion.estado_leida) {
                        handleMarcarComoLeida(notificacion.id_notificacion);
                      }
                    }}
                  >
                    {/* Ícono y contenido */}
                    <Stack direction="row" spacing={1.5} sx={{ width: "100%" }}>
                      <Avatar
                        sx={{
                          bgcolor: getColorImportancia(
                            notificacion.importancia
                          ),
                          width: 36,
                          height: 36,
                          fontSize: "20px",
                          flexShrink: 0,
                        }}
                      >
                        {getIconoTipo(notificacion.tipo)}
                      </Avatar>

                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: notificacion.estado_leida
                              ? "normal"
                              : "bold",
                            color: notificacion.estado_leida ? "#666" : "#000",
                            mb: 0.5,
                            wordWrap: "break-word",
                            overflowWrap: "break-word",
                            whiteSpace: "normal",
                          }}
                        >
                          {notificacion.descripcion}
                        </Typography>

                        <Stack
                          direction="row"
                          spacing={0.5}
                          alignItems="center"
                        >
                          <Typography variant="caption" color="textSecondary">
                            {new Date(
                              notificacion.fecha_evento
                            ).toLocaleDateString("es-ES", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </Typography>
                          {notificacion.responsable && (
                            <>
                              <Typography
                                variant="caption"
                                color="textSecondary"
                              >
                                •
                              </Typography>
                              <Typography variant="caption" color="primary">
                                {notificacion.responsable}
                              </Typography>
                            </>
                          )}
                        </Stack>
                      </Box>

                      {/* Estado de lectura */}
                      {!notificacion.estado_leida && (
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: "#ff6b6b",
                            flexShrink: 0,
                            mt: 1,
                          }}
                        />
                      )}
                    </Stack>
                  </ListItemButton>
                </ListItem>
                {index < notificacionesFiltradas.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        )}

        {/* Pie de página */}
        {notificacionesFiltradas.length > 0 && (
          <Box
            sx={{ p: 1.5, borderTop: "1px solid #e0e0e0", textAlign: "center" }}
          >
            <Button
              size="small"
              sx={{ textTransform: "none", color: "#4dabf7" }}
              onClick={() => {
                handleClose();
                // Aquí podrías navegar a una página de historial de notificaciones
              }}
            >
              Ver todas las notificaciones
            </Button>
          </Box>
        )}
      </Menu>

      {/* Estilo de animación pulse */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </>
  );
};

export default NotificationPanel;
