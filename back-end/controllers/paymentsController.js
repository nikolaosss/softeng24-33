const dbConnection = require("../models/db");

// POST: Πληρωμή Χρέους
exports.payDebt = async (req, res) => {
  try {
    const { operator_from, operator_to, amount } = req.body;

    if (!operator_from || !operator_to || !amount) {
      return res.status(400).json({ status: "failed", message: "Missing required fields" });
    }

    // Εισαγωγή της πληρωμής στον πίνακα PAYMENTS
    const insertQuery = `
      INSERT INTO PAYMENTS (operator_from, operator_to, poso)
      VALUES (?, ?, ?);
    `;
    await dbConnection.execute(insertQuery, [operator_from, operator_to, amount]);

    res.status(200).json({ status: "success", message: "Debt paid successfully" });
  } catch (error) {
    console.error("Error processing debt payment:", error);
    res.status(500).json({ status: "failed", message: "Internal Server Error" });
  }
};

// GET: Ιστορικό Συναλλαγών
exports.getTransactionHistory = async (req, res) => {
  try {
    const { operatorID } = req.params;

    if (!operatorID) {
      return res.status(400).json({ status: "failed", message: "Missing operator ID" });
    }

    const query = `
      SELECT 
        p.payment_id, 
        p.operator_from, 
        o1.operator_name AS from_name,
        p.operator_to, 
        o2.operator_name AS to_name,
        p.poso, 
        p.payment_date
      FROM PAYMENTS p
      JOIN OPERATORS o1 ON p.operator_from = o1.id_operator
      JOIN OPERATORS o2 ON p.operator_to = o2.id_operator
      WHERE p.operator_from = ? OR p.operator_to = ?
      ORDER BY p.payment_date DESC;
    `;

    const [transactions] = await dbConnection.execute(query, [operatorID, operatorID]);

    res.status(200).json({ status: "success", transactions });
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    res.status(500).json({ status: "failed", message: "Internal Server Error" });
  }
};
