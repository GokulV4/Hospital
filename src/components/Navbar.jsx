import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "#1565c0" }}>
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, color: "white", textDecoration: "none" }}>
          HOS - Hospital Management
        </Typography>

        {user ? (
          <>
            <Button
              color="inherit"
              onClick={() => {
                if (user.role === "patient") navigate("/patient");
                else if (user.role === "doctor") navigate("/doctor");
                else if (user.role === "admin") navigate("/admin");
              }}
            >
              Dashboard
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/register">
              Register
            </Button>
          </>
        )}

        {/* Mobile menu */}
        <Box sx={{ display: { xs: "block", md: "none" } }}>
          <IconButton
            size="large"
            aria-label="menu"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>

          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={open}
            onClose={handleClose}
          >
            {user ? (
              <>
                <MenuItem
                  onClick={() => {
                    handleClose();
                    if (user.role === "patient") navigate("/patient");
                    else if (user.role === "doctor") navigate("/doctor");
                    else if (user.role === "admin") navigate("/admin");
                  }}
                >
                  Dashboard
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleClose();
                    handleLogout();
                  }}
                >
                  Logout
                </MenuItem>
              </>
            ) : (
              <>
                <MenuItem onClick={() => { handleClose(); navigate("/login") }}>
                  Login
                </MenuItem>
                <MenuItem onClick={() => { handleClose(); navigate("/register") }}>
                  Register
                </MenuItem>
              </>
            )}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
