import PropTypes from "prop-types";
import { Card, CardContent, Typography, Box } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useTranslation } from "react-i18next";

export default function TicketsCreatedByMonthChart({ data }) {
  const { t } = useTranslation();

  if (!data || data.length === 0) {
    return (
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {t("common:dashboard.ticketsMonth.title")}
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
  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {t("common:dashboard.ticketsMonth.title")}
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#2196F3"
              name={t("common:dashboard.ticketsMonth.total")}
              isAnimationActive={true}
              dot={{ fill: "#2196F3" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

TicketsCreatedByMonthChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
};
