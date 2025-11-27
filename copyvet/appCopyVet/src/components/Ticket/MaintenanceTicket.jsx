import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  Snackbar,
  Grid,
  CircularProgress,
  Stack,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import TicketService from "../../services/TicketService";
import CategoryService from "../../services/CategoryService";
import UserService from "../../services/UserService";
import VeterinarioService from "../../services/VeterinarioService";
import MascotaService from "../../services/MascotaService";
import ImageService from "../../services/ImageService";
import { UserContext } from "../../context/UserContext";
import { useTranslation } from "react-i18next";

// eslint-disable-next-line react/prop-types
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`maintenance-tabpanel-${index}`}
      aria-labelledby={`maintenance-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function MaintenanceTicket() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  const userDecoded = userContext?.decodeToken() || {};
  const userRole = userDecoded?.rol || "Cliente";
  const userId = userDecoded?.id_usuario || userDecoded?.sub || userDecoded?.id;

  const [currentTab, setCurrentTab] = useState(0);
  const [catalogosLoaded, setCatalogosLoaded] = useState(false);

  // Estados para formulario de Crear
  const [createForm, setCreateForm] = useState({
    titulo: "",
    descripcion: "",
    id_categoria: "",
    id_mascota: "",
    fecha_cita: "",
    id_creado_por_usuario: "",
    id_asignado_a_usuario: "",
    nombre_solicitante: "",
    email_solicitante: "",
  });

  // Estados para formulario de Actualizar
  const [updateForm, setUpdateForm] = useState({
    id_ticket: "",
    titulo: "",
    descripcion: "",
    id_categoria: "",
    id_mascota: "",
    fecha_cita: "",
    id_estado: "",
    id_asignado_a_usuario: "",
    comentario: "",
  });

  // Estados para imágenes
  const [createImages, setCreateImages] = useState([]);
  const [updateImages, setUpdateImages] = useState([]);
  const [imagesPreviews, setImagesPreviews] = useState([]);
  const [updateImagesPreviews, setUpdateImagesPreviews] = useState([]);

  const [tickets, setTickets] = useState([]);
  const [estados, setEstados] = useState([]);
  const [loadingTicket, setLoadingTicket] = useState(false);

  // Estados para catálogos
  const [categorias, setCategorias] = useState([]);
  const [mascotas, setMascotas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [veterinariosDisponibles, setVeterinariosDisponibles] = useState([]);
  const [etiquetasDeCategoria, setEtiquetasDeCategoria] = useState([]);
  const [loadingCatalogos, setLoadingCatalogos] = useState(true);

  // Estados para notificaciones
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Estados para validación
  const [errors, setErrors] = useState({});

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    setErrors({});
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Función para cargar catálogos
  const cargarCatalogos = async () => {
    try {
      setLoadingCatalogos(true);

      // Cargar categorías
      const categoriasRes = await CategoryService.list();
      const categoriasArray = Array.isArray(categoriasRes.data)
        ? categoriasRes.data
        : [];
      setCategorias(categoriasArray);

      // Cargar mascotas
      const mascotasRes = await MascotaService.list();
      const mascotasArray = Array.isArray(mascotasRes.data)
        ? mascotasRes.data
        : [];
      setMascotas(mascotasArray);

      // Si es Cliente, cargar sus propios datos
      if (userRole === "Cliente") {
        const userRes = await UserService.getUserById(userId);
        const userData = userRes.data;

        setCreateForm((prev) => ({
          ...prev,
          id_creado_por_usuario: userId,
          nombre_solicitante: userData.nombre_completo || "",
          email_solicitante: userData.email || "",
        }));
      } else {
        // Si es Admin o Veterinario, cargar lista de clientes (solo rol Cliente id_rol = 4)
        const clientesRes = await UserService.getUsers();
        const allUsers = clientesRes.data;
        const soloClientes = Array.isArray(allUsers)
          ? allUsers.filter((user) => user.id_rol == 4)
          : [];
        setClientes(soloClientes);
        // No setear id_creado_por_usuario - debe quedar vacío hasta que el Admin/Vet seleccione
      }
    } catch (error) {
      console.error("Error al cargar catálogos:", error);
      showSnackbar("Error al cargar los catálogos", "error");
    } finally {
      // Esperar un tick de React para que procese los setState
      setTimeout(() => {
        setLoadingCatalogos(false);
      }, 0);
    }
  };

  // Cargar tickets para actualizar
  const cargarTickets = async () => {
    try {
      const res = await TicketService.list();
      const ticketsArray = Array.isArray(res.data) ? res.data : [];
      setTickets(ticketsArray);
    } catch (error) {
      showSnackbar("Error al cargar tickets", error);
    }
  };

  // Cargar estados
  const cargarEstados = async () => {
    try {
      // Asumiendo que existe un servicio para estados
      // Si no existe, puedes hardcodear los estados más comunes
      setEstados([
        { id_estado: 1, nombre_estado: "Pendiente" },
        { id_estado: 2, nombre_estado: "En Proceso" },
        { id_estado: 3, nombre_estado: "Resuelto" },
        { id_estado: 4, nombre_estado: "Cerrado" },
      ]);
    } catch (error) {
      showSnackbar("Error al cargar estados", error);
    }
  };

  // Cargar ticket por ID para editar
  const cargarTicketParaEditar = async (idTicket) => {
    try {
      setLoadingTicket(true);
      const res = await TicketService.get(idTicket);
      const ticket = res.data;

      setUpdateForm({
        id_ticket: ticket.id_ticket,
        titulo: ticket.titulo || "",
        descripcion: ticket.descripcion || "",
        id_categoria: ticket.id_categoria || "",
        id_mascota: ticket.id_mascota || "",
        fecha_cita: ticket.fecha_cita ? ticket.fecha_cita.split(" ")[0] : "",
        id_estado: ticket.id_estado || "",
        id_asignado_a_usuario: ticket.id_asignado_a_usuario || "",
        comentario: "",
      });

      // Cargar etiquetas de la categoría y esperar a que termine
      if (ticket.id_categoria) {
        await cargarEtiquetasDeCategoria(ticket.id_categoria);

        // Si el ticket tiene un veterinario asignado, asegurarse de que esté en la lista
        if (ticket.id_asignado_a_usuario) {
          setVeterinariosDisponibles((prev) => {
            // Verificar si el veterinario ya está en la lista
            const yaExiste = prev.some(
              (v) =>
                (v.id_veterinario || v.id_usuario) ==
                ticket.id_asignado_a_usuario
            );

            // Si ya existe, retornar la lista actual
            if (yaExiste) return prev;

            // Si no existe, agregarlo (con datos del ticket)
            const vetAsignado = {
              id_veterinario: ticket.id_asignado_a_usuario,
              nombre_completo: ticket.asignado_a || "Veterinario asignado",
              especialidades: [],
              carga_actual: 0,
            };

            return [...prev, vetAsignado];
          });
        }
      }
    } catch (error) {
      showSnackbar("Error al cargar el ticket", error);
    } finally {
      setLoadingTicket(false);
    }
  };

  useEffect(() => {
    // Solo cargar una vez cuando el userContext esté disponible Y el token esté decodificado
    const tokenDecodificado = userContext?.decodeToken();
    const tieneToken =
      tokenDecodificado && Object.keys(tokenDecodificado).length > 0;

    if (userContext && userRole && !catalogosLoaded && tieneToken) {
      cargarCatalogos();
      setCatalogosLoaded(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userContext, userRole, catalogosLoaded]);

  // Cargar tickets y estados cuando se abre la pestaña de actualizar
  useEffect(() => {
    if (currentTab === 1 && catalogosLoaded) {
      cargarTickets();
      cargarEstados();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTab, catalogosLoaded]);

  // Cargar etiquetas y veterinarios cuando se selecciona una categoría
  const cargarEtiquetasDeCategoria = async (idCategoria) => {
    try {
      const response = await CategoryService.getEtiquetas(idCategoria);
      const etiquetas = Array.isArray(response.data) ? response.data : [];
      setEtiquetasDeCategoria(etiquetas);

      // Cargar categoría completa para obtener especialidades
      const catResponse = await CategoryService.get(idCategoria);
      const categoria = catResponse.data;
      const especialidades = categoria.especialidades || [];

      // Si es Admin o Veterinario, filtrar veterinarios por especialidades
      if (userRole === "Administrador" || userRole === "Veterinario") {
        const vetResponse = await VeterinarioService.list();
        const todosVeterinarios = vetResponse.data;

        // Filtrar veterinarios que tengan al menos una especialidad de la categoría
        const especialidadNombres = especialidades.map((e) =>
          typeof e === "string" ? e : e.nombre_especialidad
        );

        const veterinariosFiltrados = todosVeterinarios.filter((vet) => {
          const vetEspecialidades = vet.especialidades || [];
          const vetEspNombres = vetEspecialidades.map((e) =>
            typeof e === "string" ? e : e.nombre_especialidad
          );
          return especialidadNombres.some((esp) => vetEspNombres.includes(esp));
        });

        setVeterinariosDisponibles(veterinariosFiltrados);
      }
    } catch (error) {
      console.error("Error al cargar etiquetas:", error);
      setEtiquetasDeCategoria([]);
      setVeterinariosDisponibles([]);
    }
  };

  // Validación del formulario
  const validateForm = (form) => {
    const newErrors = {};

    // Validar título
    if (!form.titulo || form.titulo.trim() === "") {
      newErrors.titulo = "El título es obligatorio";
    } else if (form.titulo.trim().length < 10) {
      newErrors.titulo = "El título debe tener al menos 10 caracteres";
    } else if (form.titulo.trim().length > 100) {
      newErrors.titulo = "El título no puede exceder 100 caracteres";
    }

    // Validar descripción
    if (!form.descripcion || form.descripcion.trim() === "") {
      newErrors.descripcion = "La descripción es obligatoria";
    }

    // Validar categoría
    if (!form.id_categoria) {
      newErrors.id_categoria = "Debe seleccionar una categoría";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejo de cambios en formulario Crear
  const handleCreateChange = (field, value) => {
    // Si cambia la categoría, cargar sus etiquetas y veterinarios, y resetear veterinario asignado
    if (field === "id_categoria") {
      setCreateForm({
        ...createForm,
        [field]: value,
        id_asignado_a_usuario: "",
      });
      if (value) {
        cargarEtiquetasDeCategoria(value);
      }
    } else {
      setCreateForm({ ...createForm, [field]: value });
    }

    // Si cambia el cliente seleccionado (Admin/Vet), actualizar datos
    if (field === "id_creado_por_usuario") {
      if (value) {
        cargarDatosCliente(value);
      } else {
        // Si se deselecciona, limpiar los campos pero mantenerlos como string vacío
        setCreateForm((prev) => ({
          ...prev,
          id_creado_por_usuario: "",
          nombre_solicitante: "",
          email_solicitante: "",
        }));
      }
    }

    // Limpiar error del campo
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  // Cargar datos del cliente seleccionado (para Admin/Vet)
  const cargarDatosCliente = async (idCliente) => {
    try {
      const userRes = await UserService.getUserById(idCliente);
      const userData = userRes.data;

      setCreateForm((prev) => ({
        ...prev,
        nombre_solicitante: userData.nombre_completo || "",
        email_solicitante: userData.email || "",
      }));
    } catch (error) {
      console.error("Error al cargar datos del cliente:", error);
    }
  };

  // Convertir fecha de formato local a MySQL
  const toMySQLDateTime = (dateString) => {
    if (!dateString) return null;
    // Si es solo fecha (YYYY-MM-DD), agregar hora por defecto
    if (dateString.length === 10) {
      return `${dateString} 09:00:00`;
    }
    // Si es datetime completo, convertir
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  // Manejar selección de imágenes para Crear
  const handleCreateImageChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length + createImages.length > 5) {
      showSnackbar("Máximo 5 imágenes permitidas", "warning");
      return;
    }

    setCreateImages((prev) => [...prev, ...files]);

    // Crear previews
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagesPreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Eliminar imagen de Crear
  const handleRemoveCreateImage = (index) => {
    setCreateImages((prev) => prev.filter((_, i) => i !== index));
    setImagesPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Manejar selección de imágenes para Actualizar
  const handleUpdateImageChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length + updateImages.length > 5) {
      showSnackbar("Máximo 5 imágenes permitidas", "warning");
      return;
    }

    setUpdateImages((prev) => [...prev, ...files]);

    // Crear previews
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUpdateImagesPreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Eliminar imagen de Actualizar
  const handleRemoveUpdateImage = (index) => {
    setUpdateImages((prev) => prev.filter((_, i) => i !== index));
    setUpdateImagesPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Subir imágenes al servidor
  const uploadImages = async (ticketId, images) => {
    try {
      for (const image of images) {
        const formData = new FormData();
        formData.append("ticket_id", ticketId);
        formData.append("file", image);
        await ImageService.createImage(formData);
      }
      return true;
    } catch (error) {
      console.error("Error al subir imágenes:", error);
      return false;
    }
  };

  // Crear ticket
  const handleCreate = async () => {
    if (!validateForm(createForm)) {
      showSnackbar("Por favor complete todos los campos obligatorios", "error");
      return;
    }

    try {
      // Determinar si es emergencia
      const esEmergencia = etiquetasDeCategoria.some((e) =>
        e.nombre_etiqueta.toLowerCase().includes("emergencia")
      );

      const ticketData = {
        titulo: createForm.titulo.trim(),
        descripcion: createForm.descripcion.trim(),
        id_categoria: createForm.id_categoria,
        id_mascota: createForm.id_mascota,
        id_creado_por_usuario: createForm.id_creado_por_usuario,
        id_asignado_a_usuario: createForm.id_asignado_a_usuario || null,
        fecha_creacion: toMySQLDateTime(new Date().toISOString()),
        fecha_cita: esEmergencia
          ? toMySQLDateTime(new Date().toISOString())
          : createForm.fecha_cita
            ? toMySQLDateTime(createForm.fecha_cita)
            : null,
        id_estado: 1, // Pendiente/Abierto
      };

      const response = await TicketService.create(ticketData);
      const ticketId = response.data.id;

      // Subir imágenes si hay
      if (createImages.length > 0) {
        const uploadSuccess = await uploadImages(ticketId, createImages);
        if (uploadSuccess) {
          showSnackbar("Ticket e imágenes creados exitosamente", "success");
        } else {
          showSnackbar(
            "Ticket creado pero hubo errores al subir algunas imágenes",
            "warning"
          );
        }
      } else {
        showSnackbar("Ticket creado exitosamente", "success");
      }

      // Redirigir a la lista de tickets
      setTimeout(() => {
        navigate("/tickets");
      }, 1500);
      setErrors({});
    } catch {
      showSnackbar("Error al crear el ticket", "error");
    }
  };

  // Manejar cambios en formulario de actualización
  const handleUpdateChange = (field, value) => {
    setUpdateForm({ ...updateForm, [field]: value });

    // Si cambia la categoría, recargar etiquetas y veterinarios
    if (field === "id_categoria" && value) {
      cargarEtiquetasDeCategoria(value);
    }

    // Limpiar error del campo
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  // Actualizar ticket
  const handleUpdate = async () => {
    if (!updateForm.id_ticket) {
      showSnackbar("Debe seleccionar un ticket para actualizar", "error");
      return;
    }

    if (!validateForm(updateForm)) {
      showSnackbar("Por favor complete todos los campos obligatorios", "error");
      return;
    }

    try {
      const ticketData = {
        titulo: updateForm.titulo.trim(),
        descripcion: updateForm.descripcion.trim(),
        id_categoria: updateForm.id_categoria,
        id_mascota: updateForm.id_mascota,
        fecha_cita: updateForm.fecha_cita
          ? toMySQLDateTime(updateForm.fecha_cita)
          : null,
        id_estado: updateForm.id_estado,
        id_asignado_a_usuario: updateForm.id_asignado_a_usuario || null,
        comentario: updateForm.comentario.trim() || null,
        id_usuario: userId, // Para el histórico
      };

      await TicketService.update(updateForm.id_ticket, ticketData);

      // Subir imágenes si hay
      if (updateImages.length > 0) {
        const uploadSuccess = await uploadImages(
          updateForm.id_ticket,
          updateImages
        );
        if (uploadSuccess) {
          showSnackbar(t("ticket:messages.ticketUpdatedSuccess"), "success");
        } else {
          showSnackbar(
            "Ticket actualizado pero hubo errores al subir algunas imágenes",
            "warning"
          );
        }
      } else {
        showSnackbar(t("ticket:messages.ticketUpdatedSuccess"), "success");
      }

      // Limpiar formulario y recargar lista
      setUpdateForm({
        id_ticket: "",
        titulo: "",
        descripcion: "",
        id_categoria: "",
        id_mascota: "",
        fecha_cita: "",
        id_estado: "",
        id_asignado_a_usuario: "",
        comentario: "",
      });
      setUpdateImages([]);
      setUpdateImagesPreviews([]);
      setEtiquetasDeCategoria([]);
      setVeterinariosDisponibles([]);
      setErrors({});

      // Recargar lista de tickets
      cargarTickets();
    } catch (error) {
      console.error("Error detallado al actualizar:", error);
      const mensajeError =
        error.response?.data?.message ||
        error.message ||
        "Error al actualizar el ticket";
      showSnackbar(mensajeError, "error");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t("ticket:maintenance.title")}
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: "divider", mt: 3 }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            aria-label={t("ticket:maintenance.title")}
          >
            <Tab
              label={t("ticket:maintenance.tabs.create")}
              id="maintenance-tab-0"
            />
            {userRole !== "Cliente" && (
              <Tab
                label={t("ticket:maintenance.tabs.update")}
                id="maintenance-tab-1"
              />
            )}
          </Tabs>
        </Box>

        <TabPanel value={currentTab} index={0}>
          <Typography variant="h5" gutterBottom>
            🎫 {t("ticket:maintenance.tabs.create")}{" "}
            {t("ticket:maintenance.ticketNoun")}
          </Typography>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {/* Título */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={`${t("ticket:title")} *`}
                value={createForm.titulo}
                onChange={(e) => handleCreateChange("titulo", e.target.value)}
                error={!!errors.titulo}
                helperText={
                  errors.titulo || t("ticket:maintenance.labels.titleHelper")
                }
                required
              />
            </Grid>

            {/* Descripción */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={`${t("ticket:description")} *`}
                multiline
                rows={4}
                value={createForm.descripcion}
                onChange={(e) =>
                  handleCreateChange("descripcion", e.target.value)
                }
                error={!!errors.descripcion}
                helperText={
                  errors.descripcion ||
                  t("ticket:maintenance.labels.descriptionHelper")
                }
                required
              />
            </Grid>

            {/* Categoría */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.id_categoria} required>
                <InputLabel>{t("ticket:category")} *</InputLabel>
                <Select
                  value={categorias.length > 0 ? createForm.id_categoria : ""}
                  onChange={(e) =>
                    handleCreateChange("id_categoria", e.target.value)
                  }
                  label={`${t("ticket:category")} *`}
                >
                  <MenuItem value="">
                    <em>{t("ticket:selectCategory")}</em>
                  </MenuItem>
                  {categorias.map((cat) => (
                    <MenuItem key={cat.id_categoria} value={cat.id_categoria}>
                      {cat.nombre_categoria}
                    </MenuItem>
                  ))}
                </Select>
                {errors.id_categoria && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ mt: 0.5, ml: 2 }}
                  >
                    {errors.id_categoria}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Mascota */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>{t("ticket:pet")} *</InputLabel>
                <Select
                  value={mascotas.length > 0 ? createForm.id_mascota : ""}
                  onChange={(e) =>
                    handleCreateChange("id_mascota", e.target.value)
                  }
                  label={`${t("ticket:pet")} *`}
                  error={!!errors.id_mascota}
                >
                  <MenuItem value="">
                    <em>{t("ticket:fields.selectPet")}</em>
                  </MenuItem>
                  {mascotas.map((mascota) => (
                    <MenuItem
                      key={mascota.id_mascota}
                      value={mascota.id_mascota}
                    >
                      {mascota.nombre}
                      {mascota.especie && ` - ${mascota.especie}`}
                    </MenuItem>
                  ))}
                </Select>
                {errors.id_mascota && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ mt: 0.5, ml: 2 }}
                  >
                    {errors.id_mascota}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Fecha de Cita (condicional según etiquetas) */}
            {createForm.id_categoria && (
              <Grid item xs={12} md={6}>
                {etiquetasDeCategoria.some((e) =>
                  e.nombre_etiqueta.toLowerCase().includes("emergencia")
                ) ? (
                  <TextField
                    fullWidth
                    label={t("ticket:appointmentDate")}
                    value={t("ticket:maintenance.labels.immediateEmergency")}
                    disabled
                    helperText={t(
                      "ticket:maintenance.labels.requiresImmediateAttention"
                    )}
                  />
                ) : (
                  <TextField
                    fullWidth
                    type="date"
                    label={t("ticket:appointmentDate")}
                    value={createForm.fecha_cita}
                    onChange={(e) =>
                      handleCreateChange("fecha_cita", e.target.value)
                    }
                    helperText={t("ticket:maintenance.labels.selectDateHelper")}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      min: new Date().toISOString().split("T")[0],
                      max: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                        .toISOString()
                        .split("T")[0],
                    }}
                  />
                )}
              </Grid>
            )}

            {/* Etiquetas (solo lectura, basadas en categoría) */}
            <Grid item xs={12} md={6}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                {t("ticket:maintenance.labels.associatedTags")}
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {etiquetasDeCategoria.length > 0 ? (
                  etiquetasDeCategoria.map((etiqueta) => (
                    <Chip
                      key={etiqueta.id_etiqueta}
                      label={etiqueta.nombre_etiqueta}
                      color="primary"
                      size="small"
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    {createForm.id_categoria
                      ? t("common:messages.loading")
                      : t("ticket:maintenance.labels.selectCategoryToSeeTags")}
                  </Typography>
                )}
              </Stack>
            </Grid>

            {/* Veterinario Asignado (solo Admin/Veterinario) */}
            {(userRole === "Administrador" || userRole === "Veterinario") && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>
                    {t("ticket:maintenance.labels.assignVeterinarian")}
                  </InputLabel>
                  <Select
                    value={
                      veterinariosDisponibles.length > 0
                        ? createForm.id_asignado_a_usuario
                        : ""
                    }
                    onChange={(e) =>
                      handleCreateChange(
                        "id_asignado_a_usuario",
                        e.target.value
                      )
                    }
                    label={t("ticket:maintenance.labels.assignVeterinarian")}
                    disabled={!createForm.id_categoria}
                  >
                    <MenuItem value="">
                      <em>{t("ticket:maintenance.labels.unassigned")}</em>
                    </MenuItem>
                    {veterinariosDisponibles.map((vet) => {
                      const especialidades = Array.isArray(vet.especialidades)
                        ? vet.especialidades
                            .map((e) =>
                              typeof e === "string" ? e : e.nombre_especialidad
                            )
                            .join(", ")
                        : "";
                      const disponible = 24 - (vet.carga_actual || 0);

                      return (
                        <MenuItem
                          key={vet.id_veterinario}
                          value={vet.id_veterinario}
                        >
                          {vet.nombre_completo} - {especialidades} -{" "}
                          {t("ticket:maintenance.labels.available")}:{" "}
                          {disponible}h
                        </MenuItem>
                      );
                    })}
                  </Select>
                  {!createForm.id_categoria && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 0.5, ml: 2 }}
                    >
                      {t("ticket:maintenance.labels.selectCategoryFirst")}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
            )}

            {/* Usuario Solicitante */}
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  {userRole === "Cliente"
                    ? t("ticket:maintenance.labels.requesterInfo")
                    : t("ticket:maintenance.labels.selectClient")}
                </Typography>
              </Alert>
            </Grid>

            {/* Selector de Cliente (solo Admin/Veterinario) */}
            {(userRole === "Administrador" || userRole === "Veterinario") &&
              !loadingCatalogos && (
                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>
                      {t("ticket:maintenance.labels.requesterClient")} *
                    </InputLabel>
                    <Select
                      value={
                        clientes.length > 0
                          ? createForm.id_creado_por_usuario
                          : ""
                      }
                      onChange={(e) =>
                        handleCreateChange(
                          "id_creado_por_usuario",
                          e.target.value
                        )
                      }
                      label={`${t("ticket:maintenance.labels.requesterClient")} *`}
                    >
                      <MenuItem value="">
                        <em>
                          {t("ticket:maintenance.labels.selectClientOption")}
                        </em>
                      </MenuItem>
                      {clientes.map((cliente) => (
                        <MenuItem
                          key={cliente.id_usuario}
                          value={cliente.id_usuario}
                        >
                          {cliente.nombre_completo} - {cliente.email}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}

            {/* Datos del Solicitante (solo lectura) */}

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t("ticket:maintenance.labels.fullName")}
                value={createForm.nombre_solicitante}
                disabled
                helperText={t(
                  "ticket:maintenance.labels.requesterAutoAssigned"
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t("ticket:maintenance.labels.email")}
                value={createForm.email_solicitante}
                disabled
                helperText={t("ticket:maintenance.labels.requesterContact")}
              />
            </Grid>

            {/* Fecha de creación (automática) */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t("ticket:maintenance.labels.creationDate")}
                value={new Date().toLocaleString("es-ES")}
                disabled
                helperText={t("ticket:maintenance.labels.autoRegistered")}
              />
            </Grid>

            {/* Estado inicial (automático) */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t("ticket:maintenance.labels.initialState")}
                value={t("ticket:maintenance.labels.pending")}
                disabled
                helperText={t("ticket:maintenance.labels.startsAsPending")}
              />
            </Grid>

            {/* Información de validaciones */}
            <Grid item xs={12}>
              <Alert severity="info">
                <strong>{t("ticket:validation.importantInfo")}</strong>
                <ul style={{ marginBottom: 0 }}>
                  <li>{t("ticket:validation.requiredFields")}</li>
                  <li>{t("ticket:validation.titleLength")}</li>
                  <li>{t("ticket:validation.descriptionRequired")}</li>
                  <li>{t("ticket:validation.tagsAutoAssigned")}</li>
                  {(userRole === "Administrador" ||
                    userRole === "Veterinario") && (
                    <>
                      <li>{t("ticket:validation.vetsFiltered")}</li>
                      <li>{t("ticket:validation.autoAssignVet")}</li>
                    </>
                  )}
                  <li>{t("ticket:validation.slaAutoCalculated")}</li>
                </ul>
              </Alert>
            </Grid>

            {/* Sección de Imágenes */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                📷 {t("ticket:maintenance.labels.imagesOptional")}
              </Typography>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUploadIcon />}
                sx={{ mb: 2 }}
              >
                {t("ticket:maintenance.labels.uploadImages")}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  multiple
                  onChange={handleCreateImageChange}
                />
              </Button>

              {imagesPreviews.length > 0 && (
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  {imagesPreviews.map((preview, index) => (
                    <Grid item xs={6} sm={4} md={2} key={index}>
                      <Box sx={{ position: "relative" }}>
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          style={{
                            width: "100%",
                            height: "120px",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                        <Button
                          size="small"
                          color="error"
                          variant="contained"
                          onClick={() => handleRemoveCreateImage(index)}
                          sx={{
                            position: "absolute",
                            top: 5,
                            right: 5,
                            minWidth: "auto",
                            p: 0.5,
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </Button>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Grid>

            {/* Botón Crear */}
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<SaveIcon />}
                onClick={handleCreate}
                fullWidth
              >
                {t("ticket:createTicketButton")}
              </Button>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={currentTab} index={1}>
          <Typography variant="h5" gutterBottom>
            ✏️ {t("ticket:maintenance.tabs.update")}{" "}
            {t("ticket:maintenance.ticketNoun")}
          </Typography>

          <Grid container spacing={3} sx={{ mt: 1 }}>
            {/* Selector de Ticket */}
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>{t("ticket:fields.selectTicket")} *</InputLabel>
                <Select
                  value={updateForm.id_ticket}
                  onChange={(e) => {
                    const ticketId = e.target.value;
                    handleUpdateChange("id_ticket", ticketId);
                    if (ticketId) {
                      cargarTicketParaEditar(ticketId);
                    }
                  }}
                  label={`${t("ticket:fields.selectTicket")} *`}
                >
                  <MenuItem value="">
                    <em>{t("ticket:fields.selectTicket")}</em>
                  </MenuItem>
                  {tickets.map((ticket) => (
                    <MenuItem key={ticket.id_ticket} value={ticket.id_ticket}>
                      #{ticket.id_ticket} - {ticket.titulo} (
                      {ticket.nombre_estado})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Mostrar formulario solo si hay ticket seleccionado */}
            {updateForm.id_ticket && !loadingTicket && (
              <>
                {/* Título */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={`${t("ticket:title")} *`}
                    value={updateForm.titulo}
                    onChange={(e) =>
                      handleUpdateChange("titulo", e.target.value)
                    }
                    error={!!errors.titulo}
                    helperText={
                      errors.titulo ||
                      t("ticket:maintenance.labels.titleHelper")
                    }
                    required
                  />
                </Grid>

                {/* Descripción */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label={`${t("ticket:description")} *`}
                    value={updateForm.descripcion}
                    onChange={(e) =>
                      handleUpdateChange("descripcion", e.target.value)
                    }
                    error={!!errors.descripcion}
                    helperText={
                      errors.descripcion ||
                      t("ticket:maintenance.labels.descriptionHelper")
                    }
                    required
                  />
                </Grid>

                {/* Categoría */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required disabled>
                    <InputLabel>{t("ticket:category")} *</InputLabel>
                    <Select
                      value={updateForm.id_categoria}
                      label={`${t("ticket:category")} *`}
                    >
                      {categorias.map((cat) => (
                        <MenuItem
                          key={cat.id_categoria}
                          value={cat.id_categoria}
                        >
                          {cat.nombre_categoria}
                        </MenuItem>
                      ))}
                    </Select>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 0.5, ml: 2 }}
                    >
                      {t("ticket:maintenance.validation.categoryNoChange")}
                    </Typography>
                  </FormControl>
                </Grid>

                {/* Estado */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel>{t("ticket:fields.state")} *</InputLabel>
                    <Select
                      value={updateForm.id_estado}
                      onChange={(e) =>
                        handleUpdateChange("id_estado", e.target.value)
                      }
                      label={`${t("ticket:fields.state")} *`}
                    >
                      {estados.map((est) => (
                        <MenuItem key={est.id_estado} value={est.id_estado}>
                          {est.nombre_estado}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Mascota */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required disabled>
                    <InputLabel>{t("ticket:pet")} *</InputLabel>
                    <Select
                      value={updateForm.id_mascota}
                      label={`${t("ticket:pet")} *`}
                    >
                      {mascotas.map((mascota) => (
                        <MenuItem
                          key={mascota.id_mascota}
                          value={mascota.id_mascota}
                        >
                          {mascota.nombre}
                          {mascota.especie && ` - ${mascota.especie}`}
                        </MenuItem>
                      ))}
                    </Select>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 0.5, ml: 2 }}
                    >
                      {t("ticket:maintenance.validation.petNoChange")}
                    </Typography>
                  </FormControl>
                </Grid>

                {/* Veterinario Asignado */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>{t("ticket:assignedVeterinarian")}</InputLabel>
                    <Select
                      value={updateForm.id_asignado_a_usuario}
                      onChange={(e) =>
                        handleUpdateChange(
                          "id_asignado_a_usuario",
                          e.target.value
                        )
                      }
                      label={t("ticket:assignedVeterinarian")}
                    >
                      <MenuItem value="">
                        <em>{t("ticket:maintenance.labels.unassigned")}</em>
                      </MenuItem>
                      {veterinariosDisponibles.map((vet) => {
                        const especialidades = Array.isArray(vet.especialidades)
                          ? vet.especialidades
                              .map((e) =>
                                typeof e === "string"
                                  ? e
                                  : e.nombre_especialidad
                              )
                              .join(", ")
                          : "";
                        const disponible = 24 - (vet.carga_actual || 0);

                        return (
                          <MenuItem
                            key={vet.id_veterinario || vet.id_usuario}
                            value={vet.id_veterinario || vet.id_usuario}
                          >
                            {vet.nombre_completo} - {especialidades} -
                            {t("ticket:maintenance.labels.available")}:{" "}
                            {disponible}h
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Fecha de Cita */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label={t("ticket:appointmentDate")}
                    value={updateForm.fecha_cita}
                    onChange={(e) =>
                      handleUpdateChange("fecha_cita", e.target.value)
                    }
                    InputLabelProps={{ shrink: true }}
                    inputProps={{
                      min: new Date().toISOString().split("T")[0],
                      max: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                        .toISOString()
                        .split("T")[0],
                    }}
                  />
                </Grid>

                {/* Etiquetas */}
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {t("ticket:maintenance.labels.associatedTags")}
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {etiquetasDeCategoria.length > 0 ? (
                      etiquetasDeCategoria.map((etiqueta) => (
                        <Chip
                          key={etiqueta.id_etiqueta}
                          label={etiqueta.nombre_etiqueta}
                          color="primary"
                          size="small"
                        />
                      ))
                    ) : (
                      <Typography variant="caption" color="text.secondary">
                        No hay etiquetas asignadas
                      </Typography>
                    )}
                  </Stack>
                </Grid>

                {/* Comentario del cambio */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Comentario del cambio"
                    value={updateForm.comentario}
                    onChange={(e) =>
                      handleUpdateChange("comentario", e.target.value)
                    }
                    helperText="Opcional - Describa los cambios realizados (se guardará en el histórico)"
                    placeholder="Ej: Se cambió el estado a 'En Proceso' porque..."
                  />
                </Grid>

                {/* Sección de Imágenes */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    📷 Agregar Imágenes (Opcional - Máximo 5)
                  </Typography>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<CloudUploadIcon />}
                    sx={{ mb: 2 }}
                  >
                    Seleccionar Imágenes
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      multiple
                      onChange={handleUpdateImageChange}
                    />
                  </Button>

                  {updateImagesPreviews.length > 0 && (
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      {updateImagesPreviews.map((preview, index) => (
                        <Grid item xs={6} sm={4} md={2} key={index}>
                          <Box sx={{ position: "relative" }}>
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              style={{
                                width: "100%",
                                height: "120px",
                                objectFit: "cover",
                                borderRadius: "8px",
                              }}
                            />
                            <Button
                              size="small"
                              color="error"
                              variant="contained"
                              onClick={() => handleRemoveUpdateImage(index)}
                              sx={{
                                position: "absolute",
                                top: 5,
                                right: 5,
                                minWidth: "auto",
                                p: 0.5,
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </Button>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Grid>

                {/* Botón Actualizar */}
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    onClick={handleUpdate}
                    startIcon={<SaveIcon />}
                  >
                    Actualizar Ticket
                  </Button>
                </Grid>
              </>
            )}

            {loadingTicket && (
              <Grid item xs={12}>
                <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                  <CircularProgress />
                </Box>
              </Grid>
            )}
          </Grid>
        </TabPanel>
      </Paper>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Loading overlay */}
      {loadingCatalogos && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "rgba(255, 255, 255, 0.7)",
            zIndex: 9999,
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Container>
  );
}
