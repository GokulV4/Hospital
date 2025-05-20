import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LoginIcon from "@mui/icons-material/Login";
import HomeIcon from "@mui/icons-material/Home";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      const loggedInUser = await login(email, password);
      if (loggedInUser.role === "patient") return navigate("/patient");
      if (loggedInUser.role === "doctor") return navigate("/doctor");
      if (loggedInUser.role === "admin") return navigate("/admin");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      style={{
        background: "linear-gradient(to right, #8e2de2, #4a00e0)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 4,
            backdropFilter: "blur(10px)",
            background: "rgba(255, 255, 255, 0.1)",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
            border: "1px solid rgba(255, 255, 255, 0.18)",
            color: "#fff",
            transition: "all 0.3s ease",
            ":hover": {
              boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
            },
          }}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              sx={{
                fontWeight: "bold",
                background: "-webkit-linear-gradient(45deg, #ff8a00, #e52e71)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Welcome Back
            </Typography>

            {error && (
              <Alert severity="error" sx={{ my: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                fullWidth
                label="Email"
                type="email"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                sx={{
                  input: { color: "white" },
                  label: { color: "#bbb" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#ccc" },
                    "&:hover fieldset": { borderColor: "#fff" },
                  },
                }}
              />
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                sx={{
                  input: { color: "white" },
                  label: { color: "#bbb" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#ccc" },
                    "&:hover fieldset": { borderColor: "#fff" },
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: "#fff" }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                startIcon={<LoginIcon />}
                sx={{
                  mt: 3,
                  mb: 2,
                  background:
                    "linear-gradient(135deg, #ff416c, #ff4b2b)",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  ":hover": {
                    background: "linear-gradient(135deg, #ff4b2b, #ff416c)",
                  },
                }}
              >
                Login
              </Button>

              <Typography variant="body2" align="center" sx={{ color: "#ddd" }}>
                New patient?{" "}
                <Link to="/register" style={{ color: "#00e5ff" }}>
                  Register here
                </Link>
              </Typography>
            </Box>

            <Button
              variant="outlined"
              fullWidth
              startIcon={<HomeIcon />}
              sx={{
                mt: 3,
                borderColor: "#fff",
                color: "#fff",
                ":hover": {
                  backgroundColor: "rgba(255,255,255,0.1)",
                  borderColor: "#fff",
                },
              }}
              onClick={() => navigate("/")}
            >
              Home
            </Button>
          </motion.div>
        </Paper>
      </Container>
    </motion.div>
  );
}
