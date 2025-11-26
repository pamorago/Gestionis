// eslint-disable-next-line no-unused-vars
import React from "react";
import { useTranslation } from "react-i18next";
import { Container, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Toolbar from "@mui/material/Toolbar";

export function Footer() {
  const { t } = useTranslation();

  return (
    <Toolbar
      sx={{
        px: 2,
        position: "fixed",
        bottom: 0,
        width: "100%",
        height: "4.5rem",
        backgroundColor: "primary.main",
        paddingTop: "1rem",
        paddingBottom: "1rem",
      }}
    >
      {/* Comentario */}
      <Container>
        <Grid container rowSpacing={1}>
          <Grid size={12}>
            <Typography align="center" color="white" variant="subtitle1">
              {t("common:footer.title")} • {t("common:footer.authors")}
            </Typography>
          </Grid>
          <Grid size={12}>
            <Typography align="center" color="white" variant="body1">
              {`${new Date().getFullYear()}`}
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Toolbar>
  );
}
