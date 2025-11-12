import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import Welcome from "./Welcome";
import Dashboard from "./Dashboard";

export default function Home() {
  const { decodeToken, autorize } = useContext(UserContext);
  const userData = decodeToken() || {};

  const getUserRole = () => {
    if (typeof userData.rol === "string") return userData.rol;
    if (userData.rol && userData.rol.name) return userData.rol.name;
    if (userData.role) return userData.role;
    if (userData.nombre_rol) return userData.nombre_rol;
    return "";
  };

  const userRole = getUserRole();
  const isAdmin =
    userRole === "Administrador" ||
    autorize?.({ requiredRoles: ["Administrador"] });

  if (isAdmin) {
    return <Dashboard />;
  }

  return <Welcome />;
}
