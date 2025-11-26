/* eslint-disable no-unused-vars */
import React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import UserService from "../../services/UserService";
import { yupResolver } from "@hookform/resolvers/yup";

export function Signup() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // Esquema de validación
  const loginSchema = yup.object({
    nombre_completo: yup
      .string()
      .required(t("auth:signup.validation.nameRequired")),
    email: yup
      .string()
      .required(t("auth:signup.validation.emailRequired"))
      .email(t("auth:signup.validation.emailFormat")),
    password: yup
      .string()
      .required(t("auth:signup.validation.passwordRequired")),
    telefono: yup.string().nullable(),
  });
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    // Valores iniciales
    defaultValues: {
      nombre_completo: "",
      email: "",
      password: "",
      telefono: "",
    },
    // Asignación de validaciones
    resolver: yupResolver(loginSchema),
  });

  const [error, setError] = useState(null);
  const notify = () =>
    toast.success(t("auth:signup.messages.userRegistered"), {
      duration: 4000,
      position: "top-center",
    });
  // Accion submit
  const onSubmit = (DataForm) => {
    try {
      console.log(DataForm);
      //Registrar usuario - Cliente siempre sin especialidad
      const userData = {
        ...DataForm,
        id_rol: 4,
        telefono:
          DataForm.telefono && DataForm.telefono.trim() !== ""
            ? DataForm.telefono
            : "",
      };
      console.log("Datos a enviar:", userData);
      UserService.createUser(userData)
        .then((response) => {
          console.log(response);
          notify();
          return navigate("/user/login/");
        })
        .catch((error) => {
          console.error("Error al crear usuario:", error);
          if (error.response) {
            // Error de respuesta del servidor
            setError(
              new Error(
                error.response.data?.message ||
                  t("auth:signup.messages.errorCreatingUser")
              )
            );
          } else if (error instanceof SyntaxError) {
            console.log(error);
            setError(error);
            throw new Error(t("auth:signup.messages.invalidResponse"));
          } else {
            setError(new Error(t("auth:signup.messages.errorCreatingUser")));
          }
        });
    } catch (e) {
      // handle your error
      console.error("Error en onSubmit:", e);
      setError(e);
    }
  };

  // Si ocurre error al realizar el submit
  const onError = (errors, e) => console.log(errors, e);

  if (error) return <p>Error: {error.message}</p>;
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <Grid container spacing={1}>
          <Grid size={12} sm={12}>
            <Typography variant="h5" gutterBottom>
              {t("auth:signup.title")}
            </Typography>
          </Grid>
          <Grid size={12} sm={12}>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              <Controller
                name="nombre_completo"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="nombre_completo"
                    label={t("auth:signup.fullName")}
                    error={Boolean(errors.nombre_completo)}
                    helperText={
                      errors.nombre_completo
                        ? errors.nombre_completo.message
                        : " "
                    }
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid size={12} sm={6}>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="email"
                    label={t("auth:signup.email")}
                    error={Boolean(errors.email)}
                    helperText={errors.email ? errors.email.message : " "}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid size={12} sm={6}>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              <Controller
                name="telefono"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="telefono"
                    label={t("auth:signup.phone")}
                    error={Boolean(errors.telefono)}
                    helperText={errors.telefono ? errors.telefono.message : " "}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid size={12} sm={6}>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="password"
                    label={t("auth:signup.password")}
                    type="password"
                    error={Boolean(errors.password)}
                    helperText={errors.password ? errors.password.message : " "}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid size={12} sm={12}>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              sx={{ m: 1 }}
            >
              {t("auth:signup.signupButton")}
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
}
