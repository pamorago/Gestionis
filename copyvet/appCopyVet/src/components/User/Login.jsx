import { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  Typography,
  TextField,
  Button,
  Box,
  IconButton,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import UserService from "../../services/UserService";
import { UserContext } from "../../context/UserContext";

export function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { saveUser } = useContext(UserContext);

  // Estado para controlar el modal
  const [open, setOpen] = useState(true);

  // Función para cerrar el modal
  const handleClose = () => {
    setOpen(false);
    navigate("/");
  };

  // Esquema de validación
  const loginSchema = yup.object({
    email: yup
      .string()
      .required(t("auth:login.validation.emailRequired"))
      .email(t("auth:login.validation.emailFormat")),
    password: yup
      .string()
      .required(t("auth:login.validation.passwordRequired")),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    // Valores iniciales
    defaultValues: {
      email: "",
      password: "",
    },
    // Asignación de validaciones
    resolver: yupResolver(loginSchema),
  });

  // Valores de formulario
  const [error, setError] = useState(null);

  // Accion submit
  const onSubmit = (DataForm) => {
    try {
      UserService.loginUser(DataForm)
        .then((response) => {
          console.log(response);
          //Validar la respuesta
          if (
            response.data != null &&
            response.data != "undefined" &&
            response.data != "Usuario no valido"
          ) {
            //Usuario válido o identificado
            //Guardar el token
            saveUser(response.data);
            toast.success(t("auth:login.messages.welcome"), {
              duration: 4000,
            });
            handleClose();
          } else {
            //Usuario No válido
            toast.error(t("auth:login.messages.invalidUser"), {
              duration: 4000,
            });
          }
        })
        .catch((error) => {
          if (error instanceof SyntaxError) {
            console.log(error);
            setError(error);
            throw new Error(t("auth:login.messages.invalidResponse"));
          }
        });
    } catch (e) {
      console.error("Error:", e);
    }
  };

  // Si ocurre error al realizar el submit
  const onError = (errors, e) => console.log(errors, e);

  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <Toaster />
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: 24,
          },
        }}
      >
        <DialogTitle>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h5" component="div">
              {t("auth:login.title")}
            </Typography>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <FormControl variant="standard" fullWidth>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      id="email"
                      label={t("auth:login.email")}
                      error={Boolean(errors.email)}
                      helperText={errors.email ? errors.email.message : " "}
                      fullWidth
                    />
                  )}
                />
              </FormControl>
              <FormControl variant="standard" fullWidth>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      id="password"
                      label={t("auth:login.password")}
                      type="password"
                      error={Boolean(errors.password)}
                      helperText={
                        errors.password ? errors.password.message : " "
                      }
                      fullWidth
                    />
                  )}
                />
              </FormControl>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
              >
                {t("auth:login.loginButton")}
              </Button>
            </Stack>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
