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

  // Etiquetas según categoría (Tipo de servicio + Urgencia)
  const getServiceTags = (categoria) => {
    const cat = categoria?.toLowerCase();
    if (cat?.includes("vacun")) return ["Preventivo", "Programable"];
    if (cat?.includes("cirugía mayor")) return ["Quirúrgico", "Urgente"];
    if (cat?.includes("cirugía menor")) return ["Quirúrgico", "Programable"];
    if (cat?.includes("desparasit")) return ["Preventivo", "Programable"];
    if (cat?.includes("consulta")) return ["Diagnóstico", "Programable"];
    if (cat?.includes("emergencia")) return ["Urgente", "Inmediato"];
    if (cat?.includes("exótica")) return ["Especializado", "Programable"];
    if (cat?.includes("dermatolog")) return ["Especializado", "Programable"];
    if (cat?.includes("traumatolog")) return ["Especializado", "Urgente"];
    if (cat?.includes("control")) return ["Preventivo", "Programable"];
    return ["General", "Programable"];
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

                  {/* Etiquetas */}
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ mb: 2, flexWrap: "wrap", gap: 0.5 }}
                  >
                    {getServiceTags(c.nombre_categoria).map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        size="small"
                        color={
                          tag.includes("Urgente") || tag.includes("Inmediato")
                            ? "error"
                            : tag.includes("Especializado")
                              ? "secondary"
                              : "primary"
                        }
                        variant="outlined"
                      />
                    ))}
                  </Stack>

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
