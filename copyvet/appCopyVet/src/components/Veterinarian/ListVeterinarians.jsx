import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import VeterinarioService from "../../services/VeterinarioService";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Box,
  Chip,
  Stack,
} from "@mui/material";
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  Assignment as AssignmentIcon,
  AccessTime as AccessTimeIcon,
} from "@mui/icons-material";

export default function ListVeterinarians() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    VeterinarioService.list()
      .then((r) => setItems(Array.isArray(r.data) ? r.data : []))
      .catch((err) => {
        console.error("Error fetching veterinarios:", err);
        setItems([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Calcular tiempo disponible en horas (ya viene calculado desde el backend)
  const calcularTiempoDisponible = (cargaActual, cargaMaxima) => {
    const actual = parseInt(cargaActual || 0);
    const maxima = parseInt(cargaMaxima || 24);
    const disponible = maxima - actual;
    return {
      disponible: Math.max(0, disponible),
      comprometidas: actual,
      total: maxima,
    };
  };

  // Obtener color según disponibilidad
  const getDisponibilidadColor = (disponible, total) => {
    const porcentaje = (disponible / total) * 100;
    if (porcentaje > 60) return "success";
    if (porcentaje > 30) return "warning";
    return "error";
  };

  return (
    <Container sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        🩺 Veterinarios
      </Typography>

      {loading && (
        <Typography sx={{ p: 2 }}>Cargando veterinarios...</Typography>
      )}

      {!loading && items.length === 0 && (
        <Typography sx={{ p: 2 }}>No hay veterinarios disponibles.</Typography>
      )}

      <Grid container spacing={3}>
        {items.map((v) => {
          const tiempo = calcularTiempoDisponible(
            v.carga_actual,
            v.carga_maxima
          );
          const disponibilidadColor = getDisponibilidadColor(
            tiempo.disponible,
            tiempo.total
          );

          return (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={v.id_veterinario || v.id_usuario || v.id}
            >
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
                  to={`/veterinarian/${v.id_veterinario || v.id}`}
                  sx={{ height: "100%", textDecoration: "none" }}
                >
                  <CardContent>
                    {/* Nombre */}
                    <Typography variant="h6" gutterBottom>
                      {v.nombre_veterinario || v.nombre_completo || v.nombre}
                    </Typography>

                    {/* Especialidad */}
                    <Chip
                      label={Array.isArray(v.especialidades) && v.especialidades.length > 0 ? v.especialidades.join(", ") : "Sin especialidad"}
                      color="primary"
                      size="small"
                      sx={{ mb: 2 }}
                    />

                    {/* Contacto */}
                    <Stack spacing={1} sx={{ mb: 2 }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <EmailIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {v.email || "N/A"}
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <PhoneIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {v.telefono || "N/A"}
                        </Typography>
                      </Box>
                    </Stack>

                    {/* Tickets Activos */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <AssignmentIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        <strong>Tickets Activos:</strong>{" "}
                        {v.tickets_activos || 0}
                      </Typography>
                    </Box>

                    {/* Tiempo Disponible */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        p: 1.5,
                        bgcolor: "background.default",
                        borderRadius: 1,
                        borderLeft: 4,
                        borderColor: `${disponibilidadColor}.main`,
                      }}
                    >
                      <AccessTimeIcon fontSize="small" color="action" />
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          Disponible: {tiempo.disponible}h / {tiempo.total}h
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {tiempo.comprometidas}h comprometidas
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
}
