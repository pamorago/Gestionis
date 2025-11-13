import { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TicketService from "../../services/TicketService";
import UserService from "../../services/UserService";
import CategoriaService from "../../services/CategoriaService";
import CopyVetService from "../../services/CopyVetService";
import { UserContext } from "../../context/UserContext";
import { useTranslation } from "react-i18next";
import {
  Container,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  Box,
  Alert,
} from "@mui/material";

export default function CreateTicket() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { decodeToken } = useContext(UserContext);
  const userData = decodeToken() || {};
  const userId = userData?.id_usuario || userData?.sub || userData?.id;

  const [vets, setVets] = useState([]);
  const [cats, setCats] = useState([]);
  const [mascotas, setMascotas] = useState([]);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    fecha_cita: "",
    id_categoria: "",
    id_mascota: "",
    id_asignado_a_usuario: "",
  });

  useEffect(() => {
    // Cargar datos necesarios para el formulario
    Promise.all([
      UserService.getUsers(),
      CategoriaService.list(),
      CopyVetService.getMascotas(),
    ])
      .then(([vetsRes, catsRes, mascsRes]) => {
        setVets(Array.isArray(vetsRes.data) ? vetsRes.data : []);
        setCats(Array.isArray(catsRes.data) ? catsRes.data : []);
        setMascotas(Array.isArray(mascsRes.data) ? mascsRes.data : []);
      })
      .catch((err) => {
        console.error("Error loading form data:", err);
        setError("Error cargando datos necesarios para el formulario");
      });
  }, []);

  // read query params to prefill form
  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pre = {};
    if (params.get("id_mascota")) pre.id_mascota = params.get("id_mascota");
    if (params.get("raza")) pre.raza = params.get("raza");
    if (params.get("id_categoria"))
      pre.id_categoria = params.get("id_categoria");
    if (params.get("id_asignado_a_usuario"))
      pre.id_asignado_a_usuario = params.get("id_asignado_a_usuario");
    if (params.get("descripcion")) pre.descripcion = params.get("descripcion");
    if (Object.keys(pre).length > 0) {
      setForm((f) => ({ ...f, ...pre }));
    }
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!userId) {
      setError(t("userNotAuthenticated"));
      return;
    }

    const payload = {
      titulo: form.titulo,
      descripcion: form.descripcion,
      fecha_cita: form.fecha_cita,
      id_estado: 1, // Asumimos 1 = Abierto
      id_categoria: Number(form.id_categoria),
      id_mascota: Number(form.id_mascota),
      id_creado_por_usuario: Number(userId),
      id_asignado_a_usuario: Number(form.id_asignado_a_usuario),
    };

    try {
      const res = await TicketService.create(payload);
      const newId = res.data?.id_ticket || res.data?.id;
      if (newId) {
        navigate(`/ticket/${newId}`);
      } else {
        navigate("/tickets");
      }
    } catch (err) {
      console.error("Error creando ticket:", err);
      setError(t("errorCreatingTicket"));
    }
  };

  return (
    <Container sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Crear Ticket
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Título"
          fullWidth
          required
          value={form.titulo}
          onChange={(e) => setForm({ ...form, titulo: e.target.value })}
          sx={{ mb: 2 }}
        />

        <TextField
          label="Descripción"
          fullWidth
          multiline
          rows={4}
          required
          value={form.descripcion}
          onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          sx={{ mb: 2 }}
        />

        <TextField
          label="Fecha cita"
          type="datetime-local"
          fullWidth
          required
          value={form.fecha_cita}
          onChange={(e) => setForm({ ...form, fecha_cita: e.target.value })}
          sx={{ mb: 2 }}
          InputLabelProps={{ shrink: true }}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Categoría</InputLabel>
          <Select
            value={form.id_categoria}
            label="Categoría"
            required
            onChange={(e) => setForm({ ...form, id_categoria: e.target.value })}
          >
            {cats.map((c) => (
              <MenuItem key={c.id_categoria} value={c.id_categoria}>
                {c.nombre_categoria}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Mascota</InputLabel>
          <Select
            value={form.id_mascota}
            label="Mascota"
            required
            onChange={(e) => setForm({ ...form, id_mascota: e.target.value })}
          >
            {mascotas.map((m) => (
              <MenuItem key={m.id_mascota} value={m.id_mascota}>
                {m.nombre} {m.raza ? `• ${m.raza}` : ""}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>{t("assignedVeterinarian")}</InputLabel>
          <Select
            value={form.id_asignado_a_usuario}
            label={t("assignedVeterinarian")}
            required
            onChange={(e) =>
              setForm({ ...form, id_asignado_a_usuario: e.target.value })
            }
          >
            <MenuItem value="">{t("selectVeterinarian")}</MenuItem>
            {vets.map((v) => (
              <MenuItem
                key={v.id_veterinario || v.id_usuario}
                value={v.id_veterinario || v.id_usuario}
              >
                {v.nombre_veterinario || v.nombre_completo}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
          >
            {t("createTicketButton")}
          </Button>
        </Box>
      </form>

      <Typography variant="caption" sx={{ mt: 2, display: "block" }}>
        {t("userCreatorId")}: {userId ?? t("notAuthenticated")}
      </Typography>
    </Container>
  );
}
