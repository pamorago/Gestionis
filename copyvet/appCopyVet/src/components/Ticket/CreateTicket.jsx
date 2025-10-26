import { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TicketService from "../../services/TicketService";
import UserService from "../../services/UserService";
import CategoriaService from "../../services/CategoriaService";
import CopyVetService from "../../services/CopyVetService";
import { UserContext } from "../../context/UserContext";
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
  const navigate = useNavigate();
  const location = useLocation();
  const { decodeToken } = useContext(UserContext);
  const { decodeToken, autorize } = useContext(UserContext);
  const userData = decodeToken() || {};
  const userId = userData?.id_usuario || userData?.sub || userData?.id;

  // Determinar si el usuario es Cliente
  const getUserRole = () => {
    if (typeof userData.rol === "string") return userData.rol;
    if (userData.rol && userData.rol.name) return userData.rol.name;
    if (userData.role) return userData.role;
    if (userData.nombre_rol) return userData.nombre_rol;
    return "";
  };
  const userRole = getUserRole();
  const isCliente =
    userRole === "Cliente" || autorize?.({ requiredRoles: ["Cliente"] });

  const [vets, setVets] = useState([]);
  const [cats, setCats] = useState([
    { id_categoria: 1, nombre_categoria: "Vacunación", id_sla: 3 },
    { id_categoria: 2, nombre_categoria: "Cirugía menor", id_sla: 2 },
    { id_categoria: 3, nombre_categoria: "Desparasitación", id_sla: 4 },
    { id_categoria: 4, nombre_categoria: "Consulta general", id_sla: 3 },
    { id_categoria: 5, nombre_categoria: "Emergencia", id_sla: 1 },
    { id_categoria: 6, nombre_categoria: "Cirugía mayor", id_sla: 1 },
    { id_categoria: 7, nombre_categoria: "Especies Exóticas", id_sla: 2 },
    { id_categoria: 8, nombre_categoria: "Dermatología", id_sla: 3 },
    { id_categoria: 9, nombre_categoria: "Traumatología", id_sla: 2 },
    { id_categoria: 10, nombre_categoria: "Control rutinario", id_sla: 4 },
  ]);
  const [mascotas, setMascotas] = useState([
    {
      id_mascota: 1,
      nombre: "Max",
      especie: "Perro",
      raza: "Labrador",
      nombre_responsable: "María López",
    },
    {
      id_mascota: 2,
      nombre: "Luna",
      especie: "Gato",
      raza: "Siamés",
      nombre_responsable: "Carmen Rojas",
    },
    {
      id_mascota: 3,
      nombre: "Rocky",
      especie: "Perro",
      raza: "Bulldog",
      nombre_responsable: "Juan Vargas",
    },
    {
      id_mascota: 4,
      nombre: "Milo",
      especie: "Conejo",
      raza: "Mini Lop",
      nombre_responsable: "Pedro Jiménez",
    },
    {
      id_mascota: 5,
      nombre: "Nina",
      especie: "Gato",
      raza: "Persa",
      nombre_responsable: "Ana Martinez",
    },
    {
      id_mascota: 6,
      nombre: "Toby",
      especie: "Perro",
      raza: "Golden Retriever",
      nombre_responsable: "Roberto Sánchez",
    },
    {
      id_mascota: 7,
      nombre: "Bella",
      especie: "Gato",
      raza: "Maine Coon",
      nombre_responsable: "Carmen Rojas",
    },
    {
      id_mascota: 8,
      nombre: "Zeus",
      especie: "Perro",
      raza: "Pastor Alemán",
      nombre_responsable: "Juan Vargas",
    },
    {
      id_mascota: 9,
      nombre: "Lucas",
      especie: "Perro",
      raza: "Poodle",
      nombre_responsable: "Ana Martinez",
    },
    {
      id_mascota: 10,
      nombre: "Coco",
      especie: "Ave",
      raza: "Loro Gris",
      nombre_responsable: "Roberto Sánchez",
    },
  ]);
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
      .then(([usersRes, catsRes, mascsRes]) => {
        console.log("Datos cargados:", {
          users: usersRes.data,
          cats: catsRes.data,
          mascs: mascsRes.data,
        });
        // Filtrar solo usuarios con correo @copyvet.com
        let veterinarios = Array.isArray(usersRes.data)
          ? usersRes.data.filter((u) =>
              (u.email || "").toLowerCase().endsWith("@copyvet.com")
            )
          : [];
        if (veterinarios.length === 0 && Array.isArray(usersRes.data)) {
          console.warn(
            "No usuarios con @copyvet.com, mostrando todos:",
            usersRes.data
          );
          veterinarios = usersRes.data;
        }
        // Si la API no responde con categorías, usa las del estado inicial
        const categorias =
          Array.isArray(catsRes.data) && catsRes.data.length > 0
            ? catsRes.data
            : cats;
        // Si la API no responde con mascotas, deja el array vacío
        const mascotasList =
          Array.isArray(mascsRes.data) && mascsRes.data.length > 0
            ? mascsRes.data
            : mascotas;

        setVets(veterinarios);
        setCats(categorias);
        setMascotas(mascotasList);

        // Obtener los parámetros de la URL después de cargar los datos
        const params = new URLSearchParams(location.search);
        const pre = {};
        if (params.get("id_mascota")) {
          const mascotaId = params.get("id_mascota");
          pre.id_mascota = mascotaId;
          const mascota = mascotasList.find(
            (m) => String(m.id_mascota) === String(mascotaId)
          );
          if (mascota) {
            pre.titulo = `Consulta para ${mascota.nombre}`;
            pre.descripcion =
              params.get("descripcion") ||
              `Atención para ${mascota.nombre} - ${mascota.especie} ${mascota.raza || ""}`;
          }
        }

        if (params.get("id_categoria")) {
          const categoriaId = params.get("id_categoria");
          pre.id_categoria = categoriaId;
          // Buscar el veterinario apropiado para esta categoría
          const categoria = categorias.find(
            (c) => String(c.id_categoria) === String(categoriaId)
          );
          if (categoria) {
            const nombreCategoria = (
              categoria.nombre_categoria || ""
            ).toLowerCase();
            let veterinarioAsignado = null;

            if (nombreCategoria.includes("exótica")) {
              veterinarioAsignado = veterinarios.find((v) =>
                (v.especialidad || "").toLowerCase().includes("exótica")
              );
            } else if (nombreCategoria.includes("dermatología")) {
              veterinarioAsignado = veterinarios.find((v) =>
                (v.especialidad || "").toLowerCase().includes("dermatolog")
              );
            } else if (
              nombreCategoria.includes("traumatología") ||
              nombreCategoria.includes("cirugía")
            ) {
              veterinarioAsignado = veterinarios.find(
                (v) =>
                  (v.especialidad || "")
                    .toLowerCase()
                    .includes("traumatolog") ||
                  (v.especialidad || "").toLowerCase().includes("cirug")
              );
            }

            if (veterinarioAsignado) {
              pre.id_asignado_a_usuario =
                veterinarioAsignado.id_veterinario ||
                veterinarioAsignado.id_usuario;
            } else if (veterinarios.length > 0) {
              // Si no hay especialista, asignar al veterinario con menos carga
              veterinarioAsignado = veterinarios.reduce((prev, curr) => {
                const prevCount = prev.tickets_activos || 0;
                const currCount = curr.tickets_activos || 0;
                return prevCount <= currCount ? prev : curr;
              });
              pre.id_asignado_a_usuario =
                veterinarioAsignado.id_veterinario ||
                veterinarioAsignado.id_usuario;
            }
          }
        }

        // Establecer fecha actual como valor predeterminado
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        pre.fecha_cita = now.toISOString().slice(0, 16);

        setForm((f) => ({ ...f, ...pre }));
      })
      .catch((err) => {
        console.error("Error loading form data:", err);
        setError("Error cargando datos necesarios para el formulario");
      });
  }, [location.search]);

  // Asignar veterinario automáticamente según la categoría
  const asignarVeterinarioPorCategoria = (categoriaId) => {
    // Buscar la categoría
    const categoria = cats.find(
      (c) => String(c.id_categoria) === String(categoriaId)
    );
    if (!categoria) return;

    // Encontrar un veterinario apropiado según la categoría
    const nombreCategoria = (categoria.nombre_categoria || "").toLowerCase();
    let veterinarioAsignado = null;

    if (nombreCategoria.includes("exótica")) {
      // Buscar veterinario de especies exóticas
      veterinarioAsignado = vets.find((v) =>
        (v.especialidad || "").toLowerCase().includes("exótica")
      );
    } else if (nombreCategoria.includes("dermatología")) {
      veterinarioAsignado = vets.find((v) =>
        (v.especialidad || "").toLowerCase().includes("dermatolog")
      );
    } else if (
      nombreCategoria.includes("traumatología") ||
      nombreCategoria.includes("cirugía")
    ) {
      veterinarioAsignado = vets.find(
        (v) =>
          (v.especialidad || "").toLowerCase().includes("traumatolog") ||
          (v.especialidad || "").toLowerCase().includes("cirug")
      );
    }

    // Si no se encontró un especialista, asignar al veterinario con menos carga
    if (!veterinarioAsignado) {
      veterinarioAsignado = vets.reduce((prev, current) => {
        const prevActivos = prev.tickets_activos || 0;
        const currentActivos = current.tickets_activos || 0;
        return prevActivos <= currentActivos ? prev : current;
      }, vets[0]);
    }

    if (veterinarioAsignado) {
      setForm((f) => ({
        ...f,
        id_asignado_a_usuario:
          veterinarioAsignado.id_veterinario || veterinarioAsignado.id_usuario,
      }));
    }
  };

  // Efecto para actualizar el veterinario cuando cambie la categoría
  useEffect(() => {
    if (!form.id_categoria || !cats.length || !vets.length) return;
    const categoria = cats.find(
      (c) => String(c.id_categoria) === String(form.id_categoria)
    );
    if (!categoria) return;
    const nombreCategoria = (categoria.nombre_categoria || "").toLowerCase();
    let veterinarioAsignado = null;
    if (nombreCategoria.includes("exótica")) {
      veterinarioAsignado = vets.find((v) =>
        (v.especialidad || "").toLowerCase().includes("exótica")
      );
    } else if (nombreCategoria.includes("dermatología")) {
      veterinarioAsignado = vets.find((v) =>
        (v.especialidad || "").toLowerCase().includes("dermatolog")
      );
    } else if (
      nombreCategoria.includes("traumatología") ||
      nombreCategoria.includes("cirugía")
    ) {
      veterinarioAsignado = vets.find(
        (v) =>
          (v.especialidad || "").toLowerCase().includes("traumatolog") ||
          (v.especialidad || "").toLowerCase().includes("cirug")
      );
    }
    if (!veterinarioAsignado && vets.length > 0) {
      veterinarioAsignado = vets.reduce((prev, curr) => {
        const prevCount = prev.tickets_activos || 0;
        const currCount = curr.tickets_activos || 0;
        return prevCount <= currCount ? prev : curr;
      });
    }
    if (veterinarioAsignado) {
      setForm((f) => ({
        ...f,
        id_asignado_a_usuario: String(
          veterinarioAsignado.id_veterinario || veterinarioAsignado.id_usuario
        ),
      }));
    }
  }, [form.id_categoria, cats, vets]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!userId) {
      setError("Usuario no autenticado");
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
      // Solo incluir veterinario asignado si NO es Cliente o si se proporcionó
      id_asignado_a_usuario: form.id_asignado_a_usuario
        ? Number(form.id_asignado_a_usuario)
        : null,
    };

    try {
      // Si hay un nombre de mascota en los parámetros, crear nueva mascota
      const params = new URLSearchParams(location.search);
      const nombreMascota = params.get("nombre_mascota");
      let mascotaId = form.id_mascota;

      if (!mascotaId && nombreMascota) {
        const mascotaData = {
          nombre: nombreMascota,
          especie: params.get("especie") || "",
          raza: params.get("raza") || "",
          id_responsable: userId,
          nombre_responsable: userData.nombre_completo || "",
          correo_responsable: userData.correo || userData.email || "",
          telefono_responsable: userData.telefono || "",
        };

        try {
          const resMascota = await CopyVetService.createMascota(mascotaData);
          if (resMascota.data?.id_mascota) {
            mascotaId = resMascota.data.id_mascota;
          }
        } catch (error) {
          console.error("Error creando mascota:", error);
          setError("Error al crear la mascota. Por favor intente nuevamente.");
          return;
        }
      }

      // Asignar veterinario automáticamente según la categoría
      let veterinarioAsignado = null;
      const categoria = cats.find(
        (c) => String(c.id_categoria) === String(form.id_categoria)
      );
      if (categoria) {
        const nombreCategoria = (
          categoria.nombre_categoria || ""
        ).toLowerCase();
        if (nombreCategoria.includes("exótica")) {
          veterinarioAsignado = vets.find((v) =>
            (v.especialidad || "").toLowerCase().includes("exótica")
          );
        } else if (nombreCategoria.includes("dermatología")) {
          veterinarioAsignado = vets.find((v) =>
            (v.especialidad || "").toLowerCase().includes("dermatolog")
          );
        } else if (
          nombreCategoria.includes("traumatología") ||
          nombreCategoria.includes("cirugía")
        ) {
          veterinarioAsignado = vets.find(
            (v) =>
              (v.especialidad || "").toLowerCase().includes("traumatolog") ||
              (v.especialidad || "").toLowerCase().includes("cirug")
          );
        }
        if (!veterinarioAsignado && vets.length > 0) {
          veterinarioAsignado = vets.reduce((prev, curr) => {
            const prevCount = prev.tickets_activos || 0;
            const currCount = curr.tickets_activos || 0;
            return prevCount <= currCount ? prev : curr;
          });
        }
      }

      const payload = {
        titulo: form.titulo,
        descripcion: form.descripcion,
        fecha_cita: form.fecha_cita,
        id_estado: 1, // Asumimos 1 = Abierto
        id_categoria: Number(form.id_categoria),
        id_mascota: Number(mascotaId || form.id_mascota),
        id_creado_por_usuario: Number(userId),
        id_asignado_a_usuario: Number(
          veterinarioAsignado
            ? veterinarioAsignado.id_veterinario ||
                veterinarioAsignado.id_usuario
            : form.id_asignado_a_usuario
        ),
      };

      // Log payload for debugging
      console.log("Payload enviado a TicketService.create:", payload);
      // Crear el ticket
      const res = await TicketService.create(payload);
      const newId = res.data?.id_ticket || res.data?.id;
      if (newId) {
        navigate(`/ticket/${newId}`);
      } else {
        navigate("/tickets");
      }
    } catch (err) {
      console.error("Error creando ticket:", err);
      setError("Error al crear el ticket. Por favor intente nuevamente.");
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
            onChange={(e) => {
              const categoriaId = e.target.value;
              setForm({ ...form, id_categoria: categoriaId });
              asignarVeterinarioPorCategoria(categoriaId);
            }}
          >
            <MenuItem value="">-- Seleccionar categoría --</MenuItem>
            {cats.map((cat) => (
              <MenuItem key={cat.id_categoria} value={cat.id_categoria}>
                {cat.nombre_categoria}
                {cat.id_sla === 1 && " (SLA: Urgente)"}
                {cat.id_sla === 2 && " (SLA: Alta Prioridad)"}
                {cat.id_sla === 3 && " (SLA: Normal)"}
                {cat.id_sla === 4 && " (SLA: Baja Prioridad)"}
              </MenuItem>
            ))}
          </Select>
        </FormControl>{" "}
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
                {m.nombre} • {m.especie || "Sin especie"} •{" "}
                {m.raza || "Sin raza definida"} • Dueño:{" "}
                {m.nombre_responsable || "No registrado"}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Veterinario asignado</InputLabel>
          <Select
            value={form.id_asignado_a_usuario}
            label="Veterinario asignado"
            required
            onChange={(e) =>
              setForm({ ...form, id_asignado_a_usuario: e.target.value })
            }
          >
            <MenuItem value="">-- Seleccionar veterinario --</MenuItem>
            {vets.map((v) => (
              <MenuItem
                key={v.id_veterinario || v.id_usuario}
                value={String(v.id_veterinario || v.id_usuario)}
              >
                {v.nombre_veterinario || v.nombre_completo}
                {form.id_asignado_a_usuario ===
                String(v.id_veterinario || v.id_usuario)
                  ? " (Asignado)"
                  : ""}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Campo de Veterinario solo visible para usuarios que NO sean Cliente */}
        {!isCliente && (
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Veterinario asignado</InputLabel>
            <Select
              value={form.id_asignado_a_usuario}
              label="Veterinario asignado"
              onChange={(e) =>
                setForm({ ...form, id_asignado_a_usuario: e.target.value })
              }
            >
              <MenuItem value="">-- Sin asignar --</MenuItem>
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
        )}

        {isCliente && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Como cliente, un veterinario será asignado automáticamente a tu
            ticket.
          </Alert>
        )}

        <Box sx={{ mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
          >
            Crear Ticket
          </Button>
        </Box>
      </form>

      <Typography variant="caption" sx={{ mt: 2, display: "block" }}>
        ID Usuario : {userId ?? "no autenticado"}
      </Typography>
    </Container>
  );
}
