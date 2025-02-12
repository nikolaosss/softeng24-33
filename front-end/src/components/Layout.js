import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Box } from "@mui/material";
import axios from "axios";  // ✅ Import axios

const Layout = ({ setIsAuthenticated }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide AppBar on login page
  if (location.pathname === "/") {
    return <Outlet />;
  }
  const BASE_URL = "http://localhost:3001"; // URL του backend server

  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
        console.warn("No token found, redirecting to login.");
        setIsAuthenticated(false);
        navigate("/");
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/api/logout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json", //  ✅ Ορίζουμε το JSON format
                "x-observatory-auth": token,       // ✅ Σωστή αποστολή token
            },
        });

        if (!response.ok) {
            throw new Error("Failed to log out from the server.");
        }

        console.log("Logout successful");

    } catch (error) {
        console.error("Logout error:", error);
    }

    // ✅ Clear localStorage and update state
    localStorage.clear();
    setIsAuthenticated(false);
    navigate("/");
};

  return (
    <div>
      <AppBar position="static" sx={{ backgroundColor: "#003366" }}> 
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
            <Typography variant="h6" sx={{ color: "#FFFFFF" }}>
              CONNEC
            </Typography>
            <Typography variant="h6" sx={{ color: "#FF6347", fontWeight: "bold" }}>
              T.OLL
            </Typography>
          </Box>

          <Button sx={{ color: "#FFFFFF" }} onClick={() => navigate("/dashboard")}>
            Home
          </Button>
          <Button sx={{ color: "#FFFFFF" }} onClick={() => navigate("/view-debts")}>
            View Debts
          </Button>
          <Button sx={{ color: "#FFFFFF" }} onClick={() => navigate("/data-analysis")}>
            Data Analysis
          </Button>
          <Button
            sx={{ color: "#FF6347", fontWeight: "bold" }} 
            onClick={handleLogout} // ✅ Logout function
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Outlet />
    </div>
  );
};

export default Layout;
