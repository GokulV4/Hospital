// src/components/LogoutButton.js
import React from "react";
import { Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <Button
      variant="outlined"
      startIcon={<LogoutIcon />}
      onClick={handleLogout}
      sx={{
        textTransform: "none",
        fontWeight: "bold",
        color: "primary.main",
        borderColor: "primary.main",
        transition: "all 0.3s ease",
        "&:hover": {
          backgroundColor: "primary.main",
          color: "white",
          transform: "scale(1.05)",
          boxShadow: "0 0 10px rgba(25,118,210,0.7)",
        },
        "& .MuiSvgIcon-root": {
          transition: "transform 0.3s ease",
        },
        "&:hover .MuiSvgIcon-root": {
          transform: "rotate(360deg)",
        },
      }}
    >
      Logout
    </Button>
  );
}
