import React, { useState, useEffect } from "react";
import axios from "axios";

const ViewDebts = () => {
  const defaultStartDate = "2010-01-01";
  const defaultFinishDate = "2025-12-31";

  const [startDate, setStartDate] = useState("");
  const [finishDate, setFinishDate] = useState("");
  const [debts, setDebts] = useState(null);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paidDebts, setPaidDebts] = useState(new Set()); // ⬅️ Παρακολουθούμε τις πληρωμένες οφειλές

  const operatorID = localStorage.getItem("operatorId");

  const fetchDebts = async () => {
    try {
      setLoading(true);
      setError(null);

      const finalStartDate = startDate || defaultStartDate;
      const finalFinishDate = finishDate || defaultFinishDate;

      const response = await axios.get(
        `https://localhost:3001/api/debts/${operatorID}/${finalStartDate}/${finalFinishDate}`
      );
      setDebts(response.data);
    } catch (error) {
      console.error("Error fetching debts:", error);
      setError("Failed to fetch debts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactionHistory = async () => {
    try {
      const response = await axios.get(
        `https://localhost:3001/api/transactions/${operatorID}`
      );
      setTransactionHistory(response.data.transactions);
    } catch (error) {
      console.error("Error fetching transaction history:", error);
    }
  };

  useEffect(() => {
    fetchTransactionHistory();
  }, []);

  const handlePayDebt = async (otherOperator, amount) => {
    try {
      await axios.post("https://localhost:3001/api/pay-debt", {
        operator_from: operatorID,
        operator_to: otherOperator,
        amount: amount,
      });

      setPaidDebts((prev) => new Set([...prev, otherOperator])); // ✅ Αποθηκεύουμε ότι πληρώθηκε
      alert("Debt paid successfully!");

      fetchDebts();
      fetchTransactionHistory();
    } catch (error) {
      console.error("Error paying debt:", error);
      alert("Failed to pay debt.");
    }
  };

  const clearFilters = () => {
    setStartDate("");
    setFinishDate("");
    setDebts(null);
  };

  return (
    <div style={{ minHeight: "100vh", padding: "20px", background: "#f8f9fa" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px", background: "white", borderRadius: "8px" }}>
        <h1>View Debts</h1>
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
          <label>
            Start Date:
            <input
              type="date"
              value={startDate || defaultStartDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>
          <label>
            Finish Date:
            <input
              type="date"
              value={finishDate || defaultFinishDate}
              onChange={(e) => setFinishDate(e.target.value)}
            />
          </label>
          <button onClick={fetchDebts} style={{ backgroundColor: "#007bff", color: "#fff", padding: "6px 12px", borderRadius: "4px" }}>
            Apply Filters
          </button>
          <button onClick={clearFilters} style={{ backgroundColor: "#6c757d", color: "#fff", padding: "6px 12px", borderRadius: "4px" }}>
            Clear Filters
          </button>
        </div>

        {loading && <p>Loading debts...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {debts && (
          <>
            <h2>Debt Summary</h2>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
              <thead>
                <tr>
                  <th style={{ backgroundColor: "#f2f2f2", padding: "8px", borderBottom: "2px solid #ccc" }}>Operator</th>
                  <th style={{ backgroundColor: "#f2f2f2", padding: "8px", borderBottom: "2px solid #ccc" }}>Debt (€)</th>
                  <th style={{ backgroundColor: "#f2f2f2", padding: "8px", borderBottom: "2px solid #ccc" }}>Credit (€)</th>
                  <th style={{ backgroundColor: "#f2f2f2", padding: "8px", borderBottom: "2px solid #ccc" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {debts.debtsToOthers.map((debt) => {
                  const correspondingCredit = debts.debtsToMe.find(
                    (credit) => credit.other_operator === debt.other_operator
                  );

                  const isPaid = paidDebts.has(debt.other_operator) || debt.total_amount_owed === 0; // ✅ Αν είναι ήδη πληρωμένο ή 0€

                  return (
                    <tr key={debt.other_operator}>
                      <td style={{ padding: "8px", borderBottom: "1px solid #ccc" }}>{debt.operator_name}</td>
                      <td style={{ padding: "8px", borderBottom: "1px solid #ccc" }}>{debt.total_amount_owed}€</td>
                      <td style={{ padding: "8px", borderBottom: "1px solid #ccc" }}>
                        {correspondingCredit ? correspondingCredit.total_amount_due : "0"}€
                      </td>
                      <td style={{ padding: "8px", borderBottom: "1px solid #ccc" }}>
                        {isPaid ? ( // ✅ Αν είναι πληρωμένο, δείχνουμε "Paid"
                          <button style={{ backgroundColor: "#6c757d", color: "#fff", padding: "6px 12px", borderRadius: "4px", cursor: "not-allowed" }} disabled>
                            Paid
                          </button>
                        ) : (
                          <button
                            onClick={() => handlePayDebt(debt.other_operator, debt.total_amount_owed)}
                            style={{ backgroundColor: "#28a745", color: "#fff", padding: "6px 12px", borderRadius: "4px", cursor: "pointer" }}
                          >
                            Pay Debt
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <h2 style={{ marginTop: "30px" }}>Transaction History</h2>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Amount (€)</th>
                </tr>
              </thead>
              <tbody>
                {transactionHistory.length > 0 ? (
                  transactionHistory.map((transaction, index) => (
                    <tr key={index}>
                      <td>{transaction.payment_date}</td>
                      <td>{transaction.from_name}</td>
                      <td>{transaction.to_name}</td>
                      <td>{transaction.poso}€</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center" }}>No transactions found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default ViewDebts;
