import React, { useEffect, useState } from "react";
import CategoriaService from "../../services/CategoriaService";
import {
  Container,
  List,
  ListItem,
  ListItemText,
  Divider,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

export default function ListCategories() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    CategoriaService.list()
      .then((r) => setItems(Array.isArray(r.data) ? r.data : []))
      .catch((err) => {
        console.error("Error fetching categories:", err);
        setItems([]);
      });
  }, []);

  return (
    <Container sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Categorías
      </Typography>
      <List>
        {items.map((c) => (
          <React.Fragment key={c.id_categoria}>
            <ListItem
              component={Link}
              to={`/category/${c.id_categoria}`}
              button
            >
              <ListItemText
                primary={c.nombre_categoria}
                secondary={`${c.sla_descripcion ? c.sla_descripcion + " • " : ""}${c.tiempo_minutos ? "Resp: " + c.tiempo_minutos + "min" : ""}`}
              />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
        {items.length === 0 && (
          <Typography sx={{ p: 2 }}>No hay categorías disponibles.</Typography>
        )}
      </List>
    </Container>
  );
}
