import PropTypes from "prop-types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Paper, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function TicketsPorCategoriaChart({ data }) {
  const { t } = useTranslation();
  const chartData = data.map((item) => ({
    name: item.nombre_categoria,
    tickets: parseInt(item.total),
  }));

  return (
    <Paper sx={{ p: 3, height: "100%" }}>
      <Typography variant="h6" gutterBottom>
        {t("common:dashboard.statistics.charts.ticketsByCategory")}
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={100}
            style={{ fontSize: "12px" }}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="tickets" fill="#1976d2" name="Total de Tickets" />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
}

TicketsPorCategoriaChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      nombre_categoria: PropTypes.string.isRequired,
      total: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    })
  ).isRequired,
};
