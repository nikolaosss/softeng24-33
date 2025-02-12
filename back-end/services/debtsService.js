const dbConnection = require("../models/db");

// 🔹 Υπολογίζει τα χρήματα που ΧΡΩΣΤΑΕΙ ο operator σε άλλους operators (λαμβάνοντας υπόψη τις πληρωμές)
exports.calculateDebtsToOthers = async (operatorID, fromDate, toDate) => {
  const query = `
    SELECT 
        p.fk_tag_home_id AS other_operator,
        o.operator_name AS operator_name,
        COALESCE(SUM(p.charge), 0) - (
          SELECT COALESCE(SUM(pay.poso), 0)
          FROM PAYMENTS pay
          WHERE pay.operator_from = ?
          AND pay.operator_to = p.fk_tag_home_id
          AND DATE(pay.payment_date) BETWEEN ? AND ?
        ) AS total_amount_owed
    FROM PASSES p
    JOIN OPERATORS o ON p.fk_tag_home_id = o.id_operator
    JOIN TOLL_STATIONS ts ON p.fk_toll_station_id = ts.TOLL_STATION_ID
    WHERE 
        ts.opid = ?  -- Σταθμός ανήκει στον συνδεδεμένο operator
        AND p.fk_tag_home_id != ?  -- Το tag ανήκει σε άλλον operator
        AND DATE(p.timestamp) BETWEEN ? AND ?
    GROUP BY p.fk_tag_home_id, o.operator_name;
  `;

  const [results] = await dbConnection.execute(query, [
    operatorID, fromDate, toDate, 
    operatorID, operatorID, fromDate, toDate
  ]);

  return results;
};

// 🔹 Υπολογίζει τα χρήματα που του ΧΡΩΣΤΑΝΕ οι άλλοι operators (λαμβάνοντας υπόψη τις πληρωμές)
exports.calculateDebtsToMe = async (operatorID, fromDate, toDate) => {
  const query = `
    SELECT 
        ts.opid AS other_operator,
        o.operator_name AS operator_name,
        COALESCE(SUM(p.charge), 0) - (
          SELECT COALESCE(SUM(pay.poso), 0)
          FROM PAYMENTS pay
          WHERE pay.operator_from = ts.opid
          AND pay.operator_to = ?
          AND DATE(pay.payment_date) BETWEEN ? AND ?
        ) AS total_amount_due
    FROM PASSES p
    JOIN TOLL_STATIONS ts ON p.fk_toll_station_id = ts.TOLL_STATION_ID
    JOIN OPERATORS o ON ts.opid = o.id_operator
    WHERE 
        p.fk_tag_home_id = ?  -- Το tag ανήκει στον συνδεδεμένο operator
        AND ts.opid != ?  -- Ο σταθμός ανήκει σε άλλον operator
        AND DATE(p.timestamp) BETWEEN ? AND ?
    GROUP BY ts.opid, o.operator_name;
  `;

  const [results] = await dbConnection.execute(query, [
    operatorID, fromDate, toDate,
    operatorID, operatorID, fromDate, toDate
  ]);

  return results;
};
