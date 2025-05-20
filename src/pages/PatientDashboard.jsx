import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Alert,
  CircularProgress,
  TextField,
  MenuItem,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import {
  fetchAppointments,
  fetchDoctors,
  createAppointment,
  deleteAppointment,
} from "../api/api";
import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import { useNavigate } from "react-router-dom";

export default function PatientDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [doctorId, setDoctorId] = useState("");
  const [datetime, setDatetime] = useState("");
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const loadAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const docs = await fetchDoctors();
      setDoctors(docs);
      const all = await fetchAppointments();
      const filtered = all.filter((a) => a.patientId === user.id);
      const apptsWithDoctorData = filtered.map((appt) => {
        const doc = docs.find((d) => d.id === appt.doctorId);
        return { ...appt, doctor: doc || {} };
      });
      setAppointments(apptsWithDoctorData);
    } catch {
      setError("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!doctorId || !datetime) {
      setFormError("Please select both doctor and date/time.");
      return;
    }

    try {
      setSubmitting(true);
      const newAppt = {
        patientId: user.id,
        doctorId,
        datetime,
        status: "pending",
      };
      await createAppointment(newAppt);
      setFormSuccess("Appointment booked successfully.");
      setDoctorId("");
      setDatetime("");
      loadAppointments();
    } catch {
      setFormError("Failed to book appointment.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      await deleteAppointment(id);
      loadAppointments();
    } catch {
      alert("Failed to cancel appointment.");
    }
  };

  // Logout clears localStorage and redirects to Home.jsx
  const handleLogout = () => {
    localStorage.clear();
    navigate("/"); // Assuming "/" is Home.jsx route
  };

  if (loading)
    return (
      <Container sx={{ mt: 8, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );

  return (
    <ProtectedRoute role="patient">
      <Container
        sx={{
          mt: 4,
          minHeight: "90vh",
          background:
            "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
          borderRadius: 3,
          p: 3,
          color: "white",
          fontFamily: "'Roboto', sans-serif",
          position: "relative",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
          backdropFilter: "blur(8.5px)",
          WebkitBackdropFilter: "blur(8.5px)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
        }}
      >
        {/* Header with Logout */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" fontWeight="700" sx={{ letterSpacing: 2 }}>
            Patient Dashboard
          </Typography>
          <Tooltip title="Logout">
            <IconButton
              onClick={handleLogout}
              sx={{
                color: "white",
                bgcolor: "rgba(255,255,255,0.1)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
                transition: "0.3s",
                boxShadow: "0 0 10px #ff3c78",
              }}
            >
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Welcome message */}
        <Typography
          variant="h5"
          fontWeight="500"
          sx={{ mb: 3, color: "#90caf9", letterSpacing: 1 }}
        >
          Welcome, {user.name || "Patient"}!
        </Typography>

        {/* Animated SVG */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 4,
            filter: "drop-shadow(0 0 8px #2196f3aa)",
          }}
        >
          <svg width="120" height="120" viewBox="0 0 200 200" fill="none">
            <circle cx="100" cy="100" r="80" fill="#2196f3" opacity="0.15" />
            <circle cx="100" cy="60" r="20" fill="#2196f3">
              <animate
                attributeName="cy"
                values="60;65;60"
                dur="1.2s"
                repeatCount="indefinite"
              />
            </circle>
            <rect
              x="75"
              y="90"
              width="50"
              height="60"
              fill="#2196f3"
              rx="10"
            >
              <animate
                attributeName="y"
                values="90;95;90"
                dur="1.2s"
                repeatCount="indefinite"
              />
            </rect>
          </svg>
        </Box>

        {/* Appointment Form */}
        <Paper
          sx={{
            p: 4,
            mb: 5,
            bgcolor: "rgba(255,255,255,0.07)",
            borderRadius: 3,
            boxShadow: "0 4px 30px rgba(0,0,0,0.2)",
            backdropFilter: "blur(6px)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "white",
          }}
          elevation={0}
        >
          <Typography
            variant="h6"
            gutterBottom
            fontWeight="600"
            sx={{ letterSpacing: 1 }}
          >
            Book New Appointment
          </Typography>
          {formError && (
            <Alert
              severity="error"
              sx={{ mb: 2, bgcolor: "rgba(255,0,0,0.15)" }}
              variant="filled"
            >
              {formError}
            </Alert>
          )}
          {formSuccess && (
            <Alert
              severity="success"
              sx={{ mb: 2, bgcolor: "rgba(0,255,0,0.15)" }}
              variant="filled"
            >
              {formSuccess}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              select
              label="Select Doctor"
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              fullWidth
              margin="normal"
              disabled={submitting}
              InputLabelProps={{ style: { color: "#90caf9" } }}
              sx={{
                input: { color: "white" },
                ".MuiOutlinedInput-notchedOutline": {
                  borderColor: "#90caf9",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#42a5f5",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#64b5f6",
                },
              }}
            >
              {doctors.map((doc) => (
                <MenuItem key={doc.id} value={doc.id}>
                  {doc.name} ({doc.trait})
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Date & Time"
              type="datetime-local"
              fullWidth
              margin="normal"
              value={datetime}
              onChange={(e) => setDatetime(e.target.value)}
              InputLabelProps={{ shrink: true, style: { color: "#90caf9" } }}
              disabled={submitting}
              sx={{
                input: { color: "white" },
                ".MuiOutlinedInput-notchedOutline": {
                  borderColor: "#90caf9",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#42a5f5",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#64b5f6",
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              sx={{
                mt: 3,
                background:
                  "linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)",
                boxShadow: "0 0 15px #21cbf3",
                fontWeight: "600",
                letterSpacing: 1,
                transition: "all 0.3s ease",
                "&:hover": {
                  background:
                    "linear-gradient(45deg, #42a5f5 30%, #64b5f6 90%)",
                  boxShadow: "0 0 25px #42a5f5",
                },
              }}
              disabled={submitting}
            >
              {submitting ? "Booking..." : "Book Appointment"}
            </Button>
          </Box>
        </Paper>

        {/* Appointment Cards */}
        <Grid container spacing={3}>
          {appointments.length === 0 ? (
            <Grid item xs={12}>
              <Alert severity="info" sx={{ bgcolor: "rgba(255,255,255,0.1)" }}>
                No appointments found.
              </Alert>
            </Grid>
          ) : (
            appointments.map((appt) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={appt.id}
                sx={{ opacity: 0, animation: "fadeInUp 0.8s forwards" }}
              >
                <Card
                  sx={{
                    borderRadius: 3,
                    background:
                      "rgba(255, 255, 255, 0.1)",
                    borderLeft: "6px solid #21cbf3",
                    boxShadow:
                      "0 8px 32px 0 rgba(33, 203, 243, 0.37)",
                    backdropFilter: "blur(8.5px)",
                    WebkitBackdropFilter: "blur(8.5px)",
                    color: "white",
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow:
                        "0 12px 40px 0 rgba(33, 203, 243, 0.7)",
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" fontWeight="700" gutterBottom>
                      {appt.doctor?.name}
                    </Typography>
                    <Typography color="rgba(255,255,255,0.7)" gutterBottom>
                      Specialization: {appt.doctor?.trait || "N/A"}
                    </Typography>
                    <Typography color="rgba(255,255,255,0.6)" gutterBottom>
                      Email: {appt.doctor?.email || "N/A"}
                    </Typography>
                    <Typography sx={{ mt: 1 }} gutterBottom>
                      Appointment: {new Date(appt.datetime).toLocaleString()}
                    </Typography>
                    <Typography>Status: {appt.status}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      color="error"
                      onClick={() => handleCancel(appt.id)}
                      disabled={appt.status === "cancelled"}
                      sx={{
                        fontWeight: "600",
                        transition: "all 0.3s ease",
                        "&:hover": { backgroundColor: "#d32f2f", color: "white" },
                      }}
                    >
                      Cancel
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
</Container>
</ProtectedRoute>
);
}
