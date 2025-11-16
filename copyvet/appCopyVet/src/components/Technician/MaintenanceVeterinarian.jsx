import { useState, useEffect } from "react";
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
import CategoryService from "../../services/CategoryService";

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
  const [currentTab, setCurrentTab] = useState(0);

  // Estados para formulario de Crear
  const [createForm, setCreateForm] = useState({
    nombre_veterinario: "",
    email: "",
    telefono: "",
    especialidades: [],
    cedula: "",
    activo: true,
    carga_maxima: 24,
  });

  // Estados para formulario de Actualizar
  const [updateForm, setUpdateForm] = useState({
    id_veterinario: "",
    nombre_veterinario: "",
    especialidades: [],
    cedula: "",
    activo: true,
    carga_maxima: 24,
  });

  // Estados para catálogos
  const [veterinarios, setVeterinarios] = useState([]);
  const [especialidadesDisponibles, setEspecialidadesDisponibles] = useState(
    []
  );
  const [, setEtiquetasDisponibles] = useState([]);
  const [, setCategorias] = useState([]);
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

      const baseUrl =
        import.meta.env.VITE_BASE_URL || window.location.origin + "/copyvet/";

      console.log("Iniciando carga de catálogos...");
      console.log("Base URL configurada:", baseUrl);

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
        console.error(
          "Detalle del error:",
          vetError.response || vetError.message
        );
        setVeterinarios([]);
        showSnackbar(
          `Error cargando veterinarios: ${vetError.message}`,
          "warning"
        );
      }

      // Cargar categorías existentes para extraer especialidades
      let categoriasData = [];
      try {
        console.log("Cargando categorías...");
        const catResponse = await CategoryService.list();
        console.log("Respuesta categorías:", catResponse);
        if (catResponse && catResponse.data) {
          categoriasData = Array.isArray(catResponse.data)
            ? catResponse.data
            : [];
          setCategorias(categoriasData);
          console.log("Categorías cargadas:", categoriasData.length);
        } else {
          console.warn("Respuesta de categorías no tiene data:", catResponse);
          setCategorias([]);
        }
      } catch (catError) {
        console.error("Error cargando categorías:", catError);
        console.error(
          "Detalle del error:",
          catError.response || catError.message
        );
        setCategorias([]);
        showSnackbar(
          `Error cargando categorías: ${catError.message}`,
          "warning"
        );
      }

      // Cargar especialidades directamente desde el endpoint
      let especialidadesDirectas = [];
      try {
        const espResponse = await fetch(baseUrl + "especialidad");
        console.log("Status especialidades:", espResponse.status);
        if (espResponse.ok) {
          const espData = await espResponse.json();
          console.log("Datos especialidades:", espData);
          especialidadesDirectas = Array.isArray(espData)
            ? espData.map((e) => e.nombre_especialidad).filter((esp) => esp)
            : [];
        }
      } catch (espError) {
        console.error("Error cargando especialidades:", espError);
      }

      // Extraer especialidades de las categorías existentes
      const especialidadesDeCategorias = [];
      categoriasData.forEach((categoria) => {
        if (
          categoria.especialidades &&
          Array.isArray(categoria.especialidades)
        ) {
          especialidadesDeCategorias.push(...categoria.especialidades);
        }
      });

      // Combinar todas las especialidades y eliminar duplicados
      const todasEspecialidades = [
        ...especialidadesDirectas,
        ...especialidadesDeCategorias,
      ];
      const especialidadesUnicas = [...new Set(todasEspecialidades)]
        .filter((esp) => esp && esp.trim() !== "")
        .sort();

      console.log("Especialidades directas:", especialidadesDirectas);
      console.log("Especialidades de categorías:", especialidadesDeCategorias);
      console.log("Especialidades finales:", especialidadesUnicas);

      // Si no se pudieron cargar especialidades de ninguna fuente, usar especialidades por defecto
      if (especialidadesUnicas.length === 0) {
        const especialidadesPorDefecto = [
          "Medicina General",
          "Cirugía",
          "Dermatología",
          "Cardiología",
          "Oftalmología",
          "Oncología",
          "Neurología",
          "Traumatología",
          "Medicina Interna",
          "Urgencias",
        ];
        setEspecialidadesDisponibles(especialidadesPorDefecto);
        console.log(
          "Usando especialidades por defecto:",
          especialidadesPorDefecto
        );
        showSnackbar("Se cargaron especialidades por defecto", "info");
      } else {
        setEspecialidadesDisponibles(especialidadesUnicas);
      }

      // Cargar etiquetas disponibles
      try {
        const etiqResponse = await fetch(baseUrl + "etiqueta");
        console.log("Status etiquetas:", etiqResponse.status);
        if (etiqResponse.ok) {
          const etiqData = await etiqResponse.json();
          console.log("Datos etiquetas:", etiqData);
          setEtiquetasDisponibles(
            Array.isArray(etiqData)
              ? etiqData.map((e) => e.nombre_etiqueta).filter((etq) => etq)
              : []
          );
        }
      } catch (etiqError) {
        console.error("Error cargando etiquetas:", etiqError);
        setEtiquetasDisponibles([]);
      }

      console.log("Carga de catálogos completada");
    } catch (error) {
      console.error("Error general al cargar catálogos:", error);
      showSnackbar(
        "Error al cargar los datos necesarios: " + (error.message || error),
        "error"
      );
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
      newErrors.nombre_veterinario = "El nombre del veterinario es obligatorio";
    } else if (form.nombre_veterinario.trim().length < 3) {
      newErrors.nombre_veterinario =
        "El nombre debe tener al menos 3 caracteres";
    } else if (form.nombre_veterinario.trim().length > 100) {
      newErrors.nombre_veterinario =
        "El nombre no puede exceder 100 caracteres";
    }

    // Validar email
    if (!form.email || form.email.trim() === "") {
      newErrors.email = "El email es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "El formato del email no es válido";
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
        newErrors.email = "Ya existe un veterinario con este email";
      }
    }

    // Validar teléfono (opcional)
    if (
      form.telefono &&
      form.telefono.trim() &&
      !/^\d{8,15}$/.test(form.telefono.trim())
    ) {
      newErrors.telefono = "El teléfono debe tener entre 8 y 15 dígitos";
    }

    // Validar especialidades (al menos una)
    if (!form.especialidades || form.especialidades.length === 0) {
      newErrors.especialidades = "Debe seleccionar al menos una especialidad";
    }

    // Validación específica para actualizar
    if (isUpdate && !form.id_veterinario) {
      newErrors.id_veterinario =
        "Debe seleccionar un veterinario para actualizar";
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
      showSnackbar("Por favor complete todos los campos obligatorios", "error");
      return;
    }

    try {
      const veterinarioData = {
        nombre_veterinario: createForm.nombre_veterinario.trim(),
        email: createForm.email.trim(),
        telefono: createForm.telefono.trim(),
        especialidades: createForm.especialidades,
        activo: createForm.activo,
        carga_maxima: createForm.carga_maxima,
      };

      console.log("Enviando datos al servidor:", veterinarioData);

      const response = await VeterinarioService.create(veterinarioData);
      console.log("Respuesta del servidor:", response);

      showSnackbar("Veterinario creado exitosamente", "success");

      // Limpiar formulario
      setCreateForm({
        nombre_veterinario: "",
        email: "",
        telefono: "",
        especialidades: [],
        cedula: "",
        activo: true,
        carga_maxima: 10,
      });

      // Limpiar errores
      setErrors({});

      // Recargar veterinarios
      cargarCatalogos();
    } catch (error) {
      console.error("Error al crear veterinario:", error);
      console.error("Detalles del error:", error.response);

      // Mostrar error específico del servidor si está disponible
      let errorMessage = "Error al crear el veterinario";
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

      setUpdateForm({
        id_veterinario: veterinario.id_veterinario,
        nombre_veterinario: veterinario.nombre_veterinario || "",
        email: veterinario.email || "",
        telefono: veterinario.telefono || "",
        cedula: veterinario.cedula || "",
        especialidades: veterinario.especialidades || [],
        activo: veterinario.activo !== undefined ? veterinario.activo : true,
        carga_maxima: veterinario.carga_maxima || 10,
        tickets_asignados: veterinario.tickets_asignados || [],
      });
    } catch (error) {
      console.error("Error al cargar veterinario:", error);
      showSnackbar("Error al cargar los datos del veterinario", "error");
    }
  };

  // Actualizar veterinario
  const handleUpdate = async () => {
    if (!validateForm(updateForm, true)) {
      showSnackbar("Por favor complete todos los campos obligatorios", "error");
      return;
    }

    // Validar si se está intentando cambiar carga_maxima cuando tiene tickets asignados
    if (
      updateForm.tickets_asignados &&
      updateForm.tickets_asignados.length > 0
    ) {
      showSnackbar(
        "No se puede modificar un veterinario que tiene tickets asignados",
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
        especialidades: updateForm.especialidades,
        activo: updateForm.activo,
        carga_maxima: updateForm.carga_maxima,
      };

      await VeterinarioService.update(updatedVeterinario);
      showSnackbar("Veterinario actualizado exitosamente", "success");

      // Recargar veterinarios
      cargarCatalogos();
    } catch (error) {
      console.error("Error al actualizar veterinario:", error);
      showSnackbar("Error al actualizar el veterinario", "error");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Mantenimiento de Veterinarios
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: "divider", mt: 3 }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            aria-label="Tabs de mantenimiento de veterinarios"
          >
            <Tab label="Crear" id="maintenance-tab-0" />
            <Tab label="Actualizar" id="maintenance-tab-1" />
          </Tabs>
        </Box>

        {/* TAB: CREAR VETERINARIO */}
        <TabPanel value={currentTab} index={0}>
          <Typography variant="h6" gutterBottom>
            Crear Veterinario
          </Typography>

          <Grid container spacing={3} sx={{ mt: 1 }}>
            {/* Nombre del veterinario */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre del Veterinario *"
                value={createForm.nombre_veterinario}
                onChange={(e) =>
                  handleCreateChange("nombre_veterinario", e.target.value)
                }
                error={!!errors.nombre_veterinario}
                helperText={
                  errors.nombre_veterinario || "Nombre completo del veterinario"
                }
                placeholder="Ej: Dr. Juan Pérez"
              />
            </Grid>

            {/* Email */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email *"
                type="email"
                value={createForm.email}
                onChange={(e) => handleCreateChange("email", e.target.value)}
                error={!!errors.email}
                helperText={errors.email || "Email único para el veterinario"}
                placeholder="veterinario@copyvet.com"
              />
            </Grid>

            {/* Teléfono */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Teléfono *"
                value={createForm.telefono}
                onChange={(e) => handleCreateChange("telefono", e.target.value)}
                error={!!errors.telefono}
                helperText={
                  errors.telefono || "Teléfono de contacto (8-15 dígitos)"
                }
                placeholder="88888888"
              />
            </Grid>

            {/* Especialidades */}
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.especialidades}>
                <InputLabel>Especialidades *</InputLabel>
                <Select
                  multiple
                  value={createForm.especialidades}
                  onChange={(e) =>
                    handleCreateChange("especialidades", e.target.value)
                  }
                  input={<OutlinedInput label="Especialidades *" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          label={value}
                          size="small"
                          color="primary"
                        />
                      ))}
                    </Box>
                  )}
                >
                  {especialidadesDisponibles.map((esp) => (
                    <MenuItem key={esp} value={esp}>
                      {esp}
                    </MenuItem>
                  ))}
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
                <InputLabel>Estado</InputLabel>
                <Select
                  value={createForm.activo}
                  onChange={(e) => handleCreateChange("activo", e.target.value)}
                  label="Estado"
                >
                  <MenuItem value={true}>Activo</MenuItem>
                  <MenuItem value={false}>Inactivo</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Carga máxima */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Carga Máxima de Horas"
                type="number"
                value={createForm.carga_maxima}
                onChange={(e) =>
                  handleCreateChange(
                    "carga_maxima",
                    Math.max(1, parseInt(e.target.value) || 1)
                  )
                }
                inputProps={{ min: 1, max: 24 }}
                helperText="Horas máximas diarias de trabajo (máximo 24 horas)"
              />
            </Grid>

            {/* Información de validaciones */}
            <Grid item xs={12}>
              <Alert severity="info">
                <strong>Validaciones requeridas:</strong>
                <ul style={{ marginBottom: 0 }}>
                  <li>Todos los campos marcados con (*) son obligatorios</li>
                  <li>El nombre debe tener entre 3 y 100 caracteres</li>
                  <li>El email debe ser único y tener formato válido</li>
                  <li>
                    El teléfono es opcional, pero si se especifica debe tener
                    entre 8-15 dígitos
                  </li>
                  <li>Debe seleccionar al menos una especialidad</li>
                  <li>
                    Se generará una contraseña temporal basada en el email
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
                Crear Veterinario
              </Button>
            </Grid>
          </Grid>
        </TabPanel>

        {/* TAB: ACTUALIZAR VETERINARIO */}
        <TabPanel value={currentTab} index={1}>
          <Typography variant="h6" gutterBottom>
            Actualizar Veterinario
          </Typography>

          <Grid container spacing={3} sx={{ mt: 1 }}>
            {/* Selector de veterinario */}
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.id_veterinario}>
                <InputLabel>Seleccionar Veterinario *</InputLabel>
                <Select
                  value={updateForm.id_veterinario}
                  onChange={(e) => {
                    handleUpdateChange("id_veterinario", e.target.value);
                    handleSelectVetToUpdate(e.target.value);
                  }}
                  label="Seleccionar Veterinario *"
                >
                  {veterinarios.map((vet) => (
                    <MenuItem
                      key={vet.id_veterinario}
                      value={vet.id_veterinario}
                    >
                      {vet.nombre_veterinario} - {vet.email}
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
                    label="Nombre del Veterinario *"
                    value={updateForm.nombre_veterinario}
                    onChange={(e) =>
                      handleUpdateChange("nombre_veterinario", e.target.value)
                    }
                    error={!!errors.nombre_veterinario}
                    helperText={
                      errors.nombre_veterinario ||
                      "Nombre completo del veterinario"
                    }
                  />
                </Grid>

                {/* Email */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email *"
                    type="email"
                    value={updateForm.email}
                    onChange={(e) =>
                      handleUpdateChange("email", e.target.value)
                    }
                    error={!!errors.email}
                    helperText={
                      errors.email || "Email único para el veterinario"
                    }
                  />
                </Grid>

                {/* Teléfono */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Teléfono"
                    value={updateForm.telefono}
                    onChange={(e) =>
                      handleUpdateChange("telefono", e.target.value)
                    }
                    error={!!errors.telefono}
                    helperText={errors.telefono || "Teléfono de contacto"}
                  />
                </Grid>

                {/* Especialidades */}
                <Grid item xs={12}>
                  <FormControl fullWidth error={!!errors.especialidades}>
                    <InputLabel>Especialidades *</InputLabel>
                    <Select
                      multiple
                      value={updateForm.especialidades}
                      onChange={(e) =>
                        handleUpdateChange("especialidades", e.target.value)
                      }
                      input={<OutlinedInput label="Especialidades *" />}
                      renderValue={(selected) => (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {selected.map((value) => (
                            <Chip
                              key={value}
                              label={value}
                              size="small"
                              color="primary"
                            />
                          ))}
                        </Box>
                      )}
                    >
                      {especialidadesDisponibles.map((esp) => (
                        <MenuItem key={esp} value={esp}>
                          {esp}
                        </MenuItem>
                      ))}
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
                    <InputLabel>Estado</InputLabel>
                    <Select
                      value={updateForm.activo}
                      onChange={(e) =>
                        handleUpdateChange("activo", e.target.value)
                      }
                      label="Estado"
                    >
                      <MenuItem value={true}>Activo</MenuItem>
                      <MenuItem value={false}>Inactivo</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Carga máxima */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Carga Máxima de Horas"
                    type="number"
                    value={updateForm.carga_maxima}
                    onChange={(e) =>
                      handleUpdateChange(
                        "carga_maxima",
                        Math.max(1, parseInt(e.target.value) || 1)
                      )
                    }
                    inputProps={{ min: 1, max: 100 }}
                    disabled={
                      updateForm.tickets_asignados &&
                      updateForm.tickets_asignados.length > 0
                    }
                    helperText={
                      updateForm.tickets_asignados &&
                      updateForm.tickets_asignados.length > 0
                        ? "No se puede modificar la carga máxima de un veterinario con tickets asignados"
                        : "Número máximo de horas que puede manejar el veterinario"
                    }
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
                    Actualizar Veterinario
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
