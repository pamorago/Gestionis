import { useTranslation } from "react-i18next";
import { Button, Box, Tooltip, Snackbar, Alert } from "@mui/material";
import TranslateIcon from "@mui/icons-material/Translate";
import { useState } from "react";

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const getCurrentLanguage = () => {
    return i18n.language === "en" ? "EN" : "ES";
  };

  const getNextLanguage = () => {
    return i18n.language === "en" ? "es" : "en";
  };

  const getNextLanguageLabel = () => {
    return i18n.language === "en" ? "ES" : "EN";
  };

  const getCurrentLanguageFlag = () => {
    return i18n.language === "en" ? "🇺🇸" : "🇪🇸";
  };

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mr: 1 }}>
        <Tooltip
          title={`${t("common:language.changeLanguage")} (${getCurrentLanguage()} → ${getNextLanguageLabel()})`}
        >
          <Button
            variant="outlined"
            size="small"
            startIcon={<TranslateIcon />}
            onClick={() => changeLanguage(getNextLanguage())}
            sx={{
              minWidth: "100px",
              textTransform: "none",
              borderRadius: "20px",
              border: "2px solid",
              borderColor: "secondary.main",
              color: "secondary.main",
              fontWeight: "bold",
              "&:hover": {
                transform: "scale(1.05)",
                transition: "all 0.3s ease-in-out",
                backgroundColor: "secondary.main",
                color: "white",
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
              },
            }}
          >
            {getCurrentLanguageFlag()} {getCurrentLanguage()}
          </Button>
        </Tooltip>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {t("common:messages.languageChanged")}
        </Alert>
      </Snackbar>
    </>
  );
};

export default LanguageSwitcher;
