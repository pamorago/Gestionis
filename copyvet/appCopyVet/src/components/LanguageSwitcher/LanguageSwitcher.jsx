import { useTranslation } from "react-i18next";
import { Button, Box, Tooltip } from "@mui/material";
import TranslateIcon from "@mui/icons-material/Translate";

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
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
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mr: 1 }}>
      <Tooltip
        title={`${t("changeLanguage")} (${getCurrentLanguage()} → ${getNextLanguageLabel()})`}
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
  );
};

export default LanguageSwitcher;
