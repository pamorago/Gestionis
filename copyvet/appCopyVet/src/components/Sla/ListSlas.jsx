import { useEffect, useState } from "react";
import SlaService from "../../services/SlaService";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Box,
  Chip,
  Stack,
} from "@mui/material";
import { Link } from "react-router-dom";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function ListSlas() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    SlaService.list()
      .then((r) => setItems(Array.isArray(r.data) ? r.data : []))
      .catch((err) => {
        console.error("Error fetching SLAs:", err);
        setItems([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const formatTime = (minutes) => {
    if (!minutes) return "N/A";
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  const getSlaColor = (descripcion) => {
    const desc = descripcion?.toLowerCase();
    if (desc?.includes("urgente")) return "error";
    if (desc?.includes("alta")) return "warning";
    if (desc?.includes("normal")) return "primary";
    if (desc?.includes("baja")) return "success";
    return "default";
  };

  const getSlaEmoji = (descripcion) => {
    const desc = descripcion?.toLowerCase();
    if (desc?.includes("urgente")) return "🚨";
    if (desc?.includes("alta")) return "⚡";
    if (desc?.includes("normal")) return "📋";
    if (desc?.includes("baja")) return "🕐";
    return "⏱️";
  };

  return (
    <Container sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        ⏱️ Niveles de Servicio (SLA)
      </Typography>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        {items.map((sla) => (
          <Grid item xs={12} sm={6} md={4} key={sla.id_sla}>
            <Card
              elevation={3}
              sx={{
                height: "100%",
                transition: "all 0.3s",
                "&:hover": {
                  elevation: 8,
                  transform: "translateY(-4px)",
                },
              }}
            >
              <CardActionArea
                component={Link}
                to={`/sla/${sla.id_sla}`}
                sx={{ height: "100%" }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <Typography variant="h3">
                      {getSlaEmoji(sla.descripcion)}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {sla.descripcion}
                    </Typography>
                  </Box>

                  <Stack spacing={2}>
                    <Chip
                      label={sla.descripcion}
                      color={getSlaColor(sla.descripcion)}
                      sx={{ width: "100%" }}
                    />

                    <Box
                      sx={{
                        p: 1.5,
                        bgcolor: "grey.100",
                        borderRadius: 1,
                        borderLeft: 4,
                        borderLeftColor: `${getSlaColor(sla.descripcion)}.main`,
                      }}
                    >
                      <Stack spacing={1}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <AccessTimeIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            Tiempo respuesta:{" "}
                            <strong>{formatTime(sla.tiempo_minutos)}</strong>
                          </Typography>
                        </Box>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <CheckCircleIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            Tiempo resolución:{" "}
                            <strong>{formatTime(sla.tiempo_resolucion)}</strong>
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  </Stack>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {items.length === 0 && !loading && (
        <Typography variant="body1" sx={{ mt: 3, textAlign: "center" }}>
          No hay niveles de servicio disponibles
        </Typography>
      )}
    </Container>
  );
}
