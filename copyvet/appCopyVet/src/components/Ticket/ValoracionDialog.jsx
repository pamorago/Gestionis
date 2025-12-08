import { useState } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Rating,
  Alert,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

export default function ValoracionDialog({
  open,
  onClose,
  onSubmit,
  ticketTitulo,
}) {
  const [valoracion, setValoracion] = useState(0);
  const [comentario, setComentario] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    // Validar que haya seleccionado al menos 1 estrella
    if (valoracion === 0) {
      setError("Por favor, selecciona una valoración");
      return;
    }

    // Enviar valoración
    onSubmit({
      valoracion,
      comentario_valoracion: comentario.trim() || null,
    });

    // Limpiar formulario y cerrar diálogo inmediatamente
    setValoracion(0);
    setComentario("");
    setError("");
    onClose();
  };

  const handleClose = () => {
    setValoracion(0);
    setComentario("");
    setError("");
    onClose();
  };

  const labels = {
    1: "Muy insatisfecho",
    2: "Insatisfecho",
    3: "Normal",
    4: "Satisfecho",
    5: "Muy satisfecho",
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Valorar Servicio</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Ticket: {ticketTitulo}
          </Typography>

          <Box sx={{ mt: 3, mb: 2 }}>
            <Typography component="legend" gutterBottom>
              ¿Cómo calificarías el servicio recibido?
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                mt: 1,
              }}
            >
              <Rating
                name="valoracion"
                value={valoracion}
                onChange={(event, newValue) => {
                  setValoracion(newValue);
                  setError("");
                }}
                size="large"
                emptyIcon={
                  <StarIcon style={{ opacity: 0.3 }} fontSize="inherit" />
                }
              />
              {valoracion !== null && (
                <Typography variant="body2" color="text.secondary">
                  {labels[valoracion] || ""}
                </Typography>
              )}
            </Box>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            label="Comentario (opcional)"
            multiline
            rows={4}
            fullWidth
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            placeholder="Cuéntanos sobre tu experiencia..."
            sx={{ mt: 2 }}
            helperText={`${comentario.length}/500 caracteres`}
            inputProps={{ maxLength: 500 }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} color="inherit">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Enviar Valoración
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ValoracionDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  ticketTitulo: PropTypes.string.isRequired,
};
