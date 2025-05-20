import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  Alert,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { createUser, fetchUsers } from "../api/api";
import { motion } from "framer-motion";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name || !email || !password) {
      setError("All fields are required.");
      return;
    }

    try {
      // Fetch users from API
      const users = await fetchUsers();
      console.log("Fetched users:", users);

      // Safely check if email already exists
      if (users.some((u) => u?.email?.toLowerCase() === email.toLowerCase())) {
        setError("Email already registered.");
        return;
      }

      // Create patient user
      await createUser({ name, email, password, role: "patient" });
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError("Registration failed. Try again later.");
      console.error(err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper elevation={10} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Patient Registration
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

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth
              label="Full Name"
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 3, mb: 2 }}
            >
              Register
            </Button>
            <Typography variant="body2" align="center">
              Already registered?{" "}
              <Link to="/login" style={{ textDecoration: "none" }}>
                Login here
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </motion.div>
  );
}
