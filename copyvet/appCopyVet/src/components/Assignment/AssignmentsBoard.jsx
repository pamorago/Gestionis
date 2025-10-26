import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import VeterinarioService from "../../services/VeterinarioService";
import { Container, Grid, Paper, Typography, Box, Chip } from "@mui/material";
import { Link } from "react-router-dom";

// Calcula color del chip según tiempo restante SLA
function slaColor(remainingMinutes) {
  if (remainingMinutes <= 0) return "error";
  if (remainingMinutes < 60) return "warning";
  return "success";
}

// Componente para mostrar tickets de un veterinario
function VeterinarianTickets({ id }) {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    if (!id) return;

    VeterinarioService.getTickets(id)
      .then((r) => setTickets(Array.isArray(r.data) ? r.data : []))
      .catch((err) => {
        console.error("Error loading vet tickets:", err);
        setTickets([]);
      });
  }, [id]);

  return (
    <Box>
      {tickets.map((t) => {
        // tiempo restante: sla_resolucion - tiempo_transcurrido (en min)
        const remaining =
          (t.sla_resolucion ?? 0) - (t.tiempo_transcurrido ?? 0);
        return (
          <Paper key={t.id_ticket} sx={{ p: 1, mt: 1, bgcolor: "grey.50" }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <div>
                <Typography variant="subtitle2">
                  #{t.id_ticket} - {t.titulo}
                </Typography>
                <Typography variant="caption" display="block">
                  {t.nombre_categoria} • {t.nombre_estado}
                </Typography>
              </div>
              <Chip
                size="small"
                color={slaColor(remaining)}
                label={`${remaining} min`}
                component={Link}
                to={`/ticket/${t.id_ticket}`}
                clickable
              />
            </Box>
          </Paper>
        );
      })}
      {tickets.length === 0 && (
        <Typography variant="body2" sx={{ pt: 1, color: "text.secondary" }}>
          Sin tickets asignados
        </Typography>
      )}
    </Box>
  );
}

VeterinarianTickets.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};


export default function AssignmentsBoard() {
  const [vets, setVets] = useState([]);

  useEffect(() => {
    VeterinarioService.list()
      .then((r) => setVets(Array.isArray(r.data) ? r.data : []))
      .catch((err) => {
        console.error("Error loading vets:", err);
        setVets([]);
      });
  }, []);

  return (
    <Container sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Tablero de Asignaciones
      </Typography>

      <Grid container spacing={2}>
        {vets.map((v) => (
          <Grid item xs={12} md={4} key={v.id_veterinario || v.id}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">
                {v.nombre_veterinario || v.nombre_completo}
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Tickets activos: {v.tickets_activos ?? "-"}
              </Typography>

              <Box sx={{ mt: 2 }}>
                <VeterinarianTickets id={v.id_veterinario || v.id} />
              </Box>
            </Paper>
          </Grid>
        ))}
        {vets.length === 0 && (
          <Grid item xs={12}>
            <Typography sx={{ p: 2 }}>
              No hay veterinarios disponibles.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}
