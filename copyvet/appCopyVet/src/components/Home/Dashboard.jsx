import { useEffect, useState, useContext } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import CopyVetService from "../../services/CopyVetService";
import VeterinarioService from "../../services/VeterinarioService";
import CategoryService from "../../services/CategoryService";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

export default function Dashboard() {
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
        {isCliente ? "Crear un tiquete" : "Dashboard de tiquetes"}
      </Typography>

      <Typography
        variant="h6"
        align="center"
        color="text.secondary"
        gutterBottom
      >
        {isCliente
          ? "Rellena el formulario para crear un nuevo tiquete"
          : "Administración y monitoreo de tiquetes"}
      </Typography>

      {loading && (
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            Cargando información...
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
                  <Paper sx={{ p: 2, textAlign: "center" }} elevation={2}>
                    <Typography variant="subtitle1">Usuarios</Typography>
                    <Typography variant="h4">{counts.users}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2, textAlign: "center" }} elevation={2}>
                    <Typography variant="subtitle1">Tickets</Typography>
                    <Typography variant="h4">{counts.tickets}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2, textAlign: "center" }} elevation={2}>
                    <Typography variant="subtitle1">Mascotas</Typography>
                    <Typography variant="h4">{counts.mascotas}</Typography>
                  </Paper>
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
                        Crear un tiquete
                      </Typography>
                      <Typography
                        variant="caption"
                        display="block"
                        sx={{ mb: 2 }}
                      >
                        Rellena los campos para crear un nuevo tiquete
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        select
                        label="Mascota"
                        fullWidth
                        value={quick.id_mascota}
                        onChange={(e) =>
                          handleQuickChange("id_mascota", e.target.value)
                        }
                      >
                        <MenuItem value="">-- Seleccionar --</MenuItem>
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
                        label="Raza"
                        fullWidth
                        value={quick.raza}
                        onChange={(e) =>
                          handleQuickChange("raza", e.target.value)
                        }
                      >
                        <MenuItem value="">-- Todas las razas --</MenuItem>
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
                        label="Categoría"
                        fullWidth
                        value={quick.id_categoria}
                        onChange={(e) =>
                          handleQuickChange("id_categoria", e.target.value)
                        }
                      >
                        <MenuItem value="">-- Seleccionar --</MenuItem>
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
                        label="Veterinario"
                        fullWidth
                        value={quick.id_asignado_a_usuario}
                        onChange={(e) =>
                          handleQuickChange(
                            "id_asignado_a_usuario",
                            e.target.value
                          )
                        }
                      >
                        <MenuItem value="">-- Ninguno --</MenuItem>
                        {vets.map((v) => (
                          <MenuItem
                            key={v.id_veterinario || v.id}
                            value={v.id_veterinario || v.id}
                          >
                            {v.nombre_veterinario || v.nombre_completo}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        label="Detalle (opcional)"
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
                        Crear Ticket
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            )}

            {/* Panel de veterinarios - solo visible para administradores y veterinarios */}
            {!isCliente && (
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Veterinarios disponibles
                  </Typography>
                  <Grid container spacing={2}>
                    {vets.slice(0, 6).map((v) => (
                      <Grid item xs={12} sm={6} key={v.id_veterinario || v.id}>
                        <Box sx={{ p: 1 }}>
                          <Typography variant="subtitle2">
                            {v.nombre_veterinario || v.nombre_completo}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {v.correo || "-"} • {v.telefono || "-"} • Activos:{" "}
                            {v.tickets_activos ?? "-"}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Grid>
            )}
          </Grid>
        </Box>
      )}
    </Container>
  );
}
