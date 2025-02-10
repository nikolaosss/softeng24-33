import React, { useState, useEffect } from 'react';
// Import your local "connect.oll" logo file from src/assets
import connectLogo from './assets/connect_oll_rounded_logo.png';

/**
 * Generate random daily usage data for 2025,
 * forcing "egnatia" as sender ~50% of the time.
 * This data never changes—only used to compute how much egnatia owes/owed to or by others.
 */
function generateUsageDataFor2025() {
  const operatorNames = [
    'aodos',
    'gefyra',
    'egnatia', // YOUR company
    'kentrikiodos',
    'moreas',
    'neaodos',
    'olympiaodos',
  ];

  const start = new Date(2025, 0, 1);  // 2025-01-01
  const end = new Date(2025, 11, 31); // 2025-12-31
  const usageData = [];
  let idCounter = 1;

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    // 50% chance to force egnatia as sender
    const forceEgnatia = Math.random() < 0.5;

    let fromOp, toOp;
    if (forceEgnatia) {
      fromOp = 'egnatia';
      const others = operatorNames.filter(op => op !== 'egnatia');
      toOp = others[Math.floor(Math.random() * others.length)];
    } else {
      const fromIndex = Math.floor(Math.random() * operatorNames.length);
      let toIndex = Math.floor(Math.random() * operatorNames.length);
      while (toIndex === fromIndex) {
        toIndex = Math.floor(Math.random() * operatorNames.length);
      }
      fromOp = operatorNames[fromIndex];
      toOp = operatorNames[toIndex];
    }

    const value = Math.floor(Math.random() * 291) + 10; // $10 - $300
    const dateString = d.toISOString().split('T')[0];

    usageData.push({
      id: idCounter++,
      from: fromOp,
      to: toOp,
      value,
      date: dateString,
      // Could mark type: 'usage' if you want
    });
  }

  return usageData;
}

