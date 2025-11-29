import { useContext } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import { UserContext } from "../../context/UserContext";

export function Auth(requiredRoles) {
  const location = useLocation();
  const { user, autorize, isLoading } = useContext(UserContext);

  // Mostrar loading mientras se carga el usuario desde localStorage
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Una vez cargado, verificar autorización
  if (user && autorize(requiredRoles)) {
    return <Outlet />;
  }

  return <Navigate to="/unauthorized" state={{ from: location }} />;
}
