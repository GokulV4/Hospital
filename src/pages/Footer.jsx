import React from "react";
import { Box, Typography, Link } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        backgroundColor: "#1565c0",
        color: "white",
        textAlign: "center",
        flexShrink: 0,  // prevents footer from shrinking in flex container
      }}
    >
      <Typography variant="body1">
        Contact us:{" "}
        <Link href="mailto:contact@hoshospital.com" color="inherit" underline="hover">
          tes@hospital.com
        </Link>{" "}
        | Phone: +1 234 567 8901
      </Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>
        &copy; {new Date().getFullYear()} HOS Hospital Management System. All rights reserved.
      </Typography>
    </Box>
  );
}