const ViewDebts = () => {
  // ====== States for Date Filters ======
  const [startDate, setStartDate] = useState('');
  const [finishDate, setFinishDate] = useState('');
  const [appliedStartDate, setAppliedStartDate] = useState('');
  const [appliedFinishDate, setAppliedFinishDate] = useState('');
  const [hasAppliedFilters, setHasAppliedFilters] = useState(false);

  // 1) USAGE DATA: random toll usage for 2025
  const [usageData] = useState(() => generateUsageDataFor2025());

  // 2) BANK PAYMENTS: starts empty, each "Confirm" adds a new record
  const [bankPayments, setBankPayments] = useState([]);

  // Summaries: { operatorName: { egnatiaOwes, theyOweEgnatia } }
  const [debtSummary, setDebtSummary] = useState({});

  /**
   * Filter application logic
   */
  const applyFilters = () => {
    setAppliedStartDate(startDate);
    setAppliedFinishDate(finishDate);
    setHasAppliedFilters(true);
  };

  const clearFilters = () => {
    setStartDate('');
    setFinishDate('');
    setAppliedStartDate('');
    setAppliedFinishDate('');
    setHasAppliedFilters(false);
    setDebtSummary({});
  };

  /**
   * Filter usageData: only egnatia-related + within date range
   */
  const filteredUsage = usageData.filter(item => {
    const involvesEgnatia = (item.from === 'egnatia' || item.to === 'egnatia');
    if (!involvesEgnatia) return false;

    if (!hasAppliedFilters) return true;
    const d = new Date(item.date);
    const start = appliedStartDate ? new Date(appliedStartDate) : null;
    const finish = appliedFinishDate ? new Date(appliedFinishDate) : null;

    if (start && d < start) return false;
    if (finish && d > finish) return false;
    return true;
  });

  /**
   * Filter bankPayments by same date range
   */
  const filteredPayments = bankPayments.filter(pay => {
    if (!hasAppliedFilters) return true;
    const d = new Date(pay.date);
    const start = appliedStartDate ? new Date(appliedStartDate) : null;
    const finish = appliedFinishDate ? new Date(appliedFinishDate) : null;

    if (start && d < start) return false;
    if (finish && d > finish) return false;
    return true;
  });

  /**
   * Build the Debt Summary from filteredUsage
   * Then merge with old summary so once egnatiaOwes=0, it stays 0.
   */
  useEffect(() => {
    if (!hasAppliedFilters) {
      setDebtSummary({});
      return;
    }

    const freshSummary = {};
    filteredUsage.forEach(item => {
      const otherOp = (item.from === 'egnatia') ? item.to : item.from;
      if (!freshSummary[otherOp]) {
        freshSummary[otherOp] = { egnatiaOwes: 0, theyOweEgnatia: 0 };
      }
      if (item.from === 'egnatia') {
        freshSummary[otherOp].egnatiaOwes += item.value;
      } else {
        freshSummary[otherOp].theyOweEgnatia += item.value;
      }
    });

    // Merge to preserve any operator already set to egnatiaOwes=0
    setDebtSummary(prev => {
      const merged = { ...freshSummary };
      for (const [opName, oldVals] of Object.entries(prev)) {
        if (merged[opName] && oldVals.egnatiaOwes === 0) {
          merged[opName].egnatiaOwes = 0;
        }
      }
      return merged;
    });
  }, [filteredUsage, hasAppliedFilters]);

  /**
   * Confirm Payment:
   * egnatia pays the entire owed amount, 
   * we create a new bankPayments entry with the REAL current date,
   * then set egnatiaOwes=0 for that operator.
   */
  const handleConfirmPayment = (otherOp) => {
    setDebtSummary(prev => {
      const updated = { ...prev };
      const owed = updated[otherOp]?.egnatiaOwes || 0;
      if (owed > 0) {
        // Use the actual system date in YYYY-MM-DD
        const today = new Date().toISOString().split('T')[0];

        const newPayment = {
          id: Date.now(),
          from: 'egnatia',
          to: otherOp,
          value: owed,
          date: today, // real current date
          // type: 'payment'
        };

        // Add to bankPayments
        setBankPayments(prevPay => [...prevPay, newPayment]);

        // Zero out egnatia's owed amount
        updated[otherOp].egnatiaOwes = 0;
      }
      return updated;
    });
  };

  // Convert debtSummary object to array for rendering
  const debtSummaryArray = Object.entries(debtSummary).sort((a, b) =>
    a[0].localeCompare(b[0])
  );

  // =============== Inline Styles ===============
  const backgroundStyle = {
    minHeight: '100vh',
    margin: 0,
    padding: 0,
    // Keep background stable / fixed
    background: `url("https://images.pexels.com/photos/315938/pexels-photo-315938.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")
                 no-repeat center center fixed`,
    backgroundSize: 'cover',
  };

  const contentWrapperStyle = {
    position: 'relative',
    zIndex: 1,
    minHeight: '100vh',
    overflow: 'auto',
    paddingTop: '40px',
    paddingBottom: '40px',
  };

  const contentBoxStyle = {
    maxWidth: '900px',
    margin: '0 auto',
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: '20px',
    borderRadius: '8px',
    fontFamily: 'Arial, sans-serif',
    position: 'relative',
  };

  // connect.oll logo pinned in top-left corner
  const logoStyle = {
    position: 'fixed',
    top: '20px',
    left: '20px',
    width: '220px',
    height: 'auto',
    zIndex: 9999,
  };

  const titleStyle = {
    fontSize: '1.8rem',
    marginBottom: '10px',
    fontWeight: 'bold',
  };

  const filterSectionStyle = {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    alignItems: 'center',
    flexWrap: 'wrap',
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px',
  };

  const thStyle = {
    backgroundColor: '#f2f2f2',
    textAlign: 'left',
    padding: '8px',
    borderBottom: '2px solid #ccc',
  };

  const tdStyle = {
    padding: '8px',
    borderBottom: '1px solid #ccc',
  };

  const sectionTitleStyle = {
    marginTop: '30px',
    fontSize: '1.2rem',
    fontWeight: 'bold',
  };

  const buttonStyle = {
    padding: '6px 12px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  };

  // =============== RENDER ===============
  return (
    <div style={backgroundStyle}>
      {/* Logo pinned top-left */}
      <img
        src={connectLogo}
        alt="connect.oll logo"
        style={logoStyle}
      />

      <div style={contentWrapperStyle}>
        <div style={contentBoxStyle}>
          <div style={titleStyle}>View Debts</div>
         

          {/* Filters */}
          <div style={filterSectionStyle}>
            <div>
              <label>Start Date: </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{ padding: '4px' }}
              />
            </div>
            <div>
              <label>Finish Date: </label>
              <input
                type="date"
                value={finishDate}
                onChange={(e) => setFinishDate(e.target.value)}
                style={{ padding: '4px' }}
              />
            </div>
            <button
              onClick={applyFilters}
              style={{ ...buttonStyle, backgroundColor: '#007bff', color: '#fff' }}
            >
              Apply Filters
            </button>
            <button
              onClick={clearFilters}
              style={{ ...buttonStyle, backgroundColor: '#6c757d', color: '#fff' }}
            >
              Clear Filters
            </button>
          </div>

          {hasAppliedFilters && (
            <>
              {/* Debt Summary (from usageData) */}
              <div style={sectionTitleStyle}>Debt Summary</div>
              {debtSummaryArray.length > 0 ? (
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Other Operator</th>
                      <th style={thStyle}>Debt</th>
                      <th style={thStyle}>Credit</th>
                      <th style={thStyle}>Confirm Payment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {debtSummaryArray.map(([otherOp, { egnatiaOwes, theyOweEgnatia }]) => (
                      <tr key={otherOp}>
                        <td style={tdStyle}>{otherOp}</td>
                        <td style={tdStyle}>${egnatiaOwes}</td>
                        <td style={tdStyle}>${theyOweEgnatia}</td>
                        <td style={tdStyle}>
                          <button
                            onClick={() => handleConfirmPayment(otherOp)}
                            disabled={egnatiaOwes === 0}
                            style={{
                              ...buttonStyle,
                              backgroundColor: egnatiaOwes === 0 ? '#ccc' : '#28a745',
                              color: '#fff',
                            }}
                          >
                            Confirm
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No debts found in the selected range.</p>
              )}

              {/* Transaction History: bankPayments only */}
              <div style={sectionTitleStyle}>Transaction History (Bank Payments)</div>
              {filteredPayments.length > 0 ? (
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={thStyle}>From</th>
                      <th style={thStyle}>To</th>
                      <th style={thStyle}>Value</th>
                      <th style={thStyle}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.map((pay) => (
                      <tr key={pay.id}>
                        <td style={tdStyle}>{pay.from}</td>
                        <td style={tdStyle}>{pay.to}</td>
                        <td style={tdStyle}>${pay.value}</td>
                        <td style={tdStyle}>{pay.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No bank payments found in the selected range.</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewDebts;
