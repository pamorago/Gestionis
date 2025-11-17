import { useEffect, useState } from "react";
import SpecialtyService from "../../services/SpecialtyService";
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

export default function ListSpecialties() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    SpecialtyService.list()
      .then((r) => setItems(Array.isArray(r.data) ? r.data : []))
      .catch((err) => {
        console.error("Error fetching specialties:", err);
        setItems([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const getSpecialtyEmoji = (nombre) => {
    const spec = nombre?.toLowerCase();
    if (spec?.includes("cirugía")) return "🏥";
    if (spec?.includes("medicina")) return "💊";
    if (spec?.includes("dermatolog")) return "🐕";
    if (spec?.includes("traumatolog")) return "🦴";
    if (spec?.includes("exótica")) return "🦎";
    if (spec?.includes("oncolog")) return "🎗️";
    if (spec?.includes("cardiolog")) return "❤️";
    return "⚕️";
  };

  const getSpecialtyColor = (nombre) => {
    const spec = nombre?.toLowerCase();
    if (spec?.includes("cirugía")) return "error";
    if (spec?.includes("medicina")) return "primary";
    if (spec?.includes("dermatolog")) return "success";
    if (spec?.includes("traumatolog")) return "warning";
    if (spec?.includes("exótica")) return "secondary";
    if (spec?.includes("oncolog")) return "info";
    if (spec?.includes("cardiolog")) return "error";
    return "default";
  };

  return (
    <Container sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        ⚕️ Especialidades Veterinarias
      </Typography>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        {items.map((specialty) => (
          <Grid item xs={12} sm={6} md={4} key={specialty.id_especialidad}>
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
                to={`/specialty/${specialty.id_especialidad}`}
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
                      {getSpecialtyEmoji(specialty.nombre_especialidad)}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {specialty.nombre_especialidad}
                    </Typography>
                  </Box>

                  <Chip
                    label={specialty.nombre_especialidad}
                    color={getSpecialtyColor(specialty.nombre_especialidad)}
                    variant="outlined"
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
          No hay especialidades disponibles
        </Typography>
      )}
    </Container>
  );
}
