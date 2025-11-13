import { Container, Typography, Box, Paper, Grid, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PetsIcon from "@mui/icons-material/Pets";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";
import veteImagen from "../../assets/veterinaria-dra-cats.jpg";

export default function Welcome() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Container sx={{ p: 4 }} maxWidth="lg">
      {/* Language Switcher in top right */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <LanguageSwitcher />
      </Box>

      {/* Hero Section */}
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography
          component="h1"
          variant="h2"
          color="primary"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          🐾 CopyVet
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          {t("veterinaryTicketManagement")}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {t("connectPetOwners")}
        </Typography>
      </Box>

      {/* Quiénes Somos */}
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={7}>
            <Typography variant="h4" gutterBottom color="primary">
              {t("whoWeAre")}?
            </Typography>
            <Typography variant="body1" paragraph>
              {t("aboutDescription1")}
            </Typography>
            <Typography variant="body1" paragraph>
              {t("aboutDescription2")}
              buscan optimizar sus procesos y ofrecer un mejor servicio a sus
              clientes.
            </Typography>
          </Grid>
          <Grid item xs={12} md={5}>
            <Box
              component="img"
              src={veteImagen}
              alt={t("veterinarySystemAlt")}
              sx={{
                width: "100%",
                height: "auto",
                borderRadius: 2,
                boxShadow: 3,
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Características */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom color="primary" align="center">
          {t("ourServices")}
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <PetsIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h6">{t("personalizedCare")}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {t("personalizedCareDescription")}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <LocalHospitalIcon
                  color="primary"
                  sx={{ fontSize: 40, mr: 2 }}
                />
                <Typography variant="h6">
                  {t("certifiedVeterinarians")}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {t("certifiedVeterinariansDescription")}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <AssignmentIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h6">{t("ticketManagement")}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {t("ticketManagementDescription")}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <SupportAgentIcon
                  color="primary"
                  sx={{ fontSize: 40, mr: 2 }}
                />
                <Typography variant="h6">{t("support247")}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {t("support247Description")}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Misión y Visión */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: "100%" }}>
            <Typography variant="h5" gutterBottom color="primary">
              {t("ourMission")}
            </Typography>
            <Typography variant="body1">{t("missionDescription")}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: "100%" }}>
            <Typography variant="h5" gutterBottom color="primary">
              {t("ourVision")}
            </Typography>
            <Typography variant="body1">{t("visionDescription")}</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Call to Action */}
      <Box
        sx={{
          textAlign: "center",
          mt: 6,
          p: 4,
          bgcolor: "primary.main",
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" color="white" gutterBottom>
          {t("readyToStart")}?
        </Typography>
        <Typography variant="body1" color="white" paragraph>
          {t("joinSatisfiedClients")}
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={() => navigate("/user/create")}
        >
          {t("registerNow")}
        </Button>
      </Box>
    </Container>
  );
}
