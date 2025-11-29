import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { UserContext } from "../../context/UserContext";

export default function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);
  const saveUser = (user) => {
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
    setIsAuthenticated(true);
  };

  const clearUser = () => {
    setUser({});
    localStorage.removeItem("user");
    setIsAuthenticated(false);
  };
  const decodeToken = () => {
    if (!user) return {};
    try {
      // If user is a raw token string
      if (typeof user === "string") {
        return jwtDecode(user);
      }
      // If user is an object that contains a token property
      if (typeof user === "object") {
        const token =
          user.token || user.accessToken || user.jwt || user.tokenJwt;
        if (typeof token === "string") return jwtDecode(token);
        // If the object already looks like decoded token (contains rol or correo/email), return it
        if (user.rol || user.correo || user.email) return user;
      }
    } catch (e) {
      // decode failed, return empty object
      // keep a console message for easier debugging
      console.error("decodeToken error:", e);
    }
    return {};
  };

  //requiredRoles=['Administrador','Cliente']
  const autorize = ({ requiredRoles }) => {
    const userData = decodeToken();
    if (!userData || !requiredRoles) return false;

    // derive role name from various possible token shapes
    let roleName = null;
    if (userData.rol) {
      if (typeof userData.rol === "string") roleName = userData.rol;
      else if (userData.rol.name) roleName = userData.rol.name;
    }
    if (!roleName && userData.role) {
      if (typeof userData.role === "string") roleName = userData.role;
      else if (userData.role.name) roleName = userData.role.name;
    }
    if (!roleName && Array.isArray(userData.roles) && userData.roles.length) {
      const r = userData.roles[0];
      roleName = typeof r === "string" ? r : r.name || null;
    }
    if (!roleName) roleName = userData.rolName || userData.rol_nombre || null;

    if (typeof roleName === "string") {
      const rn = roleName.trim().toLowerCase();
      return requiredRoles.some((rr) => rr.toLowerCase() === rn);
    }

    return false;
  };

  UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };
  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        saveUser,
        clearUser,
        autorize,
        decodeToken,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
