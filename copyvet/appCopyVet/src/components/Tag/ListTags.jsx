import { useEffect, useState } from "react";
import TagService from "../../services/TagService";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";

export default function ListTags() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    TagService.list()
      .then((r) => setItems(Array.isArray(r.data) ? r.data : []))
      .catch((err) => {
        console.error("Error fetching tags:", err);
        setItems([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const getTagColor = (nombre) => {
    const tag = nombre?.toLowerCase();
    if (tag?.includes("urgente") || tag?.includes("emergencia")) return "error";
    if (tag?.includes("preventivo")) return "success";
    if (tag?.includes("tratamiento")) return "warning";
    if (tag?.includes("seguimiento")) return "info";
    return "primary";
  };

  const getTagEmoji = (nombre) => {
    const tag = nombre?.toLowerCase();
    if (tag?.includes("urgente") || tag?.includes("emergencia")) return "🚨";
    if (tag?.includes("preventivo")) return "🛡️";
    if (tag?.includes("tratamiento")) return "💊";
    if (tag?.includes("seguimiento")) return "📋";
    if (tag?.includes("programable")) return "📅";
    return "🏷️";
  };

  return (
    <Container sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        🏷️ Etiquetas
      </Typography>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        {items.map((tag) => (
          <Grid item xs={12} sm={6} md={4} key={tag.id_etiqueta}>
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
                to={`/tag/${tag.id_etiqueta}`}
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
                      {getTagEmoji(tag.nombre_etiqueta)}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {tag.nombre_etiqueta}
                    </Typography>
                  </Box>

                  <Chip
                    label={tag.nombre_etiqueta}
                    color={getTagColor(tag.nombre_etiqueta)}
                    sx={{ width: "100%" }}
                  />
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {items.length === 0 && !loading && (
        <Typography variant="body1" sx={{ mt: 3, textAlign: "center" }}>
          No hay etiquetas disponibles
        </Typography>
      )}
    </Container>
  );
}
