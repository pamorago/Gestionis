import PropTypes from "prop-types";
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Rating,
  Box,
  Chip,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import { useTranslation } from "react-i18next";

export default function TopVeterinariosPanel({ data }) {
  const { t } = useTranslation();
  return (
    <Paper sx={{ p: 3, height: "100%" }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ display: "flex", alignItems: "center", gap: 1 }}
      >
        <EmojiEventsIcon color="warning" />
        {t("common:dashboard.statistics.topVeterinarians.title")}
      </Typography>
      <List>
        {data.map((vet, index) => (
          <ListItem
            key={vet.id_usuario}
            sx={{
              bgcolor: index === 0 ? "action.hover" : "transparent",
              borderRadius: 1,
              mb: 1,
            }}
          >
            <ListItemAvatar>
              <Avatar
                sx={{ bgcolor: index === 0 ? "warning.main" : "primary.main" }}
              >
                {index === 0 ? <EmojiEventsIcon /> : <LocalHospitalIcon />}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="subtitle2">
                    {vet.nombre_completo}
                  </Typography>
                  {index === 0 && (
                    <Chip
                      label={t(
                        "common:dashboard.statistics.topVeterinarians.top1"
                      )}
                      size="small"
                      color="warning"
                    />
                  )}
                </Box>
              }
              secondary={
                <Box component="span">
                  <Typography
                    variant="caption"
                    display="block"
                    component="span"
                  >
                    {vet.tickets_resueltos}{" "}
                    {t(
                      "common:dashboard.statistics.topVeterinarians.ticketsResolved"
                    )}
                  </Typography>
                  {parseFloat(vet.valoracion_promedio) > 0 && (
                    <Box
                      component="span"
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 0.5,
                        mt: 0.5,
                      }}
                    >
                      <Rating
                        value={parseFloat(vet.valoracion_promedio)}
                        readOnly
                        size="small"
                        precision={0.1}
                      />
                      <Typography variant="caption" component="span">
                        ({parseFloat(vet.valoracion_promedio).toFixed(1)} -{" "}
                        {vet.total_valoraciones}{" "}
                        {t(
                          "common:dashboard.statistics.topVeterinarians.ratings"
                        )}
                        )
                      </Typography>
                    </Box>
                  )}
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

TopVeterinariosPanel.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id_usuario: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      nombre_completo: PropTypes.string.isRequired,
      tickets_resueltos: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]).isRequired,
      valoracion_promedio: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
      total_valoraciones: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
    })
  ).isRequired,
};
