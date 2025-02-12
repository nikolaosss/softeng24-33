import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

function DataAnalysis() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [finishDate, setFinishDate] = useState("");
  const [stationIDs, setStationIDs] = useState("");
  const [cumulativeRevenue, setCumulativeRevenue] = useState([]);
  const [cumulativeExpenses, setCumulativeExpenses] = useState([]);
  const [rawPassData, setRawPassData] = useState([]);

  const operatorName = localStorage.getItem("operatorName");

  const generateDateRange = (start, end) => {
    let dates = [];
    let currentDate = new Date(start);
    let endDate = new Date(end);

    while (currentDate <= endDate) {
      dates.push(currentDate.toISOString().split("T")[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  const convertToCSV = (arr, columns) => {
    const csvContent = [
      columns.join(","),
      ...arr.map(item =>
        columns
          .map(field => `"${String(item[field] || "").replace(/"/g, '""')}"`)
          .join(",")
      )
    ].join("\n");
    return csvContent;
  };

  const downloadCSV = (data, filename) => {
    if (data.length === 0) {
      setError("No data to download");
      return;
    }
    
    const columns = Object.keys(data[0]);
    const csv = convertToCSV(data, columns);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const downloadRevenueCSV = () => {
    const revenueData = rawPassData.filter(
      pass => pass.stationOperator === operatorName || pass.tagProvider === operatorName
    );
    downloadCSV(revenueData, "revenue_data.csv");
  };

  const downloadExpensesCSV = () => {
    const expenseData = rawPassData.filter(
      pass => pass.stationOperator === operatorName && pass.tagProvider !== operatorName
    );
    downloadCSV(expenseData, "expenses_data.csv");
  };

  const fetchTollStationPasses = async () => {
    try {
      setLoading(true);
      setError(null);
      setRawPassData([]);

      if (!stationIDs) {
        setError("Please enter at least one station ID.");
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        setError("You need to log in first.");
        setLoading(false);
        return;
      }

      const formattedDateFrom = startDate ? startDate.replace(/-/g, "") : "20100101";
      const formattedDateTo = finishDate ? finishDate.replace(/-/g, "") : "20250213";
      const ids = stationIDs.split(",").map(id => id.trim());

      let allPasses = [];
      let revenueData = {};
      let expenseData = {};

      for (const stationID of ids) {
        const url = `https://localhost:3001/api/tollStationPasses/${stationID}/${formattedDateFrom}/${formattedDateTo}`;
        const response = await axios.get(url, {
          headers: { "x-observatory-auth": token },
        });
        
        const rawData = response.data.passList;
        allPasses = [...allPasses, ...rawData];

        rawData.forEach(pass => {
          const date = new Date(pass.timestamp).toISOString().split("T")[0];
          
          if (pass.stationOperator === operatorName || pass.tagProvider === operatorName) {
            revenueData[date] = (revenueData[date] || 0) + pass.passCharge;
          }

          if (pass.stationOperator === operatorName && pass.tagProvider !== operatorName) {
            if (!expenseData[pass.tagProvider]) {
              expenseData[pass.tagProvider] = {};
            }
            expenseData[pass.tagProvider][date] =
              (expenseData[pass.tagProvider][date] || 0) + pass.passCharge;
          }
        });
      }

      const sortedDates = generateDateRange(startDate || "2010-01-01", finishDate || "2025-02-13");
      
      let cumulativeRev = 0;
      const formattedRevenue = sortedDates.map(date => {
        cumulativeRev += revenueData[date] || 0;
        return { date, revenue: cumulativeRev };
      });

      let cumulativeExpTracker = {};
      const formattedExpenses = sortedDates.map(date => {
        const entry = { date };
        Object.keys(expenseData).forEach(operator => {
          cumulativeExpTracker[operator] = (cumulativeExpTracker[operator] || 0) + (expenseData[operator][date] || 0);
          entry[operator] = cumulativeExpTracker[operator];
        });
        return entry;
      });

      setRawPassData(allPasses);
      setCumulativeRevenue(formattedRevenue);
      setCumulativeExpenses(formattedExpenses);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setStartDate("");
    setFinishDate("");
    setStationIDs("");
    setCumulativeRevenue([]);
    setCumulativeExpenses([]);
    setRawPassData([]);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Data Analysis</h1>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        <label>
          Station IDs:
          <input
            type="text"
            value={stationIDs}
            onChange={(e) => setStationIDs(e.target.value)}
            placeholder="e.g., Station_1, Station_2"
            style={{ marginLeft: "10px" }}
          />
        </label>

        <label>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ marginLeft: "10px" }}
          />
        </label>

        <label>
          Finish Date:
          <input
            type="date"
            value={finishDate}
            onChange={(e) => setFinishDate(e.target.value)}
            style={{ marginLeft: "10px" }}
          />
        </label>

        <button 
          onClick={fetchTollStationPasses} 
          disabled={loading}
          style={{ padding: "5px 15px" }}
        >
          {loading ? "Loading..." : "Apply Filters"}
        </button>

        <button 
          onClick={handleClearFilters}
          style={{ padding: "5px 15px" }}
        >
          Clear Filters
        </button>
      </div>

      <div style={{ display: "flex", gap: "20px", marginTop: "30px" }}>
        <div style={{ flex: 1, padding: "20px", backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
          <h2 style={{ color: "#4CAF50" }}>Revenue (Cumulative)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={cumulativeRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#4CAF50" 
                strokeWidth={2}
                name="Revenue (€)" 
              />
            </LineChart>
          </ResponsiveContainer>
          <button
            onClick={downloadRevenueCSV}
            disabled={cumulativeRevenue.length === 0}
            style={{
              marginTop: "15px",
              padding: "8px 20px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Download Revenue Data
          </button>
        </div>

        <div style={{ flex: 1, padding: "20px", backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
          <h2 style={{ color: "#ff5722" }}>Debts (Cumulative)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={cumulativeExpenses}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {cumulativeExpenses.length > 0 &&
                Object.keys(cumulativeExpenses[0])
                  .filter(k => k !== "date")
                  .map((operator, index) => (
                    <Line
                      key={operator}
                      type="monotone"
                      dataKey={operator}
                      stroke={`hsl(${(index * 60) % 360}, 70%, 50%)`}
                      name={`${operator} (€)`}
                      strokeWidth={2}
                    />
                  ))}
            </LineChart>
          </ResponsiveContainer>
          <button
            onClick={downloadExpensesCSV}
            disabled={cumulativeExpenses.length === 0}
            style={{
              marginTop: "15px",
              padding: "8px 20px",
              backgroundColor: "#ff5722",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Download Debts Data
          </button>
        </div>
      </div>

      {error && (
        <div style={{ 
          marginTop: "20px", 
          padding: "15px", 
          backgroundColor: "#ffebee", 
          color: "#b71c1c",
          borderRadius: "4px"
        }}>
          Error: {error}
        </div>
      )}
    </div>
  );
}

export default DataAnalysis;