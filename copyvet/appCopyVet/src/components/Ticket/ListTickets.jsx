import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import TicketService from "../../services/TicketService";
import { UserContext } from "../../context/UserContext";
import {
  Container,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";

export default function ListTickets() {
  const { decodeToken } = useContext(UserContext);
  const userData = decodeToken() || {};
  const [tickets, setTickets] = useState([]);
  const [roleSel, setRoleSel] = useState(
    userData?.rol?.name || "Administrador"
  );
  const userId = userData?.id_usuario || userData?.sub || userData?.id || null;

  useEffect(() => {
    if (!userId) {
      // Sin usuario autenticado, mostrar todos los tickets
      TicketService.list()
        .then((r) => setTickets(Array.isArray(r.data) ? r.data : []))
        .catch(() => setTickets([]));
      return;
    }

    // Llamar al endpoint getByRol con rol y userId
    TicketService.listByRole(roleSel, userId)
      .then((r) => setTickets(Array.isArray(r.data) ? r.data : []))
      .catch(() => setTickets([]));
  }, [roleSel, userId]);

  return (
    <Container sx={{ p: 2 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          Tickets
        </Typography>
      </Box>

      <Typography variant="caption" sx={{ display: "block", mb: 2 }}>
        Usuario ID (no editable): {userId ?? "no autenticado"}
      </Typography>

      <FormControl sx={{ mb: 2, minWidth: 200 }}>
        <InputLabel id="role-select-label">Ver tickets como</InputLabel>
        <Select
          labelId="role-select-label"
          value={roleSel}
          label="Ver tickets como"
          onChange={(e) => setRoleSel(e.target.value)}
        >
          <MenuItem value={"Administrador"}>Administrador (todos)</MenuItem>
          <MenuItem value={"Cliente"}>Cliente (mis tickets)</MenuItem>
          <MenuItem value={"Veterinario"}>Técnico (asignados)</MenuItem>
        </Select>
      </FormControl>

      <List>
        {tickets.map((t) => (
          <div key={t.id_ticket}>
            <ListItem component={Link} to={`/ticket/${t.id_ticket}`} button>
              <ListItemText
                primary={`#${t.id_ticket} - ${t.titulo}`}
                secondary={`${t.nombre_categoria || ""} • ${t.nombre_estado || ""} • ${
                  t.cliente || t.nombre_creador || ""
                } • ${t.fecha_cita || t.fecha_creacion || ""}`}
              />
            </ListItem>
            <Divider />
          </div>
        ))}
        {tickets.length === 0 && (
          <Typography sx={{ p: 2 }}>
            No se encontraron tickets para mostrar.
          </Typography>
        )}
      </List>
    </Container>
  );
}
