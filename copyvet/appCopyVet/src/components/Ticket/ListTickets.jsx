import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import TicketService from "../../services/TicketService";
import { UserContext } from "../../context/UserContext";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActionArea,
  Grid,
  Chip,
} from "@mui/material";

export default function ListTickets() {
  const { decodeToken } = useContext(UserContext);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const userData = decodeToken() || {};
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Obtener el rol del usuario del token
  const getUserRole = () => {
    if (!userData) return "Administrador";

    // Intentar obtener el rol de diferentes formas
    if (typeof userData.rol === "string") return userData.rol;
    if (userData.rol && userData.rol.name) return userData.rol.name;
    if (userData.role) return userData.role;
    if (userData.nombre_rol) return userData.nombre_rol;

    return "Administrador";
  };

  // Obtener el ID del usuario del token
  const getUserId = () => {
    return userData?.id || userData?.id_usuario || userData?.sub || null;
  };

  const roleSel = getUserRole();
  const userId = getUserId();

  useEffect(() => {
    console.log("UserData:", userData);
    console.log("Role:", roleSel);
    console.log("UserID:", userId);

    setLoading(true);

    if (!userId) {
      // Sin usuario autenticado, mostrar todos los tickets
      TicketService.list()
        .then((r) => {
          console.log("Tickets recibidos:", r.data);
          setTickets(Array.isArray(r.data) ? r.data : []);
        })
        .catch((err) => {
          console.error("Error al cargar tickets:", err);
          setTickets([]);
        })
        .finally(() => {
          setLoading(false);
        });
      return;
    }

    // Llamar al endpoint getByRol con rol y userId
    TicketService.listByRole(roleSel, userId)
      .then((r) => {
        console.log("Tickets recibidos:", r.data);
        setTickets(Array.isArray(r.data) ? r.data : []);
      })
      .catch((err) => {
        console.error("Error al cargar tickets:", err);
        setTickets([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [roleSel, userData, userId]);

  // Función para obtener el color del chip según el estado
  const getStatusColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case "abierto":
        return "primary";
      case "en proceso":
        return "warning";
      case "cerrado":
        return "success";
      case "resuelto":
        return "success";
      default:
        return "default";
    }
  };

  return (
    <Container sx={{ p: 2 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Tickets
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Viendo tickets como: <strong>{roleSel}</strong>
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {tickets.map((t) => (
          <Grid item xs={12} sm={6} md={4} key={t.id_ticket}>
            <Card elevation={2}>
              <CardActionArea component={Link} to={`/ticket/${t.id_ticket}`}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "start",
                      mb: 1,
                    }}
                  >
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{ fontWeight: "bold" }}
                    >
                      #{t.id_ticket}
                    </Typography>
                    <Chip
                      label={t.nombre_estado || "Sin estado"}
                      color={getStatusColor(t.nombre_estado)}
                      size="small"
                    />
                  </Box>

                  <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                    {t.titulo}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {t.descripcion}
                  </Typography>

                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
                  >
                    {t.nombre_categoria && (
                      <Typography variant="caption" color="text.secondary">
                        📁 Categoría: <strong>{t.nombre_categoria}</strong>
                      </Typography>
                    )}
                    {t.mascota && (
                      <Typography variant="caption" color="text.secondary">
                        🐾 Mascota: <strong>{t.mascota}</strong>
                      </Typography>
                    )}
                    {t.cliente && (
                      <Typography variant="caption" color="text.secondary">
                        👤 Cliente: <strong>{t.cliente}</strong>
                      </Typography>
                    )}
                    {t.asignado_a && (
                      <Typography variant="caption" color="text.secondary">
                        👨‍⚕️ Asignado a: <strong>{t.asignado_a}</strong>
                      </Typography>
                    )}
                    {t.prioridad && (
                      <Typography variant="caption" color="text.secondary">
                        ⚡ Prioridad: <strong>{t.prioridad}</strong>
                      </Typography>
                    )}
                    {t.fecha_cita && (
                      <Typography variant="caption" color="text.secondary">
                        📅 Fecha cita:{" "}
                        <strong>
                          {new Date(t.fecha_cita).toLocaleDateString()}
                        </strong>
                      </Typography>
                    )}
                    {t.fecha_creacion && (
                      <Typography variant="caption" color="text.secondary">
                        🕐 Creado:{" "}
                        <strong>
                          {new Date(t.fecha_creacion).toLocaleDateString()}
                        </strong>
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {loading && (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            Cargando tickets...
          </Typography>
        </Box>
      )}

      {!loading && tickets.length === 0 && (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No se encontraron tickets para mostrar.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {userId
              ? `Rol: ${roleSel} | Usuario ID: ${userId}`
              : "No hay usuario autenticado"}
          </Typography>
        </Box>
      )}
    </Container>
  );
}
