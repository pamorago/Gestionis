import { useContext, useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { Menu, MenuItem } from "@mui/material";
import { Link } from "react-router-dom";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import Tooltip from "@mui/material/Tooltip";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { UserContext } from "../../context/UserContext";
import CopyVetService from "../../services/CopyVetService";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";

export default function Header() {
  const { t } = useTranslation();
  //Obtener usuario
  const { user, decodeToken, autorize } = useContext(UserContext);
  const [userData, setUserData] = useState(decodeToken());
  useEffect(() => {
    setUserData(decodeToken());
  }, [user, decodeToken]);

  //Gestión menu usuario
  const [anchorElUser, setAnchorEl] = useState(null);
  //Gestión menu Listas (dropdown)
  const [anchorElListas, setAnchorElListas] = useState(null);
  const isListasMenuOpen = Boolean(anchorElListas);
  //Gestión menu Mantenimientos (dropdown)
  const [anchorElMantenimientos, setAnchorElMantenimientos] = useState(null);
  const isMantenimientosMenuOpen = Boolean(anchorElMantenimientos);
  //Abierto menu usuario
  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  //Cerrado menu usuario
  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };
  //Abierto menu Listas
  const handleListasMenuOpen = (event) => {
    setAnchorElListas(event.currentTarget);
  };
  //Cerrado menu Listas
  const handleListasMenuClose = () => {
    setAnchorElListas(null);
  };
  //Abierto menu Mantenimientos
  const handleMantenimientosMenuOpen = (event) => {
    setAnchorElMantenimientos(event.currentTarget);
  };
  //Cerrado menu Mantenimientos
  const handleMantenimientosMenuClose = () => {
    setAnchorElMantenimientos(null);
  };
  //Lista enlaces menu usuario
  const userItems = [
    { name: "Login", link: "/user/login", login: false },
    { name: "Registrarse", link: "/user/create", login: false },
    { name: "Logout", link: "/user/logout", login: true },
  ];
  //Lista enlaces menu principal
  const navItems = [
    {
      name: t("createTicket"),
      link: "/ticket/create",
      roles: ["Cliente", "Veterinario", "Administrador"],
    },
    {
      name: "Calendario",
      link: "/calendar",
      roles: ["Veterinario", "Administrador"],
    },
  ];

  //Lista enlaces menu Listas (dropdown)
  const listasItems = [
    {
      name: t("tickets"),
      link: "/tickets",
      roles: ["Cliente", "Veterinario", "Administrador"],
    },
    {
      name: t("veterinarians"),
      link: "/veterinarians",
      roles: ["Administrador"],
    },
    {
      name: t("categories"),
      link: "/categories",
      roles: ["Administrador"],
    },
    {
      name: "Tablero Asignaciones",
      link: "/assignments",
      roles: ["Administrador", "Veterinario"],
    },
  ];

  //Lista enlaces menu Mantenimientos (dropdown)
  const mantenimientosItems = [
    {
      name: t("tickets"),
      link: "/maintenance/tickets",
      roles: ["Administrador"],
    },
    {
      name: t("categories"),
      link: "/maintenance/categories",
      roles: ["Administrador"],
    },
    {
      name: "Técnicos",
      link: "/maintenance/veterinarians",
      roles: ["Administrador"],
    },
  ];
  //Identificador menu principal
  const menuIdPrincipal = "menu-appbar";
  //Menu Principal
  const menuPrincipal = (
    <Box sx={{ display: { xs: "none", sm: "block" } }}>
      {/* Dropdown de Listas - Solo visible para usuarios autenticados */}
      {userData && Object.keys(userData).length > 0 && (
        <>
          <Button
            color="secondary"
            onClick={handleListasMenuOpen}
            endIcon={<ArrowDropDownIcon />}
          >
            <Typography textAlign="center">Listas</Typography>
          </Button>
          <Menu
            id="listas-menu"
            anchorEl={anchorElListas}
            open={isListasMenuOpen}
            onClose={handleListasMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            {listasItems.map((item, index) => {
              if (userData && item.roles) {
                if (autorize({ requiredRoles: item.roles })) {
                  return (
                    <MenuItem
                      key={index}
                      component={Link}
                      to={item.link}
                      onClick={handleListasMenuClose}
                    >
                      {item.name}
                    </MenuItem>
                  );
                }
                return null;
              } else {
                if (item.roles == null) {
                  return (
                    <MenuItem
                      key={index}
                      component={Link}
                      to={item.link}
                      onClick={handleListasMenuClose}
                    >
                      {item.name}
                    </MenuItem>
                  );
                }
                return null;
              }
            })}
          </Menu>
        </>
      )}

      {/* Dropdown de Mantenimientos - Solo visible para Administrador */}
      {userData && autorize({ requiredRoles: ["Administrador"] }) && (
        <>
          <Button
            color="secondary"
            onClick={handleMantenimientosMenuOpen}
            endIcon={<ArrowDropDownIcon />}
          >
            <Typography textAlign="center">Mantenimientos</Typography>
          </Button>
          <Menu
            id="mantenimientos-menu"
            anchorEl={anchorElMantenimientos}
            open={isMantenimientosMenuOpen}
            onClose={handleMantenimientosMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            {mantenimientosItems.map((item, index) => {
              if (userData && item.roles) {
                if (autorize({ requiredRoles: item.roles })) {
                  return (
                    <MenuItem
                      key={index}
                      component={Link}
                      to={item.link}
                      onClick={handleMantenimientosMenuClose}
                    >
                      {item.name}
                    </MenuItem>
                  );
                }
                return null;
              } else {
                if (item.roles == null) {
                  return (
                    <MenuItem
                      key={index}
                      component={Link}
                      to={item.link}
                      onClick={handleMantenimientosMenuClose}
                    >
                      {item.name}
                    </MenuItem>
                  );
                }
                return null;
              }
            })}
          </Menu>
        </>
      )}

      {/* Otros botones del menú principal */}
      {navItems &&
        navItems.map((item, index) => {
          //if(autorize(requiredRoles:['Administrador']))
          if (userData && item.roles) {
            //Verificar rol
            if (autorize({ requiredRoles: item.roles })) {
              //Rutas con restricción
              return (
                <Button
                  key={index}
                  component={Link}
                  to={item.link}
                  color="secondary"
                >
                  <Typography textAlign="center">{item.name}</Typography>
                </Button>
              );
            }
          } else {
            if (item.roles == null) {
              //Rutas sin restricción
              return (
                <Button
                  key={index}
                  component={Link}
                  to={item.link}
                  color="secondary"
                >
                  <Typography textAlign="center">{item.name}</Typography>
                </Button>
              );
            }
          }
        })}
    </Box>
  );
  //Menu Principal responsivo
  const menuPrincipalMobile = (
    <>
      {/* Items del dropdown Listas en versión móvil - Solo para usuarios autenticados */}
      {userData && Object.keys(userData).length > 0 && (
        <>
          <MenuItem disabled>
            <Typography sx={{ fontWeight: "bold", color: "primary.main" }}>
              Listas
            </Typography>
          </MenuItem>
          {listasItems.map((item, index) => {
            if (userData && item.roles) {
              if (autorize({ requiredRoles: item.roles })) {
                return (
                  <MenuItem
                    key={`listas-${index}`}
                    component={Link}
                    to={item.link}
                    sx={{ pl: 4 }}
                  >
                    <Typography sx={{ textAlign: "center" }}>
                      {item.name}
                    </Typography>
                  </MenuItem>
                );
              }
            } else {
              if (item.roles == null) {
                return (
                  <MenuItem
                    key={`listas-${index}`}
                    component={Link}
                    to={item.link}
                    sx={{ pl: 4 }}
                  >
                    <Typography sx={{ textAlign: "center" }}>
                      {item.name}
                    </Typography>
                  </MenuItem>
                );
              }
            }
          })}
          {/* Separador */}
          <MenuItem disabled sx={{ height: 8 }} />
        </>
      )}

      {/* Items del dropdown Mantenimientos en versión móvil - Solo para Administrador */}
      {userData && autorize({ requiredRoles: ["Administrador"] }) && (
        <>
          <MenuItem disabled>
            <Typography sx={{ fontWeight: "bold", color: "primary.main" }}>
              Mantenimientos
            </Typography>
          </MenuItem>
          {mantenimientosItems.map((item, index) => {
            if (userData && item.roles) {
              if (autorize({ requiredRoles: item.roles })) {
                return (
                  <MenuItem
                    key={`mantenimientos-${index}`}
                    component={Link}
                    to={item.link}
                    sx={{ pl: 4 }}
                  >
                    <Typography sx={{ textAlign: "center" }}>
                      {item.name}
                    </Typography>
                  </MenuItem>
                );
              }
            } else {
              if (item.roles == null) {
                return (
                  <MenuItem
                    key={`mantenimientos-${index}`}
                    component={Link}
                    to={item.link}
                    sx={{ pl: 4 }}
                  >
                    <Typography sx={{ textAlign: "center" }}>
                      {item.name}
                    </Typography>
                  </MenuItem>
                );
              }
            }
          })}
          {/* Separador */}
          <MenuItem disabled sx={{ height: 8 }} />
        </>
      )}

      {/* Otros items del menú */}
      {navItems.map((page, index) => {
        if (userData && page.roles) {
          if (autorize({ requiredRoles: page.roles })) {
            return (
              <MenuItem key={index} component={Link} to={page.link}>
                <Typography sx={{ textAlign: "center" }}>
                  {page.name}
                </Typography>
              </MenuItem>
            );
          }
        } else {
          if (page.roles == null) {
            return (
              <MenuItem key={index} component={Link} to={page.link}>
                <Typography sx={{ textAlign: "center" }}>
                  {page.name}
                </Typography>
              </MenuItem>
            );
          }
        }
      })}
    </>
  );
  //Identificador menu usuario
  const userMenuId = "user-menu";
  //Menu Usuario
  const userMenu = (
    <Box sx={{ flexGrow: 0 }}>
      <IconButton
        size="large"
        edge="end"
        aria-label="account of current user"
        aria-controls={userMenuId}
        aria-haspopup="true"
        onClick={handleUserMenuOpen}
        color="inherit"
      >
        <AccountCircle />
      </IconButton>

      <Menu
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorElUser)}
        onClose={handleUserMenuClose}
      >
        {userData && (
          <MenuItem>
            <Typography variant="subtitle1" gutterBottom>
              {userData?.email}
            </Typography>
          </MenuItem>
        )}

        {userItems.map((setting, index) => {
          //Verificar las opciones del usuario
          if (setting.login && userData && Object.keys(userData).length > 0) {
            return (
              <MenuItem key={index} component={Link} to={setting.link}>
                <Typography sx={{ textAlign: "center" }}>
                  {setting.name}
                </Typography>
              </MenuItem>
            );
          } else if (!setting.login && Object.keys(userData).length == 0) {
            return (
              <MenuItem key={index} component={Link} to={setting.link}>
                <Typography sx={{ textAlign: "center" }}>
                  {setting.name}
                </Typography>
              </MenuItem>
            );
          }
        })}
      </Menu>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        color="primaryLight"
        sx={{ backgroundColor: "primaryLight.main" }}
      >
        <Toolbar>
          {/* Enlace página inicio */}
          <Tooltip title="Casos CopyVet">
            <IconButton
              size="large"
              edge="end"
              component="a"
              href="/"
              aria-label="Casos CopyVet"
              color="primary"
            >
              <LiveTvIcon />
            </IconButton>
          </Tooltip>
          {/* Enlace página inicio */}
          {menuPrincipal}
          <Box sx={{ flexGrow: 1 }} />
          <Box
            sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}
          >
            <LanguageSwitcher />
          </Box>
          <div>{userMenu}</div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
