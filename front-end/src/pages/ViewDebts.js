import React, { useState } from 'react';

const ViewDebts = () => {
  const [startDate, setStartDate] = useState('');
  const [finishDate, setFinishDate] = useState('');
  const [appliedStartDate, setAppliedStartDate] = useState('');
  const [appliedFinishDate, setAppliedFinishDate] = useState('');
  const [transactions, setTransactions] = useState([
    { id: 1, from: 'Alice', to: 'Bob', value: 100, date: '2025-01-01' },
    { id: 2, from: 'Charlie', to: 'David', value: 200, date: '2025-01-05' },
    { id: 3, from: 'Eve', to: 'Frank', value: 50, date: '2025-01-10' },
    { id: 4, from: 'Grace', to: 'Hank', value: 300, date: '2025-01-15' },
  ]);

  const [operators, setOperators] = useState([
    { id: 1, credit: 500, debit: 200 },
    { id: 2, credit: 300, debit: 100 },
    { id: 3, credit: 700, debit: 400 },
    { id: 4, credit: 600, debit: 300 },
    { id: 5, credit: 800, debit: 500 },
    { id: 6, credit: 400, debit: 200 },
  ]);

  const applyFilters = () => {
    setAppliedStartDate(startDate);
    setAppliedFinishDate(finishDate);
  };

  const clearFilters = () => {
    setStartDate('');
    setFinishDate('');
    setAppliedStartDate('');
    setAppliedFinishDate('');
  };

  const handleConfirm = (operatorId) => {
    setOperators((prevOperators) =>
      prevOperators.map((operator) =>
        operator.id === operatorId ? { ...operator, debit: 0 } : operator
      )
    );
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    const start = new Date(appliedStartDate);
    const finish = new Date(appliedFinishDate);
    return (!appliedStartDate || transactionDate >= start) &&
           (!appliedFinishDate || transactionDate <= finish);
  });

  return (
    <div>
      <h1>View Debts</h1>
      <p>This is the View Debts page. Here, you will display debts and related data.</p>

      {/* Filters Section */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <div>
          <label htmlFor="start-date">Start Date: </label>
          <input
            type="date"
            id="start-date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="finish-date">Finish Date: </label>
          <input
            type="date"
            id="finish-date"
            value={finishDate}
            onChange={(e) => setFinishDate(e.target.value)}
          />
        </div>
        <button onClick={applyFilters}>Apply Filters</button>
        <button onClick={clearFilters}>Clear Filters</button>
      </div>

      {/* Transactions History */}
      <div>
        <h4>Transaction History</h4>
        {filteredTransactions.length > 0 ? (
          <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th>From</th>
                <th>To</th>
                <th>Value</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.from}</td>
                  <td>{transaction.to}</td>
                  <td>${transaction.value}</td>
                  <td>{transaction.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No transactions found for the selected dates.</p>
        )}
      </div>

      {/* Debt Summary */}
      <div style={{ marginTop: '20px' }}>
        <h4>Debt Summary</h4>
        <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th>Operator</th>
              <th>Credit</th>
              <th>Debit</th>
              <th>Payment</th>
            </tr>
          </thead>
          <tbody>
            {operators.map((operator) => (
              <tr key={operator.id}>
                <td>Operator {operator.id}</td>
                <td>${operator.credit}</td>
                <td>${operator.debit}</td>
                <td>
                  <button onClick={() => handleConfirm(operator.id)}>Confirm</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewDebts;