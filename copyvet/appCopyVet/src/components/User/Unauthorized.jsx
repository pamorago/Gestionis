import { useTranslation } from "react-i18next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
export function Unauthorized() {
  const { t } = useTranslation();
  return (
    <Container sx={{ p: 2 }} maxWidth="sm">
      <Typography
        component="h1"
        variant="h2"
        align="center"
        color="text.primary"
        gutterBottom
      >
        {t("unauthorized.title")}
      </Typography>
      <Typography variant="h5" align="center" color="text.secondary" paragraph>
        {t("unauthorized.message")}
      </Typography>
    </Container>
  );
}
