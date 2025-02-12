import React, { useState } from "react";
import axios from "axios";

const ViewDebts = () => {
  const [startDate, setStartDate] = useState("");
  const [finishDate, setFinishDate] = useState("");
  const [debts, setDebts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDebts = async () => {
    try {
      setLoading(true);
      setError(null);
      const operatorID = localStorage.getItem("operatorId");
      const response = await axios.get(
        `http://localhost:3001/api/debts/${operatorID}/${startDate}/${finishDate}`
      );
      setDebts(response.data);
    } catch (error) {
      console.error("Error fetching debts:", error);
      setError("Failed to fetch debts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setStartDate("");
    setFinishDate("");
    setDebts(null);
  };

  const backgroundStyle = {
    minHeight: "100vh",
    margin: 0,
    padding: 0,
    background: `url("https://images.pexels.com/photos/315938/pexels-photo-315938.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")
                 no-repeat center center fixed`,
    backgroundSize: "cover",
  };

  const contentBoxStyle = {
    maxWidth: "900px",
    margin: "0 auto",
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: "20px",
    borderRadius: "8px",
    fontFamily: "Arial, sans-serif",
    position: "relative",
  };

  const filterSectionStyle = {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    alignItems: "center",
    flexWrap: "wrap",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "10px",
  };

  const thStyle = {
    backgroundColor: "#f2f2f2",
    textAlign: "left",
    padding: "8px",
    borderBottom: "2px solid #ccc",
  };

  const tdStyle = {
    padding: "8px",
    borderBottom: "1px solid #ccc",
  };

  const buttonStyle = {
    padding: "6px 12px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  };

  return (
    <div style={backgroundStyle}>
      <div style={contentBoxStyle}>
        <h1>View Debts</h1>
        <div style={filterSectionStyle}>
          <label>
            Start Date:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{ padding: "4px" }}
            />
          </label>
          <label>
            Finish Date:
            <input
              type="date"
              value={finishDate}
              onChange={(e) => setFinishDate(e.target.value)}
              style={{ padding: "4px" }}
            />
          </label>
          <button
            onClick={fetchDebts}
            style={{ ...buttonStyle, backgroundColor: "#007bff", color: "#fff" }}
          >
            Apply Filters
          </button>
          <button
            onClick={clearFilters}
            style={{ ...buttonStyle, backgroundColor: "#6c757d", color: "#fff" }}
          >
            Clear Filters
          </button>
        </div>

        {loading && <p>Loading debts...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {debts && (
          <>
            <h2>Debt Summary</h2>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Other Operator</th>
                  <th style={thStyle}>Debt (€)</th>
                  <th style={thStyle}>Credit (€)</th>
                </tr>
              </thead>
              <tbody>
                {debts.debtsToOthers.map((debt) => (
                  <tr key={debt.other_operator}>
                    <td style={tdStyle}>{debt.operator_name}</td>
                    <td style={tdStyle}>{debt.total_amount_owed}€</td>
                    <td style={tdStyle}>{debt.total_amount_due}€</td>
                  </tr>
                ))}
                {debts.debtsToMe.map((debt) => (
                  <tr key={debt.other_operator}>
                    <td style={tdStyle}>{debt.operator_name}</td>
                    <td style={tdStyle}>-</td>
                    <td style={tdStyle}>{debt.total_amount_due}€</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default ViewDebts;
