import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TicketService from "../../services/TicketService";
import {
  Container,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
} from "@mui/material";

function calculateSLAStatus(ticket) {
  if (!ticket.tiempo_transcurrido || !ticket.sla_resolucion) return "default";
  const remaining = ticket.sla_resolucion - ticket.tiempo_transcurrido;
  if (remaining <= 0) return "error";
  if (remaining < 60) return "warning";
  return "success";
}

export default function DetailTicket() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!id) return;

    Promise.all([TicketService.get(id), TicketService.getHistorico(id)])
      .then(([ticketResponse, historyResponse]) => {
        setTicket(ticketResponse.data || ticketResponse.data?.[0] || null);
        setHistory(
          Array.isArray(historyResponse.data) ? historyResponse.data : []
        );
      })
      .catch((err) => {
        console.error("Error loading ticket details:", err);
        setTicket(null);
        setHistory([]);
      });
  }, [id]);

  if (!ticket) return <Container sx={{ p: 2 }}>Cargando ticket...</Container>;

  const slaStatus = calculateSLAStatus(ticket);

  return (
    <Container sx={{ p: 2 }}>
      <Typography variant="h4">
        #{ticket.id_ticket} - {ticket.titulo}
        <Chip
          label={ticket.nombre_estado}
          color={slaStatus}
          size="small"
          sx={{ ml: 2 }}
        />
      </Typography>
      <Typography variant="subtitle1" sx={{ mt: 1 }}>
        {ticket.descripcion}
      </Typography>

      <Box sx={{ mt: 2 }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Detalles del ticket</Typography>
          <Typography>Estado: {ticket.nombre_estado}</Typography>
          <Typography>Prioridad: {ticket.prioridad}</Typography>
          <Typography>Cliente: {ticket.cliente}</Typography>
          <Typography>Mascota: {ticket.mascota}</Typography>
          <Typography>Categoría: {ticket.nombre_categoria}</Typography>
          <Typography>Asignado a: {ticket.asignado_a}</Typography>
          <Typography>Fecha creación: {ticket.fecha_creacion}</Typography>
          <Typography>Fecha cita: {ticket.fecha_cita}</Typography>
          <Typography>
            Tiempo transcurrido: {ticket.tiempo_transcurrido} minutos
          </Typography>
          <Typography>SLA respuesta: {ticket.sla_respuesta} minutos</Typography>
          <Typography>
            SLA resolución: {ticket.sla_resolucion} minutos
          </Typography>
        </Paper>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">Historial de cambios</Typography>
          <List>
            {history.map((h) => (
              <ListItem key={h.id_historico || h.id}>
                <ListItemText
                  primary={`${h.fecha || h.fecha_creacion || ""} - ${h.usuario || ""}`}
                  secondary={`Estado: ${h.estado || h.estado_anterior || ""} • ${h.comentario || ""}`}
                />
              </ListItem>
            ))}
            {history.length === 0 && (
              <Typography sx={{ p: 2 }}>
                No hay registros en el historial.
              </Typography>
            )}
          </List>
        </Box>
      </Box>
    </Container>
  );
}
