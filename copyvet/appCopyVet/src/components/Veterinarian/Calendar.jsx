import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Badge,
  Stack,
  Divider,
  IconButton,
  Tooltip,
  CircularProgress,
  Tabs,
  Tab,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  Vaccines,
  MedicalServices,
  LocalHospital,
  CalendarMonth,
  ViewWeek,
} from "@mui/icons-material";
import TicketService from "../../services/TicketService";

export default function Calendar() {
  const { t, i18n } = useTranslation();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("week"); // "week" o "month"

  useEffect(() => {
    setLoading(true);
    TicketService.list()
      .then((r) => {
        // Filtrar solo citas programadas (con fecha_cita) y categorías específicas
        const filtered = (Array.isArray(r.data) ? r.data : []).filter((t) => {
          const categoria = t.nombre_categoria?.toLowerCase();
          return (
            t.fecha_cita &&
            (categoria === "vacunación" ||
              categoria === "cirugía menor" ||
              categoria === "cirugía mayor")
          );
        });
        setTickets(filtered);
      })
      .catch((err) => {
        console.error("Error al cargar tickets:", err);
        setTickets([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Funciones para vista semanal
  const getWeekDays = (referenceDate) => {
    const date = new Date(referenceDate);
    const dayOfWeek = date.getDay();
    const monday = new Date(date);
    monday.setDate(date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));

    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      days.push(day);
    }
    return days;
  };

  // Funciones para vista mensual
  const getMonthDays = (referenceDate) => {
    const date = new Date(referenceDate);
    const year = date.getFullYear();
    const month = date.getMonth();

    // Primer día del mes
    const firstDay = new Date(year, month, 1);

    // Día de la semana del primer día (0 = Domingo, 1 = Lunes, etc.)
    const firstDayWeek = firstDay.getDay();
    // Ajustar para que empiece en lunes
    const startOffset = firstDayWeek === 0 ? 6 : firstDayWeek - 1;

    // Calcular día de inicio (puede ser del mes anterior)
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startOffset);

    // Generar array de días (6 semanas = 42 días para cubrir cualquier mes)
    const days = [];
    for (let i = 0; i < 42; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }

    return { days, currentMonth: month, currentYear: year };
  };

  const weekDays = getWeekDays(currentDate);
  const monthData = getMonthDays(currentDate);

  // Navegación
  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    if (view === "week") {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  const goToNext = () => {
    const newDate = new Date(currentDate);
    if (view === "week") {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Agrupar tickets por día
  const getTicketsForDay = (day) => {
    const dayStr = day.toISOString().split("T")[0];
    return tickets.filter((t) => {
      const citaDate = new Date(t.fecha_cita).toISOString().split("T")[0];
      return citaDate === dayStr;
    });
  };

  // Color según categoría
  const getCategoryColor = (categoria) => {
    const cat = categoria?.toLowerCase();
    if (cat === "vacunación") return "#1976d2";
    if (cat === "cirugía menor") return "#ed6c02";
    if (cat === "cirugía mayor") return "#d32f2f";
    return "#757575";
  };

  // Obtener icono según categoría
  const getCategoryIcon = (categoria) => {
    const cat = categoria?.toLowerCase();
    if (cat === "vacunación") return <Vaccines fontSize="small" />;
    if (cat === "cirugía menor") return <MedicalServices fontSize="small" />;
    if (cat === "cirugía mayor") return <LocalHospital fontSize="small" />;
    return null;
  };

  const getShortDayName = (date) => {
    const days = [
      t("common:calendar.days.short.sunday"),
      t("common:calendar.days.short.monday"),
      t("common:calendar.days.short.tuesday"),
      t("common:calendar.days.short.wednesday"),
      t("common:calendar.days.short.thursday"),
      t("common:calendar.days.short.friday"),
      t("common:calendar.days.short.saturday"),
    ];
    return days[date.getDay()];
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isCurrentMonth = (date) => {
    return date.getMonth() === monthData.currentMonth;
  };

  const getHeaderTitle = () => {
    const months = [
      t("common:calendar.months.january"),
      t("common:calendar.months.february"),
      t("common:calendar.months.march"),
      t("common:calendar.months.april"),
      t("common:calendar.months.may"),
      t("common:calendar.months.june"),
      t("common:calendar.months.july"),
      t("common:calendar.months.august"),
      t("common:calendar.months.september"),
      t("common:calendar.months.october"),
      t("common:calendar.months.november"),
      t("common:calendar.months.december"),
    ];

    if (view === "week") {
      const firstDay = weekDays[0];
      const lastDay = weekDays[6];

      if (firstDay.getMonth() === lastDay.getMonth()) {
        return `${months[firstDay.getMonth()]} ${firstDay.getFullYear()}`;
      }
      return `${months[firstDay.getMonth()]} - ${months[lastDay.getMonth()]} ${lastDay.getFullYear()}`;
    } else {
      return `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    }
  };

  // Renderizar vista semanal
  const renderWeekView = () => {
    const ticketsByDay = weekDays.map((day) => ({
      date: day,
      tickets: getTicketsForDay(day),
    }));

    return (
      <Grid container spacing={2}>
        {ticketsByDay.map((day, index) => (
          <Grid item xs={12} sm={6} md={1.714} key={index}>
            <Card
              elevation={isToday(day.date) ? 8 : 2}
              sx={{
                minHeight: 300,
                bgcolor: isToday(day.date)
                  ? "primary.light"
                  : "background.paper",
                border: isToday(day.date) ? 3 : 0,
                borderColor: "primary.main",
                transition: "all 0.3s",
                "&:hover": {
                  elevation: 6,
                  transform: "translateY(-4px)",
                },
              }}
            >
              <CardContent>
                {/* Header del día */}
                <Box sx={{ textAlign: "center", mb: 2 }}>
                  <Typography
                    variant="overline"
                    sx={{
                      fontWeight: isToday(day.date) ? "bold" : "normal",
                      color: isToday(day.date)
                        ? "primary.dark"
                        : "text.secondary",
                      display: "block",
                    }}
                  >
                    {getShortDayName(day.date)}
                  </Typography>
                  <Badge
                    badgeContent={day.tickets.length}
                    color="primary"
                    invisible={day.tickets.length === 0}
                  >
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: isToday(day.date)
                          ? "primary.main"
                          : "grey.200",
                        color: isToday(day.date) ? "white" : "text.primary",
                        fontWeight: "bold",
                        fontSize: "1.2rem",
                      }}
                    >
                      {day.date.getDate()}
                    </Box>
                  </Badge>
                </Box>

                <Divider sx={{ mb: 2 }} />

                {/* Citas del día */}
                <Stack spacing={1}>
                  {day.tickets.length === 0 ? (
                    <Typography
                      variant="caption"
                      align="center"
                      color="text.secondary"
                      sx={{ py: 2 }}
                    >
                      {t("common:calendar.messages.noAppointments")}
                    </Typography>
                  ) : (
                    day.tickets.map((t) => (
                      <Tooltip
                        key={t.id_ticket}
                        title={`${t("common:calendar.messages.viewDetails")} - ${t.nombre_categoria}`}
                        arrow
                      >
                        <Paper
                          component={Link}
                          to={`/ticket/${t.id_ticket}`}
                          elevation={1}
                          sx={{
                            p: 1,
                            borderLeft: 4,
                            borderLeftColor: getCategoryColor(
                              t.nombre_categoria
                            ),
                            cursor: "pointer",
                            textDecoration: "none",
                            color: "inherit",
                            display: "block",
                            transition: "all 0.2s",
                            "&:hover": {
                              elevation: 3,
                              transform: "translateX(4px)",
                              bgcolor: "action.hover",
                            },
                          }}
                        >
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <Box
                              sx={{
                                color: getCategoryColor(t.nombre_categoria),
                              }}
                            >
                              {getCategoryIcon(t.nombre_categoria)}
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography
                                variant="caption"
                                fontWeight="bold"
                                sx={{
                                  display: "block",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                #{t.id_ticket}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                  display: "block",
                                  fontSize: "0.65rem",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {t.mascota}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                  display: "block",
                                  fontSize: "0.6rem",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {t.asignado_a?.split(" ")[0] ||
                                  t("common:calendar.messages.unassigned")}
                              </Typography>
                            </Box>
                          </Stack>
                        </Paper>
                      </Tooltip>
                    ))
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  // Renderizar vista mensual
  const renderMonthView = () => {
    const { days } = monthData;
    const weekHeaders = [
      t("common:calendar.days.short.monday"),
      t("common:calendar.days.short.tuesday"),
      t("common:calendar.days.short.wednesday"),
      t("common:calendar.days.short.thursday"),
      t("common:calendar.days.short.friday"),
      t("common:calendar.days.short.saturday"),
      t("common:calendar.days.short.sunday"),
    ];

    return (
      <Box>
        {/* Headers de días de la semana */}
        <Grid container spacing={1} sx={{ mb: 1 }}>
          {weekHeaders.map((day) => (
            <Grid item xs={12 / 7} key={day}>
              <Typography
                variant="subtitle2"
                align="center"
                fontWeight="bold"
                color="text.secondary"
              >
                {day}
              </Typography>
            </Grid>
          ))}
        </Grid>

        {/* Días del mes */}
        <Grid container spacing={1}>
          {days.map((day, index) => {
            const dayTickets = getTicketsForDay(day);
            const inCurrentMonth = isCurrentMonth(day);

            return (
              <Grid item xs={12 / 7} key={index}>
                <Card
                  elevation={isToday(day) ? 6 : 1}
                  sx={{
                    minHeight: 120,
                    bgcolor: isToday(day)
                      ? "primary.light"
                      : inCurrentMonth
                        ? "background.paper"
                        : "grey.50",
                    border: isToday(day) ? 2 : 0,
                    borderColor: "primary.main",
                    opacity: inCurrentMonth ? 1 : 0.5,
                    transition: "all 0.2s",
                    "&:hover": {
                      elevation: 3,
                      opacity: 1,
                    },
                  }}
                >
                  <CardContent sx={{ p: 1, "&:last-child": { pb: 1 } }}>
                    <Box sx={{ textAlign: "right", mb: 0.5 }}>
                      <Badge
                        badgeContent={dayTickets.length}
                        color="primary"
                        invisible={dayTickets.length === 0}
                      >
                        <Typography
                          variant="body2"
                          fontWeight={isToday(day) ? "bold" : "normal"}
                          sx={{
                            display: "inline-block",
                            minWidth: 24,
                            textAlign: "center",
                            borderRadius: "50%",
                            bgcolor: isToday(day)
                              ? "primary.main"
                              : "transparent",
                            color: isToday(day) ? "white" : "text.primary",
                            px: 0.5,
                          }}
                        >
                          {day.getDate()}
                        </Typography>
                      </Badge>
                    </Box>

                    <Stack spacing={0.5}>
                      {dayTickets.slice(0, 3).map((t) => (
                        <Tooltip
                          key={t.id_ticket}
                          title={`${t("common:calendar.messages.viewDetails")} - ${t.mascota}`}
                          arrow
                        >
                          <Box
                            component={Link}
                            to={`/ticket/${t.id_ticket}`}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                              p: 0.3,
                              borderRadius: 0.5,
                              bgcolor: "background.default",
                              borderLeft: 2,
                              borderLeftColor: getCategoryColor(
                                t.nombre_categoria
                              ),
                              cursor: "pointer",
                              textDecoration: "none",
                              color: "inherit",
                              "&:hover": {
                                bgcolor: "action.hover",
                              },
                            }}
                          >
                            <Box
                              sx={{
                                color: getCategoryColor(t.nombre_categoria),
                                display: "flex",
                                alignItems: "center",
                                fontSize: "0.7rem",
                              }}
                            >
                              {getCategoryIcon(t.nombre_categoria)}
                            </Box>
                            <Typography
                              variant="caption"
                              sx={{
                                fontSize: "0.65rem",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              #{t.id_ticket}
                            </Typography>
                          </Box>
                        </Tooltip>
                      ))}
                      {dayTickets.length > 3 && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontSize: "0.6rem", textAlign: "center" }}
                        >
                          +{dayTickets.length - 3}{" "}
                          {t("common:calendar.messages.moreAppointments")}
                        </Typography>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          📅 {t("common:calendar.title")}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t("common:calendar.subtitle")}
        </Typography>
      </Box>

      {/* Tabs para cambiar vista */}
      <Paper elevation={2} sx={{ mb: 2 }}>
        <Tabs
          value={view}
          onChange={(e, newValue) => setView(newValue)}
          centered
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab
            icon={<ViewWeek />}
            iconPosition="start"
            label={t("common:calendar.views.week")}
            value="week"
          />
          <Tab
            icon={<CalendarMonth />}
            iconPosition="start"
            label={t("common:calendar.views.month")}
            value="month"
          />
        </Tabs>
      </Paper>

      {/* Controles de navegación */}
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          gap={2}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton onClick={goToPrevious} color="primary">
              <ChevronLeft />
            </IconButton>
            <IconButton onClick={goToNext} color="primary">
              <ChevronRight />
            </IconButton>
            <Tooltip title={t("common:calendar.navigation.goToToday")}>
              <Box
                component="button"
                onClick={goToToday}
                sx={{
                  px: 2,
                  py: 1,
                  border: "1px solid",
                  borderColor: "primary.main",
                  borderRadius: 1,
                  bgcolor: "background.paper",
                  color: "primary.main",
                  cursor: "pointer",
                  fontWeight: "bold",
                  "&:hover": {
                    bgcolor: "primary.main",
                    color: "white",
                  },
                }}
              >
                {t("common:calendar.navigation.today")}
              </Box>
            </Tooltip>
          </Stack>

          <Typography variant="h6" fontWeight="bold">
            {getHeaderTitle()}
          </Typography>

          <Stack direction="row" spacing={2}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Vaccines fontSize="small" color="primary" />
              <Typography variant="caption">
                {t("common:calendar.categories.vaccination")}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <MedicalServices fontSize="small" sx={{ color: "#ed6c02" }} />
              <Typography variant="caption">
                {t("common:calendar.categories.minorSurgery")}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <LocalHospital fontSize="small" color="error" />
              <Typography variant="caption">
                {t("common:calendar.categories.majorSurgery")}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Paper>

      {/* Calendario */}
      {loading ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <CircularProgress size={60} />
          <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
            {t("common:calendar.loading")}
          </Typography>
        </Box>
      ) : (
        <Box>{view === "week" ? renderWeekView() : renderMonthView()}</Box>
      )}

      {!loading && tickets.length === 0 && (
        <Paper elevation={2} sx={{ p: 6, textAlign: "center", mt: 4 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            📭 {t("common:calendar.messages.noScheduledAppointments")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("common:calendar.messages.noVaccinationsOrSurgeries")}
          </Typography>
        </Paper>
      )}
    </Container>
  );
}
