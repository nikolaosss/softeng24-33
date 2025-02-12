import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, TextField, Button } from "@mui/material";
import { motion } from "framer-motion";

const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [gateOpen, setGateOpen] = useState(false); // State to control the bar animation
  const navigate = useNavigate();

  const BASE_URL = "https://localhost:3001"; // URL του backend server

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`${BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setGateOpen(true); // Open the gate animation
        localStorage.setItem("token", data.token);
        localStorage.setItem("operatorId", data.operatorId);
        localStorage.setItem("operatorName", data.operatorName); // ✅ Σωστή αποθήκευση operatorName
  
        setTimeout(() => {
          setIsAuthenticated(true);
          navigate("/dashboard");
        }, 2000); 
      } else {
        setError(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("Failed to connect to the server.");
    }
  };
  
  
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundImage:
          "url('https://wallup.net/wp-content/uploads/2019/09/653003-mountains-landscape-nature-mountain-road.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          width: "100%",
          maxWidth: "400px",
          marginBottom: "2rem",
        }}
      >
        <Card style={{ width: "100%", overflow: "hidden" }}>
          <CardContent>
            <h1 style={{ textAlign: "center", marginBottom: "1rem" }}>CONNECT.OLL</h1>
            <form onSubmit={handleLogin}>
              <TextField
                label="Username"
                fullWidth
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && (
                <p style={{ color: "red", fontSize: 14, marginTop: "0.5rem" }}>{error}</p>
              )}
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Animated Toll Bar */}
      <motion.div
        style={{
          width: "100%",
          maxWidth: "450px",
          height: "12px",
          marginTop: "-1.5rem",
          background:
            "repeating-linear-gradient(90deg, #fff, #fff 20px, #900606 20px, #900606 40px)",
          transformOrigin: "left center",
          borderRadius: "2px",
        }}
        initial={{ rotate: 0 }}
        animate={gateOpen ? { rotate: -90 } : { rotate: 0 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
    </div>
  );
};

export default Login;
