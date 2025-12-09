import PropTypes from "prop-types";
import { Card, CardContent, Typography, Box } from "@mui/material";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useTranslation } from "react-i18next";

function RatingByCategoryChart({ data }) {
  const { t } = useTranslation();

  if (!data || data.length === 0) {
    return (
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {t("common:dashboard.ratingByCategoryChart.title")}
          </Typography>
          <Box sx={{ textAlign: "center", py: 2 }}>
            <Typography color="text.secondary">
              {t("common:dashboard.noData")}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  // Convertir valoraciones a números y preparar datos para gráfico
  const chartData = data
    .filter((item) => parseFloat(item.valoracion_promedio || 0) > 0)
    .slice(0, 8)
    .map((item) => ({
      nombre: item.nombre_categoria?.substring(0, 12), // Truncar nombres largos
      valoracion: parseFloat(item.valoracion_promedio || 0),
      total: item.total_tickets || 0,
      valorados: item.total_valoraciones || 0,
    }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Box
          sx={{
            backgroundColor: "white",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        >
          <Typography variant="caption" display="block">
            <strong>{data.nombre}</strong>
          </Typography>
          <Typography variant="caption" display="block" color="primary">
            Valoración: {data.valoracion.toFixed(2)}/5.0
          </Typography>
          <Typography variant="caption" display="block">
            Valorados: {data.valorados}/{data.total}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  CustomTooltip.propTypes = {
    active: PropTypes.bool,
    payload: PropTypes.array,
  };

  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {t("common:dashboard.ratingByCategoryChart.title")}
        </Typography>
        <ResponsiveContainer width="100%" height={350}>
          <RadarChart
            data={chartData}
            margin={{ top: 20, right: 80, left: 80, bottom: 20 }}
          >
            <PolarGrid stroke="#e0e0e0" />
            <PolarAngleAxis
              dataKey="nombre"
              tick={{ fontSize: 11, fill: "#666" }}
            />
            <PolarRadiusAxis angle={90} domain={[0, 5]} />
            <Radar
              name={t("common:dashboard.ratingByCategoryChart.avgRating")}
              dataKey="valoracion"
              stroke="#FFB300"
              fill="#FFB300"
              fillOpacity={0.6}
              isAnimationActive={true}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{
                paddingTop: "20px",
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
        <Box
          sx={{ mt: 2, pt: 2, borderTop: "1px solid", borderColor: "divider" }}
        >
          <Typography variant="caption" color="text.secondary">
            {t("common:dashboard.ratingByCategoryChart.note")}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

RatingByCategoryChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      nombre_categoria: PropTypes.string,
      valoracion_promedio: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
      total_valoraciones: PropTypes.number,
      total_tickets: PropTypes.number,
    })
  ),
};

export default RatingByCategoryChart;
