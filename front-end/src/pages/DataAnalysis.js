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

  const operatorName = localStorage.getItem("operatorName");

  // ✅ Function to generate a range of dates from start to end
  const generateDateRange = (start, end) => {
    let dates = [];
    let currentDate = new Date(start);
    let endDate = new Date(end);

    while (currentDate <= endDate) {
      dates.push(currentDate.toISOString().split("T")[0]); // YYYY-MM-DD
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

  const fetchTollStationPasses = async () => {
    try {
      setLoading(true);
      setError(null);

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

      const ids = stationIDs.split(",").map((id) => id.trim());

      let revenueData = {};
      let expenseData = {}; // Stores expenses per external operator

      for (const stationID of ids) {
        const url = `http://localhost:3001/api/tollStationPasses/${stationID}/${formattedDateFrom}/${formattedDateTo}`;

        const response = await axios.get(url, {
          headers: { "x-observatory-auth": token },
        });

        const rawData = response.data.passList;

        rawData.forEach((pass) => {
          const date = new Date(pass.timestamp).toISOString().split("T")[0];

          // ✅ Revenue Logic: If stationOperator == operatorName OR tagProvider == operatorName
          if (pass.stationOperator === operatorName || pass.tagProvider === operatorName) {
            revenueData[date] = (revenueData[date] || 0) + pass.passCharge;
          }

          // ✅ Expenses Logic: If stationOperator == operatorName BUT tagProvider is DIFFERENT
          if (pass.stationOperator === operatorName && pass.tagProvider !== operatorName) {
            if (!expenseData[pass.tagProvider]) {
              expenseData[pass.tagProvider] = {};
            }
            expenseData[pass.tagProvider][date] =
              (expenseData[pass.tagProvider][date] || 0) + pass.passCharge;
          }
        });
      }

      // ✅ Create a full date range from startDate to finishDate
      let sortedDates = generateDateRange(startDate || "2010-01-01", finishDate || "2025-02-13");

      let cumulativeRev = 0;
      let formattedRevenue = sortedDates.map((date) => {
        cumulativeRev += revenueData[date] || 0;
        return { date, revenue: cumulativeRev };
      });

      // ✅ Process and align expense data
      let formattedExpenses = processExpenseData(expenseData, sortedDates);

      setCumulativeRevenue(formattedRevenue);
      setCumulativeExpenses(formattedExpenses);
    } catch (err) {
      console.error("Error fetching toll station passes:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Function to properly format expenses and prevent duplicate dates
  const processExpenseData = (expenseData, sortedDates) => {
    let cumulativeExpenses = {}; // Object to store cumulative expenses per operator
    let processedExpenses = []; // The final array of objects for the graph

    // Initialize cumulative tracking
    let cumulativeTracker = {};
    Object.keys(expenseData).forEach((operator) => {
      cumulativeTracker[operator] = 0;
    });

    // Iterate over all dates and build an aligned dataset
    sortedDates.forEach((date) => {
      let entry = { date };

      Object.keys(expenseData).forEach((operator) => {
        cumulativeTracker[operator] += expenseData[operator][date] || 0;
        entry[operator] = cumulativeTracker[operator];
      });

      processedExpenses.push(entry);
    });

    return processedExpenses;
  };

  const handleClearFilters = () => {
    setStartDate("");
    setFinishDate("");
    setStationIDs("");
    setCumulativeRevenue([]);
    setCumulativeExpenses([]);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Data Analysis</h1>

      {/* Filters Section */}
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        <label>
          Station IDs (comma-separated):
          <input
            type="text"
            value={stationIDs}
            onChange={(e) => setStationIDs(e.target.value)}
            placeholder="Enter Station IDs (e.g., Station_1, Station_2)"
          />
        </label>

        <label>
          Start Date:
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </label>

        <label>
          Finish Date:
          <input type="date" value={finishDate} onChange={(e) => setFinishDate(e.target.value)} />
        </label>

        <button onClick={fetchTollStationPasses} disabled={loading}>
          Apply Filters
        </button>

        <button onClick={handleClearFilters}>Clear Filters</button>
      </div>

      {/* Charts Section */}
      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        {/* Revenue Chart */}
        <div style={{ flex: 1 }}>
          <h2>Revenue (Cumulative)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={cumulativeRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#4CAF50" name="Revenue (€)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Expense Chart */}
        <div style={{ flex: 1 }}>
          <h2>Expenses (Cumulative)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={cumulativeExpenses}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {Object.keys(cumulativeExpenses[0] || {}).filter(k => k !== "date").map((operator, index) => (
                <Line
                  key={index}
                  type="monotone"
                  dataKey={operator}
                  stroke={`hsl(${(index * 60) % 360}, 70%, 50%)`}
                  name={`Expense from ${operator} (€)`}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
    </div>
  );
}

export default DataAnalysis;
