import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ViewDebts from "./pages/ViewDebts";
import DataAnalysis from "./pages/DataAnalysis";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token")); // Ελέγχουμε αν υπάρχει token

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/" element={isAuthenticated ? <Layout setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/" />} >
        <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/view-debts" element={<ViewDebts />} />
          <Route path="/data-analysis" element={<DataAnalysis />} />
        </Route>
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
