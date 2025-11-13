import { useState } from "react";
import { Box, Container, Typography, Paper, Tabs, Tab } from "@mui/material";

// eslint-disable-next-line react/prop-types
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`maintenance-tabpanel-${index}`}
      aria-labelledby={`maintenance-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function MaintenanceVeterinarian() {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Mantenimiento de Veterinarios
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: "divider", mt: 3 }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            aria-label="Tabs de mantenimiento de veterinarios"
          >
            <Tab label="Crear" id="maintenance-tab-0" />
            <Tab label="Actualizar" id="maintenance-tab-1" />
          </Tabs>
        </Box>

        <TabPanel value={currentTab} index={0}>
          <Typography variant="h6" gutterBottom>
            Crear Veterinario
          </Typography>
          {/* Aquí irá el formulario de creación */}
          <Box sx={{ mt: 2 }}>
            <Typography color="text.secondary">
              Formulario de creación de veterinario
            </Typography>
          </Box>
        </TabPanel>

        <TabPanel value={currentTab} index={1}>
          <Typography variant="h6" gutterBottom>
            Actualizar Veterinario
          </Typography>
          {/* Aquí irá el formulario de actualización */}
          <Box sx={{ mt: 2 }}>
            <Typography color="text.secondary">
              Formulario de actualización de veterinario
            </Typography>
          </Box>
        </TabPanel>
      </Paper>
    </Container>
  );
}
