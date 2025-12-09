import { useEffect, useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  TextField,
  MenuItem,
  Card,
  CardContent,
  Avatar,
  Stack,
  Alert,
  CircularProgress,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import PetsIcon from "@mui/icons-material/Pets";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import CopyVetService from "../../services/CopyVetService";
import VeterinarioService from "../../services/VeterinarioService";
import CategoryService from "../../services/CategoryService";
import DashboardService from "../../services/DashboardService";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import SlaEstadisticasCards from "../Dashboard/SlaEstadisticasCards";
import TicketsPorEstadoChart from "../Dashboard/TicketsPorEstadoChart";
import TicketsPorCategoriaChart from "../Dashboard/TicketsPorCategoriaChart";
import TopVeterinariosPanel from "../Dashboard/TopVeterinariosPanel";
import AlertasUrgentes from "../Dashboard/AlertasUrgentes";

export default function Dashboard() {
  const { t } = useTranslation();
  const { decodeToken, autorize } = useContext(UserContext);
  const userData = decodeToken() || {};
  const isGmailUser = userData.correo?.endsWith("@gmail.com") || false;
  const isCliente =
    isGmailUser || autorize?.({ requiredRoles: ["Cliente"] }) || false;

  const [counts, setCounts] = useState({ users: 0, tickets: 0, mascotas: 0 });
  const [vets, setVets] = useState([]);
  const [cats, setCats] = useState([]);
  const [mascotas, setMascotas] = useState([]);
  const [breedList, setBreedList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dashboard statistics state
  const [estadisticas, setEstadisticas] = useState(null);
  const [estadisticasError, setEstadisticasError] = useState(null);

  const [quick, setQuick] = useState({
    id_mascota: "",
    raza: "",
    id_categoria: "",
    id_asignado_a_usuario: "",
    detalle: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([
      isCliente ? null : CopyVetService.getUsers().catch(() => ({ data: [] })),
      isCliente
        ? null
        : CopyVetService.getTickets().catch(() => ({ data: [] })),
      CopyVetService.getMascotas().catch(() => ({ data: [] })),
      VeterinarioService.list().catch(() => ({ data: [] })),
      CategoryService.list().catch(() => ({ data: [] })),
    ])
      .then(([usersRes, ticketsRes, mascotasRes, vetsRes, catsRes]) => {
        if (!mounted) return;
        const users = Array.isArray(usersRes?.data) ? usersRes.data.length : 0;
        const tickets = Array.isArray(ticketsRes?.data)
          ? ticketsRes.data.length
          : 0;
        const mascotasCount = Array.isArray(mascotasRes?.data)
          ? mascotasRes.data.length
          : 0;
        setCounts({ users, tickets, mascotas: mascotasCount });
        setVets(Array.isArray(vetsRes?.data) ? vetsRes.data : []);
        setCats(Array.isArray(catsRes?.data) ? catsRes.data : []);
        const mascs = Array.isArray(mascotasRes?.data) ? mascotasRes.data : [];
        setMascotas(mascs);
        // build breed list
        const breeds = Array.from(
          new Set(mascs.map((m) => m.raza).filter(Boolean))
        );
        setBreedList(breeds);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => (mounted = false);
  }, [isCliente]);

  // Load dashboard statistics for admin and veterinarians
  useEffect(() => {
    if (isCliente) return;

    let mounted = true;
    DashboardService.getEstadisticas()
      .then((response) => {
        if (!mounted) return;

        if (response.data?.success) {
          setEstadisticas(response.data.data);
        } else if (response.data) {
          // Si la respuesta tiene datos pero no tiene el campo 'success', asumir que son las estadísticas directamente
          setEstadisticas(response.data);
        } else {
          console.error("Formato de respuesta inesperado:", response);
          setEstadisticasError("Error al cargar estadísticas del dashboard");
        }
      })
      .catch((error) => {
        if (!mounted) return;
        console.error("Error loading dashboard statistics:", error);
        setEstadisticasError(
          `Error al conectar con el servidor: ${error.message}`
        );
      });

    return () => (mounted = false);
  }, [isCliente]);

  const handleQuickChange = (field, value) =>
    setQuick((s) => ({ ...s, [field]: value }));

  const handleQuickCreate = () => {
    // Navigate to create page with query params to prefill form
    const params = new URLSearchParams();
    if (quick.id_mascota) params.set("id_mascota", quick.id_mascota);
    if (quick.raza) params.set("raza", quick.raza);
    if (quick.id_categoria) params.set("id_categoria", quick.id_categoria);
    if (quick.id_asignado_a_usuario)
      params.set("id_asignado_a_usuario", quick.id_asignado_a_usuario);
    if (quick.detalle) params.set("descripcion", quick.detalle);
    navigate(`/ticket/create?${params.toString()}`);
  };

  return (
    <Container sx={{ p: 2 }} maxWidth="md">
      <Typography
        component="h1"
        variant="h3"
        align="center"
        color="text.primary"
        gutterBottom
      >
        {isCliente
          ? t("common:dashboard.title.client")
          : t("common:dashboard.title.admin")}
      </Typography>

      <Typography
        variant="h6"
        align="center"
        color="text.secondary"
        gutterBottom
      >
        {isCliente
          ? t("common:dashboard.subtitle.client")
          : t("common:dashboard.subtitle.admin")}
      </Typography>

      {loading && (
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            {t("common:dashboard.loading")}
          </Typography>
        </Box>
      )}

      {!loading && (
        <Box sx={{ mt: 4 }}>
          <Grid container spacing={2}>
            {/* Panel de métricas - solo visible para administradores y veterinarios */}
            {!isCliente && (
              <>
                <Grid item xs={12} md={4}>
                  <Card elevation={3} sx={{ height: "100%" }}>
                    <CardContent>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                          sx={{
                            bgcolor: "primary.main",
                            width: 56,
                            height: 56,
                          }}
                        >
                          <PeopleIcon fontSize="large" />
                        </Avatar>
                        <Box>
                          <Typography color="text.secondary" variant="body2">
                            {t("common:dashboard.metrics.users")}
                          </Typography>
                          <Typography variant="h4" fontWeight="bold">
                            {counts.users}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card elevation={3} sx={{ height: "100%" }}>
                    <CardContent>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                          sx={{
                            bgcolor: "success.main",
                            width: 56,
                            height: 56,
                          }}
                        >
                          <ConfirmationNumberIcon fontSize="large" />
                        </Avatar>
                        <Box>
                          <Typography color="text.secondary" variant="body2">
                            {t("common:dashboard.metrics.tickets")}
                          </Typography>
                          <Typography variant="h4" fontWeight="bold">
                            {counts.tickets}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card elevation={3} sx={{ height: "100%" }}>
                    <CardContent>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                          sx={{
                            bgcolor: "warning.main",
                            width: 56,
                            height: 56,
                          }}
                        >
                          <PetsIcon fontSize="large" />
                        </Avatar>
                        <Box>
                          <Typography color="text.secondary" variant="body2">
                            {t("common:dashboard.metrics.pets")}
                          </Typography>
                          <Typography variant="h4" fontWeight="bold">
                            {counts.mascotas}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              </>
            )}

            {/* Panel de creación rápida - solo visible para clientes */}
            {isCliente && (
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Grid container spacing={1} alignItems="center">
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom>
                        {t("common:dashboard.quickCreate.title")}
                      </Typography>
                      <Typography
                        variant="caption"
                        display="block"
                        sx={{ mb: 2 }}
                      >
                        {t("common:dashboard.quickCreate.subtitle")}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        select
                        label={t("common:dashboard.quickCreate.fields.pet")}
                        fullWidth
                        value={quick.id_mascota}
                        onChange={(e) =>
                          handleQuickChange("id_mascota", e.target.value)
                        }
                      >
                        <MenuItem value="">
                          {t("common:dashboard.quickCreate.select")}
                        </MenuItem>
                        {mascotas.map((m) => (
                          <MenuItem key={m.id_mascota} value={m.id_mascota}>
                            {m.nombre} {m.raza ? `• ${m.raza}` : ""}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        select
                        label={t("common:dashboard.quickCreate.fields.breed")}
                        fullWidth
                        value={quick.raza}
                        onChange={(e) =>
                          handleQuickChange("raza", e.target.value)
                        }
                      >
                        <MenuItem value="">
                          {t("common:dashboard.quickCreate.allBreeds")}
                        </MenuItem>
                        {breedList.map((r) => (
                          <MenuItem key={r} value={r}>
                            {r}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        select
                        label={t(
                          "common:dashboard.quickCreate.fields.category"
                        )}
                        fullWidth
                        value={quick.id_categoria}
                        onChange={(e) =>
                          handleQuickChange("id_categoria", e.target.value)
                        }
                      >
                        <MenuItem value="">
                          {t("common:dashboard.quickCreate.select")}
                        </MenuItem>
                        {cats.map((c) => (
                          <MenuItem key={c.id_categoria} value={c.id_categoria}>
                            {c.nombre_categoria}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        select
                        label={t(
                          "common:dashboard.quickCreate.fields.veterinarian"
                        )}
                        fullWidth
                        value={quick.id_asignado_a_usuario}
                        onChange={(e) =>
                          handleQuickChange(
                            "id_asignado_a_usuario",
                            e.target.value
                          )
                        }
                      >
                        <MenuItem value="">
                          {t("common:dashboard.quickCreate.none")}
                        </MenuItem>
                        {vets.map((v) => (
                          <MenuItem
                            key={v.id_veterinario || v.id}
                            value={v.id_veterinario || v.id}
                          >
                            {v.nombre_completo}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        label={t("common:dashboard.quickCreate.fields.detail")}
                        fullWidth
                        multiline
                        rows={2}
                        value={quick.detalle}
                        onChange={(e) =>
                          handleQuickChange("detalle", e.target.value)
                        }
                      />
                    </Grid>

                    <Grid item xs={12} sx={{ textAlign: "right" }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleQuickCreate}
                      >
                        {t("common:dashboard.quickCreate.button")}
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            )}

            {/* Panel de veterinarios - solo visible para administradores y veterinarios */}
            {!isCliente && (
              <Grid item xs={12}>
                <Card elevation={3}>
                  <CardContent>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <LocalHospitalIcon color="primary" />
                      {t("common:dashboard.veterinarians.title")}
                    </Typography>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      {vets.slice(0, 6).map((v) => (
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={4}
                          key={v.id_veterinario || v.id}
                        >
                          <Paper
                            elevation={1}
                            sx={{
                              p: 2,
                              transition: "all 0.2s",
                              "&:hover": {
                                elevation: 3,
                                transform: "translateY(-2px)",
                              },
                            }}
                          >
                            <Stack spacing={1}>
                              <Typography variant="subtitle1" fontWeight="bold">
                                {v.nombre_completo}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {v.email || "-"}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                📞 {v.telefono || "-"}
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  fontWeight="bold"
                                  color="primary.main"
                                >
                                  {t("common:dashboard.veterinarians.active")}:
                                </Typography>
                                <Typography variant="caption">
                                  {v.tickets_activos ?? 0}
                                </Typography>
                              </Box>
                            </Stack>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Dashboard Statistics - solo visible para administradores y veterinarios */}
            {!isCliente && (
              <>
                {estadisticasError && (
                  <Grid item xs={12}>
                    <Alert severity="error">{estadisticasError}</Alert>
                  </Grid>
                )}

                {!estadisticasError && !estadisticas && (
                  <Grid item xs={12}>
                    <Box
                      sx={{ display: "flex", justifyContent: "center", p: 4 }}
                    >
                      <CircularProgress />
                    </Box>
                  </Grid>
                )}

                {estadisticas && (
                  <>
                    {/* SLA Statistics Cards */}
                    {estadisticas.estadisticas_sla && (
                      <Grid item xs={12}>
                        <SlaEstadisticasCards
                          data={estadisticas.estadisticas_sla}
                        />
                      </Grid>
                    )}

                    {/* Charts Section */}
                    <Grid item xs={12} md={6}>
                      {estadisticas.tickets_por_estado &&
                        estadisticas.tickets_por_estado.length > 0 && (
                          <TicketsPorEstadoChart
                            data={estadisticas.tickets_por_estado}
                          />
                        )}
                    </Grid>

                    <Grid item xs={12} md={6}>
                      {estadisticas.tickets_por_categoria &&
                        estadisticas.tickets_por_categoria.length > 0 && (
                          <TicketsPorCategoriaChart
                            data={estadisticas.tickets_por_categoria}
                          />
                        )}
                    </Grid>

                    {/* Top Veterinarios Panel */}
                    {estadisticas.top_veterinarios &&
                      estadisticas.top_veterinarios.length > 0 && (
                        <Grid item xs={12} md={6}>
                          <TopVeterinariosPanel
                            data={estadisticas.top_veterinarios}
                          />
                        </Grid>
                      )}

                    {/* Urgent Alerts Panel */}
                    <Grid item xs={12} md={6}>
                      <AlertasUrgentes
                        ticketsUrgentes={estadisticas.tickets_urgentes || []}
                        ticketsProximos={
                          estadisticas.tickets_proximos_vencer || []
                        }
                      />
                    </Grid>
                  </>
                )}
              </>
            )}
          </Grid>
        </Box>
      )}
    </Container>
  );
}
