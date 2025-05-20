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
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  fetchUsers,
  createUser,
  deleteUser,
  fetchAppointments,
  updateAppointment,
} from "../api/api";
import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAddDoctor, setOpenAddDoctor] = useState(false);
  const [newDoctorName, setNewDoctorName] = useState("");
  const [newDoctorEmail, setNewDoctorEmail] = useState("");
  const [newDoctorPassword, setNewDoctorPassword] = useState("");
  const [newDoctorTrait, setNewDoctorTrait] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const { logout, user } = useAuth(); // <-- user from auth context
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const loadDoctorsAndAppointments = async () => {
    setLoading(true);
    try {
      const users = await fetchUsers();
      setDoctors(users.filter((u) => u.role === "doctor"));

      const appts = await fetchAppointments();

      const usersMap = {};
      const traitsMap = {};
      users.forEach((user) => {
        usersMap[user.id] = user.name;
        traitsMap[user.id] = user.trait || "";
      });

      const apptsWithNames = appts.map((appt) => ({
        ...appt,
        patientName: usersMap[appt.patientId] || "Unknown Patient",
        doctorName: usersMap[appt.doctorId] || "Unknown Doctor",
        doctorTrait: traitsMap[appt.doctorId],
      }));

      setAppointments(apptsWithNames);
      setError(null);
    } catch (e) {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctorsAndAppointments();
  }, []);

  const handleAddDoctor = async () => {
    if (
      !newDoctorName.trim() ||
      !newDoctorEmail.trim() ||
      !newDoctorPassword.trim() ||
      !newDoctorTrait.trim()
    ) {
      setError("All doctor fields including trait are required");
      return;
    }
    setError(null);
    try {
      await createUser({
        name: newDoctorName,
        email: newDoctorEmail,
        password: newDoctorPassword,
        trait: newDoctorTrait,
        role: "doctor",
      });
      setSuccess("Doctor added successfully");
      setOpenAddDoctor(false);
      setNewDoctorName("");
      setNewDoctorEmail("");
      setNewDoctorPassword("");
      setNewDoctorTrait("");
      await loadDoctorsAndAppointments();
    } catch {
      setError("Failed to add doctor");
    }
  };

  const handleDeleteDoctor = async (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;
    try {
      await deleteUser(id);
      setSuccess("Doctor deleted successfully");
      await loadDoctorsAndAppointments();
    } catch {
      setError("Failed to delete doctor");
    }
  };

  const handleCancelAppointment = async (appt) => {
    if (!window.confirm("Cancel this appointment?")) return;
    try {
      await updateAppointment(appt.id, { ...appt, status: "cancelled" });
      setSuccess("Appointment cancelled");
      await loadDoctorsAndAppointments();
    } catch {
      setError("Failed to cancel appointment");
    }
  };

  if (loading)
    return (
      <Container sx={{ mt: 8, textAlign: "center" }}>
        <CircularProgress color="secondary" />
      </Container>
    );

  return (
    <ProtectedRoute role="admin">
      <Container
        maxWidth="lg"
        sx={{
          mt: 4,
          mb: 8,
          color: "#E0E0E0",
          background:
            "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
          borderRadius: 3,
          boxShadow:
            "0 8px 32px 0 rgba(31, 38, 135, 0.37), 0 0 10px 2px rgba(255, 255, 255, 0.1)",
          p: 4,
          fontFamily: "'Roboto', sans-serif",
        }}
      >
        {/* Welcome Message */}
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: "700", letterSpacing: "0.05em", mb: 3 }}
        >
          Welcome, {user?.name || "Admin"}!
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2, fontWeight: "600" }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2, fontWeight: "600" }}>
            {success}
          </Alert>
        )}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: "600" }}>
            Doctors
          </Typography>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setOpenAddDoctor(true)}
              sx={{
                boxShadow: "0 0 12px #ff4081",
                "&:hover": {
                  boxShadow: "0 0 24px #ff79b0",
                  transition: "0.4s ease",
                },
              }}
            >
              Add Doctor
            </Button>

            <Button
              variant="outlined"
              color="error"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                borderColor: "#f44336",
                color: "#f44336",
                "&:hover": {
                  backgroundColor: "#f44336",
                  color: "#fff",
                  transition: "0.3s ease",
                },
              }}
            >
              Logout
            </Button>
          </Box>
        </Box>

        <Paper
          sx={{
            mb: 5,
            overflowX: "auto",
            backgroundColor: "rgba(255 255 255 / 0.05)",
            boxShadow: "0 0 12px rgba(255, 64, 129, 0.5)",
            borderRadius: 2,
          }}
          elevation={4}
        >
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow
                sx={{
                  background:
                    "linear-gradient(90deg, #ff80ab 0%, #f50057 100%)",
                }}
              >
                <TableCell sx={{ color: "#fff", fontWeight: "700" }}>
                  Name
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "700" }}>
                  Email
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "700" }}>
                  Trait
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "700" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {doctors.map((doctor) => (
                <TableRow
                  key={doctor.id}
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(255 64 129 / 0.15)",
                      cursor: "pointer",
                      transition: "0.3s ease",
                    },
                  }}
                >
                  <TableCell>{doctor.name}</TableCell>
                  <TableCell>{doctor.email}</TableCell>
                  <TableCell>{doctor.trait || "-"}</TableCell>
                  <TableCell>
                    <Button
                      color="error"
                      onClick={() => handleDeleteDoctor(doctor.id)}
                      sx={{
                        textTransform: "none",
                        fontWeight: "600",
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {doctors.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No doctors found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>

        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: "600", mb: 2 }}
        >
          All Appointments
        </Typography>

        <Paper
          sx={{
            overflowX: "auto",
            backgroundColor: "rgba(255 255 255 / 0.05)",
            boxShadow: "0 0 12px rgba(255, 64, 129, 0.5)",
            borderRadius: 2,
          }}
          elevation={4}
        >
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow
                sx={{
                  background:
                    "linear-gradient(90deg, #ff80ab 0%, #f50057 100%)",
                }}
              >
                <TableCell sx={{ color: "#fff", fontWeight: "700" }}>
                  Patient
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "700" }}>
                  Doctor
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "700" }}>
                  Date & Time
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "700" }}>
                  Status
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "700" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((appt) => (
                <TableRow
                  key={appt.id}
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(255 64 129 / 0.15)",
                      cursor: appt.status !== "cancelled" ? "pointer" : "default",
                      transition: "0.3s ease",
                    },
                  }}
                >
                  <TableCell>{appt.patientName}</TableCell>
                  <TableCell>
                    {appt.doctorName}
                    {appt.doctorTrait ? ` (${appt.doctorTrait})` : ""}
                  </TableCell>
                  <TableCell>
                    {new Date(appt.datetime).toLocaleString()}
                  </TableCell>
                  <TableCell
                    sx={{
                      color:
                        appt.status === "cancelled"
                          ? "#f44336"
                          : appt.status === "confirmed"
                          ? "#4caf50"
                          : "#ffb300",
                      fontWeight: "700",
                      textTransform: "capitalize",
                    }}
                  >
                    {appt.status}
                  </TableCell>
                  <TableCell>
                    {appt.status !== "cancelled" && (
                      <Button
                        color="error"
                        onClick={() => handleCancelAppointment(appt)}
                        sx={{
                          textTransform: "none",
                          fontWeight: "600",
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {appointments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No appointments found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>

        <Dialog open={openAddDoctor} onClose={() => setOpenAddDoctor(false)}>
          <DialogTitle>Add New Doctor</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Full Name"
              fullWidth
              value={newDoctorName}
              onChange={(e) => setNewDoctorName(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Email"
              fullWidth
              value={newDoctorEmail}
              onChange={(e) => setNewDoctorEmail(e.target.value)}
              type="email"
            />
            <TextField
              margin="dense"
              label="Password"
              fullWidth
              value={newDoctorPassword}
              onChange={(e) => setNewDoctorPassword(e.target.value)}
              type="password"
            />
            <TextField
              margin="dense"
              label="Trait (e.g. Cardiologist)"
              fullWidth
              value={newDoctorTrait}
              onChange={(e) => setNewDoctorTrait(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAddDoctor(false)}>Cancel</Button>
            <Button onClick={handleAddDoctor} variant="contained" color="secondary">
              Add Doctor
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ProtectedRoute>
  );
}
