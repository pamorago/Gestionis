import { useContext, useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Menu, MenuItem } from "@mui/material";
import { Link } from "react-router-dom";
import Badge from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import Tooltip from "@mui/material/Tooltip";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useCart } from "../../hooks/useCart";
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

  const { cart, getCountItems } = useCart();
  const [ticketsCount, setTicketsCount] = useState(0);
  // Obtener total de tickets desde CopyVet para mostrar en la notificación
  useEffect(() => {
    let mounted = true;
    CopyVetService.getTickets()
      .then((res) => {
        const data = res.data;
        const count = Array.isArray(data) ? data.length : 0;
        if (mounted) setTicketsCount(count);
      })
      .catch(() => {
        if (mounted) setTicketsCount(0);
      });
    return () => (mounted = false);
  }, []);
  //Gestión menu usuario
  const [anchorElUser, setAnchorEl] = useState(null);
  //Gestión menu opciones
  const [mobileOpcionesAnchorEl, setMobileMoreAnchorEl] = useState(null);
  //Booleano Menu opciones responsivo
  const isMobileOpcionesMenuOpen = Boolean(mobileOpcionesAnchorEl);
  //Gestión menu principal
  const [anchorElPrincipal, setAnchorElPrincipal] = useState(null);
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
    handleOpcionesMenuClose();
  };
  //Abierto menu principal
  const handleOpenPrincipalMenu = (event) => {
    setAnchorElPrincipal(event.currentTarget);
  };
  //Cerrado menu principal
  const handleClosePrincipalMenu = () => {
    setAnchorElPrincipal(null);
  };
  //Abierto menu opciones
  const handleOpcionesMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };
  //Cerrado menu opciones
  const handleOpcionesMenuClose = () => {
    setMobileMoreAnchorEl(null);
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
    { name: t("createTicket"), link: "/ticket/create", roles: ["Cliente"] },
    { name: "Calendario", link: "/calendar", roles: null },
  ];

  //Lista enlaces menu Listas (dropdown)
  const listasItems = [
    { name: t("tickets"), link: "/tickets", roles: null },
    { name: t("veterinarians"), link: "/veterinarians", roles: null },
    { name: t("categories"), link: "/categories", roles: null },
    {
      name: "Tablero Asignaciones",
      link: "/assignments",
      roles: ["Administrador", "Veterinario"],
    },
  ];

  //Lista enlaces menu Mantenimientos (dropdown)
  const mantenimientosItems = [
    { name: t("tickets"), link: "/maintenance/tickets", roles: null },
    { name: t("categories"), link: "/maintenance/categories", roles: null },
    { name: "Técnicos", link: "/maintenance/veterinarians", roles: null },
  ];
  //Identificador menu principal
  const menuIdPrincipal = "menu-appbar";
  //Menu Principal
  const menuPrincipal = (
    <Box sx={{ display: { xs: "none", sm: "block" } }}>
      {/* Dropdown de Listas */}
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

      {/* Dropdown de Mantenimientos */}
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
      {/* Items del dropdown Listas en versión móvil */}
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
      {/* Items del dropdown Mantenimientos en versión móvil */}
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
  //Identificador menu opciones
  const menuOpcionesId = "badge-menu-mobile";
  //Menu opciones responsivo
  const menuOpcionesMobile = (
    <Menu
      anchorEl={mobileOpcionesAnchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuOpcionesId}
      keepMounted
      open={isMobileOpcionesMenuOpen}
      onClose={handleOpcionesMenuClose}
    >
      <MenuItem sx={{ justifyContent: "center" }}>
        <LanguageSwitcher />
      </MenuItem>
      <MenuItem>
        <IconButton size="large" color="inherit">
          <Badge
            badgeContent={getCountItems(cart)}
            color="primary"
            component={Link}
            to="/rental/crear/"
          >
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
        <p>Compras</p>
      </MenuItem>
      <MenuItem>
        <IconButton size="large" color="inherit">
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notificaciones</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        color="primaryLight"
        sx={{ backgroundColor: "primaryLight.main" }}
      >
        <Toolbar>
          <IconButton
            size="large"
            color="inherit"
            aria-controls={menuIdPrincipal}
            aria-haspopup="true"
            sx={{ mr: 2 }}
            onClick={handleOpenPrincipalMenu}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id={menuIdPrincipal}
            anchorEl={anchorElPrincipal}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            open={Boolean(anchorElPrincipal)}
            onClose={handleClosePrincipalMenu}
            sx={{ display: { xs: "block", md: "none" } }}
          >
            {menuPrincipalMobile}
          </Menu>
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
            <IconButton size="large" color="inherit">
              <Badge
                badgeContent={getCountItems(cart)}
                color="primary"
                component={Link}
                to="/rental/crear/"
              >
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
            <IconButton size="large" color="inherit">
              <Badge badgeContent={ticketsCount} color="primary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Box>
          <div>{userMenu}</div>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={menuOpcionesId}
              aria-haspopup="true"
              onClick={handleOpcionesMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {menuOpcionesMobile}
    </Box>
  );
}
