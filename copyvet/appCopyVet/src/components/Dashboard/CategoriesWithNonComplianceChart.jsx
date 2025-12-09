import PropTypes from "prop-types";
import { Card, CardContent, Typography, Box } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useTranslation } from "react-i18next";

function CategoriesWithNonComplianceChart({ data }) {
  const { t } = useTranslation();

  if (!data || data.length === 0) {
    return (
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {t("common:dashboard.categoriesNoncompliance.title")}
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
          {t("common:dashboard.categoriesNoncompliance.title")}
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 0, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="nombre_categoria"
              angle={-45}
              textAnchor="end"
              height={100}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="incumplimientos"
              fill="#FF6B6B"
              name={t("common:dashboard.categoriesNoncompliance.noncompliance")}
            />
            <Bar
              dataKey="total"
              fill="#95E1D3"
              name={t("common:dashboard.categoriesNoncompliance.total")}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

CategoriesWithNonComplianceChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      nombre_categoria: PropTypes.string,
      total: PropTypes.number,
      incumplimientos: PropTypes.number,
    })
  ),
};

export default CategoriesWithNonComplianceChart;
