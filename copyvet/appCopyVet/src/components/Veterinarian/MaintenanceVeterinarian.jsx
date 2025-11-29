import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
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
  OutlinedInput,
  Alert,
  Snackbar,
  Grid,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import VeterinarioService from "../../services/VeterinarioService";
import SpecialtyService from "../../services/SpecialtyService";

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

export default function MaintenanceVeterinarian() {
  const { t } = useTranslation();
  const [currentTab, setCurrentTab] = useState(0);

  // Estados para formulario de Crear
  const [createForm, setCreateForm] = useState({
    nombre_veterinario: "",
    email: "",
    telefono: "",
    especialidades: [],
    cedula: "",
    activo: true,
  });

  // Estados para formulario de Actualizar
  const [updateForm, setUpdateForm] = useState({
    id_veterinario: "",
    nombre_veterinario: "",
    email: "",
    telefono: "",
    especialidades: [],
    cedula: "",
    activo: true,
    carga_actual: 0,
  });

  // Estados para catálogos
  const [veterinarios, setVeterinarios] = useState([]);
  const [especialidadesDisponibles, setEspecialidadesDisponibles] = useState(
    []
  );
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

  // Función para cargar catálogos
  const cargarCatalogos = async () => {
    try {
      setLoadingCatalogos(true);

      console.log("Iniciando carga de catálogos...");

      // Cargar veterinarios existentes
      try {
        console.log("Cargando veterinarios...");
        const vetResponse = await VeterinarioService.list();
        console.log("Respuesta veterinarios:", vetResponse);
        if (vetResponse && vetResponse.data) {
          setVeterinarios(
            Array.isArray(vetResponse.data) ? vetResponse.data : []
          );
          console.log("Veterinarios cargados:", vetResponse.data.length);
        } else {
          console.warn("Respuesta de veterinarios no tiene data:", vetResponse);
          setVeterinarios([]);
        }
      } catch (vetError) {
        console.error("Error cargando veterinarios:", vetError);
        setVeterinarios([]);
        showSnackbar(
          t("veterinary:maintenance.messages.loadingError"),
          "warning"
        );
      }

      // Cargar especialidades desde el servicio
      try {
        console.log("Cargando especialidades...");
        const espResponse = await SpecialtyService.list();
        if (espResponse && espResponse.data) {
          const especialidades = Array.isArray(espResponse.data)
            ? espResponse.data
            : [];
          setEspecialidadesDisponibles(especialidades);
          console.log("Especialidades cargadas:", especialidades.length);
        } else {
          console.warn(
            "Respuesta de especialidades no tiene data:",
            espResponse
          );
          setEspecialidadesDisponibles([]);
        }
      } catch (espError) {
        console.error("Error cargando especialidades:", espError);
        setEspecialidadesDisponibles([]);
        showSnackbar(
          t("veterinary:maintenance.messages.loadingError"),
          "warning"
        );
      }

      console.log("Carga de catálogos completada");
    } catch (error) {
      console.error("Error general al cargar catálogos:", error);
      showSnackbar(t("veterinary:maintenance.messages.loadingError"), "error");
    } finally {
      setLoadingCatalogos(false);
    }
  };

  // Cargar catálogos al montar el componente
  useEffect(() => {
    cargarCatalogos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Validación del formulario
  const validateForm = (form, isUpdate = false) => {
    const newErrors = {};

    // Validar nombre
    if (!form.nombre_veterinario || form.nombre_veterinario.trim() === "") {
      newErrors.nombre_veterinario = t(
        "veterinary:maintenance.validation.nameRequired"
      );
    } else if (form.nombre_veterinario.trim().length < 3) {
      newErrors.nombre_veterinario = t(
        "veterinary:maintenance.validation.nameMinLength"
      );
    } else if (form.nombre_veterinario.trim().length > 100) {
      newErrors.nombre_veterinario = t(
        "veterinary:maintenance.validation.nameMaxLength"
      );
    }

    // Validar email
    if (!form.email || form.email.trim() === "") {
      newErrors.email = t("veterinary:maintenance.validation.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = t("veterinary:maintenance.validation.emailInvalid");
    } else {
      // Validar email duplicado
      const emailLower = form.email.trim().toLowerCase();
      const existeDuplicado = veterinarios.some((vet) => {
        const vetEmailLower = vet.email.toLowerCase();
        // Si estamos actualizando, excluir el veterinario actual de la validación
        if (isUpdate && vet.id_veterinario === form.id_veterinario) {
          return false;
        }
        return vetEmailLower === emailLower;
      });

      if (existeDuplicado) {
        newErrors.email = t("veterinary:maintenance.validation.emailDuplicate");
      }
    }

    // Validar teléfono (ahora obligatorio)
    if (!form.telefono || form.telefono.trim() === "") {
      newErrors.telefono = t("veterinary:maintenance.validation.phoneRequired");
    } else if (!/^\d{8,15}$/.test(form.telefono.trim())) {
      newErrors.telefono = t("veterinary:maintenance.validation.phoneInvalid");
    }

    // Validar especialidades (al menos una)
    if (!form.especialidades || form.especialidades.length === 0) {
      newErrors.especialidades = t(
        "veterinary:maintenance.validation.specialtiesRequired"
      );
    }

    // Validación específica para actualizar
    if (isUpdate && !form.id_veterinario) {
      newErrors.id_veterinario = t(
        "veterinary:maintenance.validation.veterinarianRequired"
      );
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejo de cambios en formulario Crear
  const handleCreateChange = (field, value) => {
    setCreateForm({ ...createForm, [field]: value });

    // Validación en tiempo real para email duplicado
    if (field === "email" && value.trim()) {
      const emailLower = value.trim().toLowerCase();
      const existeDuplicado = veterinarios.some(
        (vet) => vet.email.toLowerCase() === emailLower
      );

      if (existeDuplicado) {
        setErrors({
          ...errors,
          email: "Ya existe un veterinario con este email",
        });
      } else if (errors[field]) {
        setErrors({ ...errors, [field]: null });
      }
    } else if (field === "especialidades" && value.length > 0) {
      // Limpiar error de especialidades si se selecciona al menos una
      if (errors.especialidades) {
        setErrors({ ...errors, especialidades: null });
      }
    } else if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  // Manejo de cambios en formulario Actualizar
  const handleUpdateChange = (field, value) => {
    if (field === "especialidades") {
      console.log("handleUpdateChange - especialidades:", value);
      console.log(
        "Tipos:",
        value.map((v) => typeof v)
      );
      console.log("Estado actual:", updateForm.especialidades);
    }
    setUpdateForm({ ...updateForm, [field]: value });

    // Validación en tiempo real para email duplicado (excluyendo el veterinario actual)
    if (field === "email" && value.trim()) {
      const emailLower = value.trim().toLowerCase();
      const existeDuplicado = veterinarios.some((vet) => {
        if (vet.id_veterinario === updateForm.id_veterinario) return false;
        return vet.email.toLowerCase() === emailLower;
      });

      if (existeDuplicado) {
        setErrors({
          ...errors,
          email: "Ya existe un veterinario con este email",
        });
      } else if (errors[field]) {
        setErrors({ ...errors, [field]: null });
      }
    } else if (field === "especialidades" && value.length > 0) {
      // Limpiar error de especialidades si se selecciona al menos una
      if (errors.especialidades) {
        setErrors({ ...errors, especialidades: null });
      }
    } else if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  // Crear veterinario
  const handleCreate = async () => {
    console.log("Iniciando creación de veterinario...");
    console.log("Datos del formulario:", createForm);

    if (!validateForm(createForm)) {
      showSnackbar(
        t("veterinary:maintenance.validation.completeFields"),
        "error"
      );
      return;
    }

    try {
      const veterinarioData = {
        nombre_veterinario: createForm.nombre_veterinario.trim(),
        email: createForm.email.trim(),
        telefono: createForm.telefono.trim(),
        // Convertir especialidades a números para el backend
        especialidades: createForm.especialidades.map((id) => parseInt(id)),
        activo: createForm.activo,
      };

      console.log("Enviando datos al servidor:", veterinarioData);

      const response = await VeterinarioService.create(veterinarioData);
      console.log("Respuesta del servidor:", response);

      // Mostrar mensaje con contraseña temporal
      showSnackbar(
        `${t("veterinary:maintenance.messages.createSuccess")}. Contraseña temporal: 123456`,
        "success"
      );

      // Limpiar formulario
      setCreateForm({
        nombre_veterinario: "",
        email: "",
        telefono: "",
        especialidades: [],
        cedula: "",
        activo: true,
      });

      // Limpiar errores
      setErrors({});

      // Recargar veterinarios
      cargarCatalogos();
    } catch (error) {
      console.error("Error al crear veterinario:", error);
      console.error("Detalles del error:", error.response);

      // Mostrar error específico del servidor si está disponible
      let errorMessage = t("veterinary:maintenance.messages.createError");
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.result) {
        errorMessage = error.response.data.result;
      } else if (error.message) {
        errorMessage = error.message;
      }

      showSnackbar(errorMessage, "error");
    }
  };

  // Cargar datos de veterinario para actualizar
  const handleSelectVetToUpdate = async (id) => {
    if (!id) return;

    try {
      const response = await VeterinarioService.get(id);
      const veterinario = response.data;

      // Normalizar especialidades_ids a strings para que coincidan con los valores del select
      const especialidadesNormalizadas = (
        veterinario.especialidades_ids || []
      ).map((id) => String(id));

      setUpdateForm({
        id_veterinario: veterinario.id_veterinario,
        nombre_veterinario: veterinario.nombre_veterinario || "",
        email: veterinario.email || "",
        telefono: veterinario.telefono || "",
        cedula: veterinario.cedula || "",
        especialidades: especialidadesNormalizadas,
        activo: veterinario.activo == 1 || veterinario.activo === true,
        carga_actual: parseInt(veterinario.carga_actual) || 0,
        tickets_asignados: veterinario.tickets_asignados || [],
      });
    } catch (error) {
      console.error("Error al cargar veterinario:", error);
      showSnackbar(
        t("veterinary:maintenance.messages.loadVeterinarianError"),
        "error"
      );
    }
  };

  // Actualizar veterinario
  const handleUpdate = async () => {
    if (!validateForm(updateForm, true)) {
      showSnackbar(
        t("veterinary:maintenance.validation.completeFields"),
        "error"
      );
      return;
    }

    try {
      // Crear un nuevo objeto con los datos actualizados
      const updatedVeterinario = {
        id_veterinario: parseInt(updateForm.id_veterinario),
        nombre_veterinario: updateForm.nombre_veterinario,
        email: updateForm.email,
        telefono: updateForm.telefono,
        cedula: updateForm.cedula,
        // Convertir especialidades a números para el backend
        especialidades: updateForm.especialidades.map((id) => parseInt(id)),
        activo: updateForm.activo,
      };

      await VeterinarioService.update(updatedVeterinario);
      showSnackbar(
        t("veterinary:maintenance.messages.updateSuccess"),
        "success"
      );

      // Recargar veterinarios
      cargarCatalogos();
    } catch (error) {
      console.error("Error al actualizar veterinario:", error);
      showSnackbar(t("veterinary:maintenance.messages.updateError"), "error");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t("veterinary:maintenance.title")}
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: "divider", mt: 3 }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            aria-label="Tabs de mantenimiento de veterinarios"
          >
            <Tab
              label={t("veterinary:maintenance.tabs.create")}
              id="maintenance-tab-0"
            />
            <Tab
              label={t("veterinary:maintenance.tabs.update")}
              id="maintenance-tab-1"
            />
          </Tabs>
        </Box>

        {/* TAB: CREAR VETERINARIO */}
        <TabPanel value={currentTab} index={0}>
          <Typography variant="h6" gutterBottom>
            {t("veterinary:maintenance.buttons.create")}
          </Typography>

          <Grid container spacing={3} sx={{ mt: 1 }}>
            {/* Nombre del veterinario */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={`${t("veterinary:maintenance.fields.name")} *`}
                value={createForm.nombre_veterinario}
                onChange={(e) =>
                  handleCreateChange("nombre_veterinario", e.target.value)
                }
                error={!!errors.nombre_veterinario}
                helperText={errors.nombre_veterinario}
                placeholder={t("veterinary:maintenance.placeholders.name")}
              />
            </Grid>

            {/* Email */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={`${t("veterinary:maintenance.fields.email")} *`}
                type="email"
                value={createForm.email}
                onChange={(e) => handleCreateChange("email", e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
                placeholder={t("veterinary:maintenance.placeholders.email")}
              />
            </Grid>

            {/* Teléfono */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={`${t("veterinary:maintenance.fields.phone")} *`}
                value={createForm.telefono}
                onChange={(e) => handleCreateChange("telefono", e.target.value)}
                error={!!errors.telefono}
                helperText={errors.telefono}
                placeholder={t("veterinary:maintenance.placeholders.phone")}
              />
            </Grid>

            {/* Especialidades */}
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.especialidades}>
                <InputLabel>
                  {t("veterinary:maintenance.fields.specialties")} *
                </InputLabel>
                <Select
                  multiple
                  value={createForm.especialidades}
                  onChange={(e) =>
                    handleCreateChange("especialidades", e.target.value)
                  }
                  input={
                    <OutlinedInput
                      label={`${t("veterinary:maintenance.fields.specialties")} *`}
                    />
                  }
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => {
                        const esp = especialidadesDisponibles.find(
                          (e) => String(e.id_especialidad) === String(value)
                        );
                        return (
                          <Chip
                            key={value}
                            label={esp?.nombre_especialidad || value}
                            size="small"
                            color="primary"
                          />
                        );
                      })}
                    </Box>
                  )}
                >
                  {especialidadesDisponibles.map((esp) => {
                    const valueString = String(esp.id_especialidad);
                    return (
                      <MenuItem key={esp.id_especialidad} value={valueString}>
                        {esp.nombre_especialidad}
                      </MenuItem>
                    );
                  })}
                </Select>
                {errors.especialidades && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ mt: 0.5, ml: 2 }}
                  >
                    {errors.especialidades}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Estado activo */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>
                  {t("veterinary:maintenance.fields.active")}
                </InputLabel>
                <Select
                  value={createForm.activo}
                  onChange={(e) => handleCreateChange("activo", e.target.value)}
                  label={t("veterinary:maintenance.fields.active")}
                >
                  <MenuItem value={true}>{t("common:status.active")}</MenuItem>
                  <MenuItem value={false}>
                    {t("common:status.inactive")}
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Carga actual (siempre 0 al crear) */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t("veterinary:maintenance.fields.currentLoad")}
                type="number"
                value={0}
                disabled
                helperText={t("veterinary:list.hours")}
              />
            </Grid>

            {/* Información de validaciones */}
            <Grid item xs={12}>
              <Alert severity="info">
                <strong>
                  {t("veterinary:maintenance.validationInfo.title")}
                </strong>
                <ul style={{ marginBottom: 0 }}>
                  <li>
                    {t("veterinary:maintenance.validationInfo.requiredFields")}
                  </li>
                  <li>
                    {t("veterinary:maintenance.validationInfo.nameLength")}
                  </li>
                  <li>
                    {t("veterinary:maintenance.validationInfo.emailUnique")}
                  </li>
                  <li>
                    {t("veterinary:maintenance.validationInfo.phoneOptional")}
                  </li>
                  <li>
                    {t(
                      "veterinary:maintenance.validationInfo.specialtiesMinimum"
                    )}
                  </li>
                  <li>
                    {t(
                      "veterinary:maintenance.validationInfo.temporaryPassword"
                    )}
                  </li>
                </ul>
              </Alert>
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
                {t("veterinary:maintenance.buttons.create")}
              </Button>
            </Grid>
          </Grid>
        </TabPanel>

        {/* TAB: ACTUALIZAR VETERINARIO */}
        <TabPanel value={currentTab} index={1}>
          <Typography variant="h6" gutterBottom>
            {t("veterinary:maintenance.buttons.update")}
          </Typography>

          <Grid container spacing={3} sx={{ mt: 1 }}>
            {/* Selector de veterinario */}
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.id_veterinario}>
                <InputLabel>
                  {t("veterinary:maintenance.fields.selectVeterinarian")} *
                </InputLabel>
                <Select
                  value={updateForm.id_veterinario}
                  onChange={(e) => {
                    handleUpdateChange("id_veterinario", e.target.value);
                    handleSelectVetToUpdate(e.target.value);
                  }}
                  label={`${t("veterinary:maintenance.fields.selectVeterinarian")} *`}
                >
                  {veterinarios.map((vet) => (
                    <MenuItem
                      key={vet.id_veterinario}
                      value={vet.id_veterinario}
                    >
                      {vet.nombre_completo} - {vet.email}
                    </MenuItem>
                  ))}
                </Select>
                {errors.id_veterinario && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ mt: 0.5, ml: 2 }}
                  >
                    {errors.id_veterinario}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {updateForm.id_veterinario && (
              <>
                {/* Nombre del veterinario */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={`${t("veterinary:maintenance.fields.name")} *`}
                    value={updateForm.nombre_veterinario}
                    onChange={(e) =>
                      handleUpdateChange("nombre_veterinario", e.target.value)
                    }
                    error={!!errors.nombre_veterinario}
                    helperText={errors.nombre_veterinario}
                  />
                </Grid>

                {/* Email */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={`${t("veterinary:maintenance.fields.email")} *`}
                    type="email"
                    value={updateForm.email}
                    onChange={(e) =>
                      handleUpdateChange("email", e.target.value)
                    }
                    required
                    error={!!errors.email}
                    helperText={errors.email}
                  />
                </Grid>

                {/* Teléfono */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={`${t("veterinary:maintenance.fields.phone")} *`}
                    value={updateForm.telefono}
                    onChange={(e) =>
                      handleUpdateChange("telefono", e.target.value)
                    }
                    required
                    error={!!errors.telefono}
                    helperText={errors.telefono}
                  />
                </Grid>

                {/* Especialidades */}
                <Grid item xs={12}>
                  <FormControl fullWidth error={!!errors.especialidades}>
                    <InputLabel>
                      {t("veterinary:maintenance.fields.specialties")} *
                    </InputLabel>
                    <Select
                      multiple
                      value={updateForm.especialidades}
                      onChange={(e) =>
                        handleUpdateChange("especialidades", e.target.value)
                      }
                      input={
                        <OutlinedInput
                          label={`${t("veterinary:maintenance.fields.specialties")} *`}
                        />
                      }
                      renderValue={(selected) => (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {selected.map((value) => {
                            const esp = especialidadesDisponibles.find(
                              (e) => String(e.id_especialidad) === String(value)
                            );
                            return (
                              <Chip
                                key={value}
                                label={esp?.nombre_especialidad || value}
                                size="small"
                                color="primary"
                              />
                            );
                          })}
                        </Box>
                      )}
                    >
                      {especialidadesDisponibles.map((esp) => {
                        const valueString = String(esp.id_especialidad);
                        return (
                          <MenuItem
                            key={esp.id_especialidad}
                            value={valueString}
                          >
                            {esp.nombre_especialidad}
                          </MenuItem>
                        );
                      })}
                    </Select>
                    {errors.especialidades && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ mt: 0.5, ml: 2 }}
                      >
                        {errors.especialidades}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>

                {/* Estado activo */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>
                      {t("veterinary:maintenance.fields.active")}
                    </InputLabel>
                    <Select
                      value={updateForm.activo}
                      onChange={(e) =>
                        handleUpdateChange("activo", e.target.value)
                      }
                      label={t("veterinary:maintenance.fields.active")}
                    >
                      <MenuItem value={true}>
                        {t("common:status.active")}
                      </MenuItem>
                      <MenuItem value={false}>
                        {t("common:status.inactive")}
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Carga actual (solo lectura) */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t("veterinary:maintenance.fields.currentLoad")}
                    type="number"
                    value={updateForm.carga_actual || 0}
                    disabled
                    helperText={t("veterinary:list.hours")}
                  />
                </Grid>

                {/* Tickets Asignados */}
                {updateForm.id_veterinario && (
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Tickets Asignados (Solo lectura)
                    </Typography>
                    <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                      {updateForm.tickets_asignados &&
                      updateForm.tickets_asignados.length > 0 ? (
                        <List>
                          {updateForm.tickets_asignados.map((ticket) => (
                            <ListItem key={ticket.id_ticket}>
                              <ListItemIcon>
                                <PersonIcon />
                              </ListItemIcon>
                              <ListItemText
                                primary={`#${ticket.id_ticket} - ${ticket.titulo}`}
                                secondary={`Estado: ${ticket.nombre_estado} | Horas: ${ticket.horas_estimadas} | Cliente: ${ticket.cliente}`}
                              />
                            </ListItem>
                          ))}
                        </List>
                      ) : (
                        <Typography color="text.secondary">
                          No hay tickets asignados actualmente
                        </Typography>
                      )}
                    </Paper>
                  </Grid>
                )}

                {/* Botón Actualizar */}
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="success"
                    size="large"
                    startIcon={<EditIcon />}
                    onClick={handleUpdate}
                    fullWidth
                  >
                    {t("veterinary:maintenance.buttons.update")}
                  </Button>
                </Grid>
              </>
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
