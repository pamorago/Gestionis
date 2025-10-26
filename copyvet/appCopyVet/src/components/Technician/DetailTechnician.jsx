import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import VeterinarioService from "../../services/VeterinarioService";
import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@mui/material";

export default function DetailTechnician() {
  const { id } = useParams();
  const [tech, setTech] = useState(null);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    if (!id) return;

    // Cargar detalles del veterinario y sus tickets
    Promise.all([VeterinarioService.get(id), VeterinarioService.getTickets(id)])
      .then(([techResponse, ticketsResponse]) => {
        setTech(techResponse.data || techResponse.data?.[0] || null);
        setTickets(
          Array.isArray(ticketsResponse.data) ? ticketsResponse.data : []
        );
      })
      .catch((err) => {
        console.error("Error loading technician details:", err);
        setTech(null);
        setTickets([]);
      });
  }, [id]);

  if (!tech) return <Container sx={{ p: 2 }}>Cargando técnico...</Container>;

  return (
    <Container sx={{ p: 2 }}>
      <Typography variant="h4">
        {tech.nombre_veterinario || tech.nombre_completo || "Técnico"}
      </Typography>

      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle1">Contacto</Typography>
        <Typography>{tech.correo}</Typography>
        <Typography>{tech.telefono}</Typography>

        <Typography variant="subtitle1" sx={{ mt: 1 }}>
          Especialidades
        </Typography>
        <Typography>{tech.especialidad || "No disponible"}</Typography>

        <Paper sx={{ p: 2, mt: 3 }}>
          <Typography variant="h6">Carga de trabajo</Typography>
          <Typography>
            Total tickets: {tech.total_tickets ?? tech.tickets_activos ?? "-"}
          </Typography>
          <Typography>Abiertos: {tech.tickets_abiertos ?? "-"}</Typography>
          <Typography>En proceso: {tech.tickets_en_proceso ?? "-"}</Typography>
          <Typography>Cerrados: {tech.tickets_cerrados ?? "-"}</Typography>
        </Paper>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">Tickets asignados</Typography>
          <List>
            {tickets.map((t) => (
              <ListItem
                key={t.id_ticket}
                component={Link}
                to={`/ticket/${t.id_ticket}`}
              >
                <ListItemText
                  primary={t.titulo}
                  secondary={`${t.nombre_categoria} • ${t.nombre_estado} • ${t.fecha_cita || t.fecha_creacion || ""}`}
                />
              </ListItem>
            ))}
            {tickets.length === 0 && (
              <Typography sx={{ p: 2 }}>No hay tickets asignados.</Typography>
            )}
          </List>
        </Box>
      </Box>
    </Container>
  );
}
