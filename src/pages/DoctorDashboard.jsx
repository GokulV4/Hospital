import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Alert,
  CircularProgress,
  Box,
} from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { fetchAppointments, fetchPatients, updateAppointment } from "../api/api";
import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";

export default function DoctorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const loadAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const allAppointments = await fetchAppointments();
      const filtered = allAppointments.filter(
        (a) => a.doctorId === user.id && a.status !== "cancelled"
      );
      setAppointments(filtered);

      const allPatients = await fetchPatients();
      setPatients(allPatients);
    } catch {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleCancel = async (appt) => {
    if (!window.confirm("Cancel this appointment?")) return;
    try {
      await updateAppointment(appt.id, { ...appt, status: "cancelled" });
      setSuccess("Appointment cancelled");
      await loadAppointments();
    } catch {
      setError("Failed to cancel appointment");
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/", { replace: true });
    }
  };

  // Helper to get patient name by id
  const getPatientName = (patientId) => {
    const patient = patients.find((p) => p.id === patientId);
    return patient ? patient.name : "Unknown";
  };

  if (loading)
    return (
      <Container sx={{ mt: 8, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );

  return (
    <ProtectedRoute role="doctor">
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
          paddingTop: 8,
          paddingBottom: 8,
          color: "#fff",
        }}
      >
        <Container
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#00e6e6" }}>
              Doctor Dashboard
            </Typography>
            <Button onClick={handleLogout} variant="contained" color="secondary">
              Logout
            </Button>
          </Box>

          {/* Welcome message */}
          <Typography variant="h6" sx={{ mb: 3, color: "#00e6e6" }}>
            Welcome to Dr. {user.name}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Paper
            elevation={10}
            component={motion.div}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(10px)",
              borderRadius: 4,
              overflowX: "auto",
              color: "#fff",
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "rgba(0,0,0,0.3)" }}>
                  <TableCell sx={{ color: "#00e6e6" }}>Patient</TableCell>
                  <TableCell sx={{ color: "#00e6e6" }}>Date & Time</TableCell>
                  <TableCell sx={{ color: "#00e6e6" }}>Status</TableCell>
                  <TableCell sx={{ color: "#00e6e6" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments.map((appt) => (
                  <TableRow
                    key={appt.id}
                    component={motion.tr}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <TableCell sx={{ color: "#fff" }}>{getPatientName(appt.patientId)}</TableCell>
                    <TableCell sx={{ color: "#fff" }}>
                      {new Date(appt.datetime).toLocaleString()}
                    </TableCell>
                    <TableCell sx={{ color: "#fff" }}>{appt.status}</TableCell>
                    <TableCell>
                      <Button color="error" onClick={() => handleCancel(appt)}>
                        Cancel
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {appointments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ color: "#bbb" }}>
                      No appointments found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Paper>
        </Container>
      </Box>
    </ProtectedRoute>
  );
}
