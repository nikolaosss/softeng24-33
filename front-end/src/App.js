import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import DataAnalysis from './pages/DataAnalysis';
import ViewDebts from './pages/ViewDebts';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/data-analysis" element={<DataAnalysis />} />
        <Route path="/view-debts" element={<ViewDebts />} />
        <Route path="*" element={<div>404 - Page Not Found</div>} /> {/* Catch-all route */}
      </Routes>
    </Router>
  );
}

export default App;
