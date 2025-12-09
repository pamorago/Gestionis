import PropTypes from "prop-types";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Paper, Typography, Box } from "@mui/material";
import { useTranslation } from "react-i18next";

const COLORS = {
  Abierto: "#1976d2",
  "En proceso": "#2e7d32",
  Cerrado: "#d32f2f",
  Cancelado: "#ed6c02",
};

export default function TicketsPorEstadoChart({ data }) {
  const { t } = useTranslation();
  const chartData = data.map((item) => ({
    name: item.nombre_estado,
    value: parseInt(item.total),
  }));

  return (
    <Paper sx={{ p: 3, height: "100%" }}>
      <Typography variant="h6" gutterBottom>
        {t("common:dashboard.statistics.charts.ticketsByState")}
      </Typography>
      <ResponsiveContainer width="100%" height={350}>
        <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
          <Pie
            data={chartData}
            cx="50%"
            cy="45%"
            labelLine={true}
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={60}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name] || "#999"} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <Box sx={{ mt: 2, textAlign: "center" }}>
        <Typography variant="caption" color="text.secondary">
          {t("common:dashboard.statistics.charts.total")}:{" "}
          {chartData.reduce((sum, item) => sum + item.value, 0)}{" "}
          {t("common:dashboard.statistics.charts.tickets")}
        </Typography>
      </Box>
    </Paper>
  );
}

TicketsPorEstadoChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      nombre_estado: PropTypes.string.isRequired,
      total: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    })
  ).isRequired,
};
