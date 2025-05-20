import React, { useEffect } from "react";
import { Box, Button, Typography, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import Footer from "./Footer";

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === "user") navigate("/user");
      else if (user.role === "doctor") navigate("/doctor");
      else if (user.role === "admin") navigate("/admin");
    }
  }, [user, navigate]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url("/hospitalDesk.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        color: "#fff",
      }}
    >
      {/* Main content grows */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: { xs: 2, sm: 4, md: 6 }, // padding left-right responsive
          py: { xs: 3, sm: 4, md: 6 }, // padding top-bottom responsive
          textAlign: "center",
        }}
      >
        <Container maxWidth="sm" sx={{ px: { xs: 1, sm: 2 }, textAlign: "center" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            {/* Typing effect on Welcome text with 2 spaces at the end */}
            <TypingEffect text="Welcome to MyHealthApp  " variant="h3" />

            {/* Subtitle static text */}
            <Typography
              variant="subtitle1"
              sx={{
                mb: 5,
                fontWeight: 400,
                color: "#00ffe1",
                textShadow: "0 2px 6px rgba(0, 255, 234, 0.7)",
                letterSpacing: 0.7,
                px: { xs: 1, sm: 0 }, // slight padding on xs to avoid overflow
              }}
            >
              A streamlined hospital management platform.
            </Typography>

            <Box
              sx={{
                mt: 4,
                display: "inline-flex",
                background: "linear-gradient(45deg, #00bcd4, #00ffea)",
                borderRadius: 3,
                boxShadow: "0 6px 15px rgba(0, 188, 212, 0.6)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: "0 10px 30px rgba(0, 255, 234, 0.9)",
                  transform: "scale(1.1)",
                  background: "linear-gradient(45deg, #00ffe1, #00c6ff)",
                },
              }}
            >
              <Button
                variant="text"
                size="large"
                onClick={() => navigate("/login")}
                sx={{
                  color: "#004d40",
                  px: { xs: 3, sm: 6 },
                  py: { xs: 1.2, sm: 1.8 },
                  fontWeight: 700,
                  letterSpacing: 1.2,
                  fontSize: { xs: "1rem", sm: "1.125rem" },
                  minWidth: { xs: "140px", sm: "180px" },
                }}
              >
                Login
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
}

// Typing effect component with blinking cursor
function TypingEffect({ text, variant = "h3" }) {
  const [width, setWidth] = React.useState("0ch");

  React.useEffect(() => {
    const length = text.length;
    const duration = length * 120; // 120ms per character
    let start;

    function step(timestamp) {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      setWidth(`${Math.floor(progress * length)}ch`);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }, [text]);

  return (
    <Typography
      variant={variant}
      sx={{
        fontFamily: "'Courier New', Courier, monospace",
        color: "#00ffe1",
        whiteSpace: "pre",
        overflow: "hidden",
        borderRight: "3px solid #00c6ff",
        width,
        mx: "auto",
        userSelect: "none",
        letterSpacing: "2px",
        mb: 3,
        textShadow: "0 4px 10px rgba(0,0,0,0.8)",
        transition: "width 0.1s linear",
        fontSize: {
          xs: "1.75rem", // smaller font size on mobile
          sm: "2.25rem",
          md: "2.75rem",
        },
        maxWidth: "100%",
      }}
    >
      {text}
      <BlinkingCursor />
    </Typography>
  );
}

function BlinkingCursor() {
  return (
    <Box
      component="span"
      sx={{
        display: "inline-block",
        width: "3px",
        height: "1.3em",
        backgroundColor: "#00c6ff",
        marginLeft: "4px",
        animation: "blink 1.2s infinite",
        verticalAlign: "bottom",
      }}
    >
      <style>
        {`
          @keyframes blink {
            0%, 50%, 100% { opacity: 1; }
            25%, 75% { opacity: 0; }
          }
        `}
      </style>
    </Box>
  );
}
