import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import VeterinarioService from "../../services/VeterinarioService";
import {
  Container,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";

export default function ListTechnicians() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    VeterinarioService.list()
      .then((r) => setItems(Array.isArray(r.data) ? r.data : []))
      .catch((err) => {
        console.error("Error fetching veterinarios:", err);
        setItems([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <Container sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Técnicos / Veterinarios
      </Typography>
      <List>
        {items.map((v) => (
          <div key={v.id_veterinario || v.id_usuario || v.id}>
            <ListItem
              component={Link}
              to={`/technician/${v.id_veterinario || v.id}`}
              button
            >
              <ListItemText
                primary={v.nombre_veterinario || v.nombre_completo || v.nombre}
                secondary={`${v.correo ? v.correo + " • " : ""}${v.telefono || ""} ${v.tickets_activos ? "• Activos: " + v.tickets_activos : ""}`}
              />
            </ListItem>
            <Divider />
          </div>
        ))}
        {loading && <Typography sx={{ p: 2 }}>Cargando técnicos...</Typography>}
        {!loading && items.length === 0 && (
          <Typography sx={{ p: 2 }}>No hay técnicos disponibles.</Typography>
        )}
      </List>
    </Container>
  );
}
