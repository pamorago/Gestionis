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
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
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

export default function MaintenanceCategory() {
  const { t } = useTranslation();
  const [currentTab, setCurrentTab] = useState(0);

  // Estados para formulario de Crear
  const [createForm, setCreateForm] = useState({
    nombre_categoria: "",
    id_sla: "",
    etiquetas: [],
    especialidades: [],
  });

  // Estados para formulario de Actualizar
  const [updateForm, setUpdateForm] = useState({
    id_categoria: "",
    nombre_categoria: "",
    id_sla: "",
    etiquetas: [],
    especialidades: [],
  });

  // Estados para catálogos
  const [slas, setSlas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [etiquetasDisponibles, setEtiquetasDisponibles] = useState([]);
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

      const baseUrl =
        import.meta.env.VITE_BASE_URL || window.location.origin + "/copyvet/";

      // Cargar SLAs
      const slaResponse = await fetch(baseUrl + "sla");
      const slaData = await slaResponse.json();
      setSlas(Array.isArray(slaData) ? slaData : []);

      // Cargar categorías existentes
      const catResponse = await CategoryService.list();
      setCategorias(Array.isArray(catResponse.data) ? catResponse.data : []);

      // Cargar etiquetas disponibles
      const etiqResponse = await fetch(baseUrl + "etiqueta");
      const etiqData = await etiqResponse.json();
      setEtiquetasDisponibles(
        Array.isArray(etiqData) ? etiqData.map((e) => e.nombre_etiqueta) : []
      );

      // Cargar especialidades disponibles
      const espResponse = await fetch(baseUrl + "especialidad");
      const espData = await espResponse.json();
      setEspecialidadesDisponibles(
        Array.isArray(espData) ? espData.map((e) => e.nombre_especialidad) : []
      );
    } catch (error) {
      console.error("Error al cargar catálogos:", error);
      showSnackbar(t("category:maintenance.messages.loadingError"), "error");
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
    if (!form.nombre_categoria || form.nombre_categoria.trim() === "") {
      newErrors.nombre_categoria = t(
        "category:maintenance.validation.nameRequired"
      );
    } else if (form.nombre_categoria.trim().length < 3) {
      newErrors.nombre_categoria = t(
        "category:maintenance.validation.nameMinLength"
      );
    } else if (form.nombre_categoria.trim().length > 50) {
      newErrors.nombre_categoria = t(
        "category:maintenance.validation.nameMaxLength"
      );
    } else {
      // Validar nombre duplicado
      const nombreLower = form.nombre_categoria.trim().toLowerCase();
      const existeDuplicado = categorias.some((cat) => {
        const catNombreLower = cat.nombre_categoria.toLowerCase();
        // Si estamos actualizando, excluir la categoría actual de la validación
        if (isUpdate && cat.id_categoria === form.id_categoria) {
          return false;
        }
        return catNombreLower === nombreLower;
      });

      if (existeDuplicado) {
        newErrors.nombre_categoria = t(
          "category:maintenance.validation.nameDuplicate"
        );
      }
    }

    // Validar SLA
    if (
      !form.id_sla ||
      form.id_sla === "" ||
      form.id_sla === null ||
      form.id_sla === undefined
    ) {
      newErrors.id_sla = t("category:maintenance.validation.slaRequired");
    }

    // Validar etiquetas (al menos una)
    if (!form.etiquetas || form.etiquetas.length === 0) {
      newErrors.etiquetas = t("category:maintenance.validation.tagsRequired");
    }

    // Validar especialidades (al menos una)
    if (!form.especialidades || form.especialidades.length === 0) {
      newErrors.especialidades = t(
        "category:maintenance.validation.specialtiesRequired"
      );
    }

    // Validación específica para actualizar
    if (isUpdate && !form.id_categoria) {
      newErrors.id_categoria = t(
        "category:maintenance.validation.categoryRequired"
      );
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejo de cambios en formulario Crear
  const handleCreateChange = (field, value) => {
    setCreateForm({ ...createForm, [field]: value });

    // Validación en tiempo real para nombre duplicado
    if (field === "nombre_categoria" && value.trim()) {
      const nombreLower = value.trim().toLowerCase();
      const existeDuplicado = categorias.some(
        (cat) => cat.nombre_categoria.toLowerCase() === nombreLower
      );

      if (existeDuplicado) {
        setErrors({
          ...errors,
          nombre_categoria: t("category:maintenance.validation.nameDuplicate"),
        });
      } else if (errors[field]) {
        setErrors({ ...errors, [field]: null });
      }
    } else if (field === "etiquetas" && value.length > 0) {
      // Limpiar error de etiquetas si se selecciona al menos una
      if (errors.etiquetas) {
        setErrors({ ...errors, etiquetas: null });
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

    // Validación en tiempo real para nombre duplicado (excluyendo la categoría actual)
    if (field === "nombre_categoria" && value.trim()) {
      const nombreLower = value.trim().toLowerCase();
      const existeDuplicado = categorias.some((cat) => {
        if (cat.id_categoria === updateForm.id_categoria) return false;
        return cat.nombre_categoria.toLowerCase() === nombreLower;
      });

      if (existeDuplicado) {
        setErrors({
          ...errors,
          nombre_categoria: t("category:maintenance.validation.nameDuplicate"),
        });
      } else if (errors[field]) {
        setErrors({ ...errors, [field]: null });
      }
    } else if (field === "etiquetas" && value.length > 0) {
      // Limpiar error de etiquetas si se selecciona al menos una
      if (errors.etiquetas) {
        setErrors({ ...errors, etiquetas: null });
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

  // Crear categoría
  const handleCreate = async () => {
    if (!validateForm(createForm)) {
      showSnackbar(
        t("category:maintenance.validation.completeFields"),
        "error"
      );
      return;
    }

    try {
      const categoryData = {
        nombre_categoria: createForm.nombre_categoria,
        id_sla: parseInt(createForm.id_sla),
        etiquetas: createForm.etiquetas,
        especialidades: createForm.especialidades,
      };

      await CategoryService.create(categoryData);
      showSnackbar(t("category:maintenance.messages.createSuccess"), "success");

      // Limpiar formulario
      setCreateForm({
        nombre_categoria: "",
        id_sla: "",
        etiquetas: [],
        especialidades: [],
      });

      // Recargar categorías
      cargarCatalogos();
    } catch (error) {
      console.error("Error al crear categoría:", error);
      showSnackbar(t("category:maintenance.messages.createError"), "error");
    }
  };

  // Cargar datos de categoría para actualizar
  const handleSelectCategoryToUpdate = async (id) => {
    if (!id) return;

    try {
      const response = await CategoryService.get(id);
      const categoria = response.data;

      setUpdateForm({
        id_categoria: categoria.id_categoria,
        nombre_categoria: categoria.nombre_categoria || "",
        id_sla: categoria.id_sla || "",
        etiquetas: Array.isArray(categoria.etiquetas)
          ? categoria.etiquetas.map((e) =>
              typeof e === "string" ? e : e.nombre_etiqueta
            )
          : [],
        especialidades: Array.isArray(categoria.especialidades)
          ? categoria.especialidades.map((e) =>
              typeof e === "string" ? e : e.nombre_especialidad
            )
          : [],
      });
    } catch (error) {
      console.error("Error al cargar categoría:", error);
      showSnackbar(
        t("category:maintenance.messages.loadCategoryError"),
        "error"
      );
    }
  };

  // Actualizar categoría
  const handleUpdate = async () => {
    if (!validateForm(updateForm, true)) {
      showSnackbar(
        t("category:maintenance.validation.completeFields"),
        "error"
      );
      return;
    }

    try {
      // Crear un nuevo objeto con los datos actualizados (patrón del profesor)
      const updatedCategory = {
        id_categoria: parseInt(updateForm.id_categoria),
        nombre_categoria: updateForm.nombre_categoria,
        id_sla: parseInt(updateForm.id_sla),
        etiquetas: updateForm.etiquetas,
        especialidades: updateForm.especialidades,
      };

      await CategoryService.update(updatedCategory);
      showSnackbar(t("category:maintenance.messages.updateSuccess"), "success");

      // Recargar categorías
      cargarCatalogos();
    } catch (error) {
      console.error("Error al actualizar categoría:", error);
      showSnackbar(t("category:maintenance.messages.updateError"), "error");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t("category:maintenance.title")}
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: "divider", mt: 3 }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            aria-label="Tabs de mantenimiento de categorías"
          >
            <Tab
              label={t("category:maintenance.tabs.create")}
              id="maintenance-tab-0"
            />
            <Tab
              label={t("category:maintenance.tabs.update")}
              id="maintenance-tab-1"
            />
          </Tabs>
        </Box>

        {/* TAB: CREAR CATEGORÍA */}
        <TabPanel value={currentTab} index={0}>
          <Typography variant="h6" gutterBottom>
            {t("category:maintenance.buttons.create")}
          </Typography>

          <Grid container spacing={3} sx={{ mt: 1 }}>
            {/* Nombre de categoría */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={`${t("category:maintenance.fields.categoryName")} *`}
                value={createForm.nombre_categoria}
                onChange={(e) =>
                  handleCreateChange("nombre_categoria", e.target.value)
                }
                error={!!errors.nombre_categoria}
                helperText={
                  errors.nombre_categoria ||
                  t("category:maintenance.helpers.uniqueName")
                }
                placeholder={t(
                  "category:maintenance.placeholders.categoryName"
                )}
              />
            </Grid>

            {/* SLA Asociado */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.id_sla}>
                <InputLabel>
                  {t("category:maintenance.fields.sla")} *
                </InputLabel>
                <Select
                  value={createForm.id_sla}
                  onChange={(e) => handleCreateChange("id_sla", e.target.value)}
                  label={`${t("category:maintenance.fields.sla")} *`}
                >
                  {slas.map((sla) => (
                    <MenuItem key={sla.id_sla} value={sla.id_sla}>
                      {sla.descripcion} (Respuesta: {sla.tiempo_minutos} min,
                      Resolución: {sla.tiempo_resolucion} min)
                    </MenuItem>
                  ))}
                </Select>
                {errors.id_sla && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ mt: 0.5, ml: 2 }}
                  >
                    {errors.id_sla}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Etiquetas */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.etiquetas}>
                <InputLabel>
                  {t("category:maintenance.fields.tags")} *
                </InputLabel>
                <Select
                  multiple
                  value={createForm.etiquetas}
                  onChange={(e) =>
                    handleCreateChange("etiquetas", e.target.value)
                  }
                  input={
                    <OutlinedInput
                      label={`${t("category:maintenance.fields.tags")} *`}
                    />
                  }
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {etiquetasDisponibles.map((etiqueta) => (
                    <MenuItem key={etiqueta} value={etiqueta}>
                      {etiqueta}
                    </MenuItem>
                  ))}
                </Select>
                {errors.etiquetas && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ mt: 0.5, ml: 2 }}
                  >
                    {errors.etiquetas}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Especialidades */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.especialidades}>
                <InputLabel>
                  {t("category:maintenance.fields.specialties")} *
                </InputLabel>
                <Select
                  multiple
                  value={createForm.especialidades}
                  onChange={(e) =>
                    handleCreateChange("especialidades", e.target.value)
                  }
                  input={
                    <OutlinedInput
                      label={`${t("category:maintenance.fields.specialties")} *`}
                    />
                  }
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

            {/* Información de validaciones */}
            <Grid item xs={12}>
              <Alert severity="info">
                <strong>Validaciones requeridas:</strong>
                <ul style={{ marginBottom: 0 }}>
                  <li>Todos los campos marcados con (*) son obligatorios</li>
                  <li>El nombre debe tener entre 3 y 50 caracteres</li>
                  <li>El nombre debe ser único (no se permiten duplicados)</li>
                  <li>Debe seleccionar al menos una etiqueta</li>
                  <li>Debe seleccionar al menos una especialidad</li>
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
                {t("category:maintenance.buttons.create")}
              </Button>
            </Grid>
          </Grid>
        </TabPanel>

        {/* TAB: ACTUALIZAR CATEGORÍA */}
        <TabPanel value={currentTab} index={1}>
          <Typography variant="h6" gutterBottom>
            {t("category:maintenance.buttons.update")}
          </Typography>

          <Grid container spacing={3} sx={{ mt: 1 }}>
            {/* Selector de categoría */}
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.id_categoria}>
                <InputLabel>
                  {t("category:maintenance.fields.selectCategory")} *
                </InputLabel>
                <Select
                  value={updateForm.id_categoria}
                  onChange={(e) => {
                    handleUpdateChange("id_categoria", e.target.value);
                    handleSelectCategoryToUpdate(e.target.value);
                  }}
                  label={`${t("category:maintenance.fields.selectCategory")} *`}
                >
                  {categorias.map((cat) => (
                    <MenuItem key={cat.id_categoria} value={cat.id_categoria}>
                      {cat.nombre_categoria} - {cat.sla_descripcion}
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

            {updateForm.id_categoria && (
              <>
                {/* Nombre de categoría */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={`${t("category:maintenance.fields.categoryName")} *`}
                    value={updateForm.nombre_categoria}
                    onChange={(e) =>
                      handleUpdateChange("nombre_categoria", e.target.value)
                    }
                    error={!!errors.nombre_categoria}
                    helperText={
                      errors.nombre_categoria ||
                      t("category:maintenance.helpers.uniqueName")
                    }
                  />
                </Grid>

                {/* SLA Asociado */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth error={!!errors.id_sla}>
                    <InputLabel>
                      {t("category:maintenance.fields.sla")} *
                    </InputLabel>
                    <Select
                      value={updateForm.id_sla}
                      onChange={(e) =>
                        handleUpdateChange("id_sla", e.target.value)
                      }
                      label={`${t("category:maintenance.fields.sla")} *`}
                    >
                      {slas.map((sla) => (
                        <MenuItem key={sla.id_sla} value={sla.id_sla}>
                          {sla.descripcion} (Respuesta: {sla.tiempo_minutos}{" "}
                          min, Resolución: {sla.tiempo_resolucion} min)
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.id_sla && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ mt: 0.5, ml: 2 }}
                      >
                        {errors.id_sla}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>

                {/* Etiquetas */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth error={!!errors.etiquetas}>
                    <InputLabel>
                      {t("category:maintenance.fields.tags")} *
                    </InputLabel>
                    <Select
                      multiple
                      value={updateForm.etiquetas}
                      onChange={(e) =>
                        handleUpdateChange("etiquetas", e.target.value)
                      }
                      input={
                        <OutlinedInput
                          label={`${t("category:maintenance.fields.tags")} *`}
                        />
                      }
                      renderValue={(selected) => (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {selected.map((value) => (
                            <Chip key={value} label={value} size="small" />
                          ))}
                        </Box>
                      )}
                    >
                      {etiquetasDisponibles.map((etiqueta) => (
                        <MenuItem key={etiqueta} value={etiqueta}>
                          {etiqueta}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.etiquetas && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ mt: 0.5, ml: 2 }}
                      >
                        {errors.etiquetas}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>

                {/* Especialidades */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth error={!!errors.especialidades}>
                    <InputLabel>
                      {t("category:maintenance.fields.specialties")} *
                    </InputLabel>
                    <Select
                      multiple
                      value={updateForm.especialidades}
                      onChange={(e) =>
                        handleUpdateChange("especialidades", e.target.value)
                      }
                      input={
                        <OutlinedInput
                          label={`${t("category:maintenance.fields.specialties")} *`}
                        />
                      }
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
                    {t("category:maintenance.buttons.update")}
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
