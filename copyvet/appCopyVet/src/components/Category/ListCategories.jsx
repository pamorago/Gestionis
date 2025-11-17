import { useEffect, useState } from "react";
import CategoryService from "../../services/CategoryService";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  Box,
  Stack,
} from "@mui/material";
import { Link } from "react-router-dom";

export default function ListCategories() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    CategoryService.list()
      .then((r) => setItems(Array.isArray(r.data) ? r.data : []))
      .catch((err) => {
        console.error("Error fetching categories:", err);
        setItems([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Obtener emoji según categoría
  const getCategoryEmoji = (categoria) => {
    const cat = categoria?.toLowerCase();
    if (cat?.includes("vacun")) return "💉";
    if (cat?.includes("cirugía")) return "🏥";
    if (cat?.includes("desparasit")) return "💊";
    if (cat?.includes("consulta")) return "🩺";
    if (cat?.includes("emergencia")) return "🚨";
    if (cat?.includes("exótica")) return "🦎";
    if (cat?.includes("dermatolog")) return "🐕";
    if (cat?.includes("traumatolog")) return "🦴";
    if (cat?.includes("control")) return "📋";
    return "🏥";
  };

  // Obtener color de etiqueta
  const getTagColor = (etiqueta) => {
    const tag = etiqueta?.toLowerCase();
    if (tag?.includes("urgente") || tag?.includes("emergencia")) return "error";
    if (tag?.includes("preventivo")) return "success";
    if (tag?.includes("tratamiento")) return "warning";
    if (tag?.includes("seguimiento")) return "info";
    return "primary";
  };

  // Convertir minutos a formato legible
  const formatTime = (minutes) => {
    if (!minutes) return "N/A";
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  return (
    <Container sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        📁 Categorías de Servicio
      </Typography>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        {items.map((c) => (
          <Grid item xs={12} sm={6} md={4} key={c.id_categoria}>
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
                to={`/category/${c.id_categoria}`}
                sx={{ height: "100%" }}
              >
                <CardContent>
                  {/* Emoji y nombre */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <Typography variant="h3">
                      {getCategoryEmoji(c.nombre_categoria)}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {c.nombre_categoria}
                    </Typography>
                  </Box>

                  {/* Etiquetas reales desde el backend */}
                  {c.etiquetas && c.etiquetas.length > 0 && (
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ mb: 2, flexWrap: "wrap", gap: 0.5 }}
                    >
                      {c.etiquetas.map((etiqueta) => (
                        <Chip
                          key={etiqueta.id_etiqueta}
                          label={etiqueta.nombre_etiqueta}
                          size="small"
                          color={getTagColor(etiqueta.nombre_etiqueta)}
                          variant="outlined"
                        />
                      ))}
                    </Stack>
                  )}

                  {/* SLA Info */}
                  <Box
                    sx={{
                      p: 1.5,
                      bgcolor: "grey.100",
                      borderRadius: 1,
                      borderLeft: 4,
                      borderLeftColor:
                        c.sla_descripcion?.toLowerCase() === "urgente"
                          ? "error.main"
                          : "primary.main",
                    }}
                  >
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      color="text.primary"
                    >
                      {c.sla_descripcion || "Sin SLA"}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      ⏱️ Respuesta: {formatTime(c.tiempo_minutos)}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      ✅ Resolución: {formatTime(c.tiempo_resolucion)}
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {loading && (
        <Typography sx={{ p: 2, textAlign: "center" }}>
          Cargando categorías...
        </Typography>
      )}
      {!loading && items.length === 0 && (
        <Typography sx={{ p: 2, textAlign: "center" }}>
          No hay categorías disponibles.
        </Typography>
      )}
    </Container>
  );
}
