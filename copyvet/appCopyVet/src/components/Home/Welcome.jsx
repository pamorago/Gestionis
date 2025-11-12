import { Container, Typography, Box, Paper, Grid, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PetsIcon from "@mui/icons-material/Pets";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import AssignmentIcon from "@mui/icons-material/Assignment";
import veteImagen from "../../assets/veterinaria-dra-cats.jpg";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <Container sx={{ p: 4 }} maxWidth="lg">
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
          Sistema de Gestión de Tickets Veterinarios
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Conectamos a dueños de mascotas con veterinarios profesionales de
          manera eficiente y organizada
        </Typography>
      </Box>

      {/* Quiénes Somos */}
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={7}>
            <Typography variant="h4" gutterBottom color="primary">
              ¿Quiénes Somos?
            </Typography>
            <Typography variant="body1" paragraph>
              CopyVet es una plataforma innovadora diseñada para facilitar la
              comunicación y gestión de servicios veterinarios. Nuestro sistema
              de tickets permite a los dueños de mascotas crear solicitudes de
              atención médica de manera rápida y sencilla, mientras que los
              veterinarios pueden gestionar su carga de trabajo de forma
              eficiente.
            </Typography>
            <Typography variant="body1" paragraph>
              Con más de 5 años de experiencia en el sector, nos hemos
              consolidado como la solución líder para clínicas veterinarias que
              buscan optimizar sus procesos y ofrecer un mejor servicio a sus
              clientes.
            </Typography>
          </Grid>
          <Grid item xs={12} md={5}>
            <Box
              component="img"
              src={veteImagen}
              alt="Sistema de tickets veterinarios"
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
          Nuestros Servicios
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <PetsIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h6">Atención Personalizada</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Cada mascota es única. Nuestro sistema permite registrar
                información detallada de cada paciente, incluyendo historial
                médico, raza, edad y condiciones especiales.
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
                <Typography variant="h6">Veterinarios Certificados</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Contamos con un equipo de veterinarios altamente calificados y
                especializados en diversas áreas como medicina interna, cirugía,
                dermatología y más.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <AssignmentIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h6">Gestión de Tickets</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Sistema inteligente de asignación de tickets que prioriza casos
                urgentes y distribuye la carga de trabajo equitativamente entre
                veterinarios.
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
                <Typography variant="h6">Soporte 24/7</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Nuestro equipo de atención al cliente está disponible las 24
                horas del día, los 7 días de la semana para resolver cualquier
                duda o emergencia.
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
              Nuestra Misión
            </Typography>
            <Typography variant="body1">
              Proporcionar una plataforma tecnológica que mejore la calidad de
              atención veterinaria, facilitando la comunicación entre clientes y
              profesionales, optimizando procesos y garantizando el bienestar de
              las mascotas.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: "100%" }}>
            <Typography variant="h5" gutterBottom color="primary">
              Nuestra Visión
            </Typography>
            <Typography variant="body1">
              Ser la plataforma líder en gestión de servicios veterinarios en
              América Latina, reconocida por nuestra innovación tecnológica,
              excelencia en el servicio y compromiso con el bienestar animal.
            </Typography>
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
          ¿Listo para comenzar?
        </Typography>
        <Typography variant="body1" color="white" paragraph>
          Únete a cientos de clientes satisfechos que confían en CopyVet
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={() => navigate("/user/create")}
        >
          Registrarse Ahora
        </Button>
      </Box>
    </Container>
  );
}
