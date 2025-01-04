const dbConnection = require('../models/db');

exports.fetchPasses = async (tollStationID, date_from, date_to) => {
  const query = `
  SELECT 
    p.passes_id AS passID,
    p.timestamp AS timestamp,
    p.tagRef_id AS tagID,
    o.operator_name AS tagProvider,
    CASE 
      WHEN p.fk_toll_station_id = ? THEN 'home'
      ELSE 'visitor'
    END AS passType,
    p.charge AS passCharge
  FROM 
    PASSES p
  LEFT JOIN 
    TOLL_STATIONS ts ON p.fk_toll_station_id = ts.TOLL_STATION_ID
  LEFT JOIN 
    OPERATORS o ON ts.opid = o.id_operator
  WHERE 
    p.fk_toll_station_id = ?
    AND DATE(p.timestamp) BETWEEN ? AND ?;
`;


  const [rows] = await dbConnection.execute(query, [tollStationID, tollStationID, date_from, date_to]);

  const passList = rows.map((row, index) => ({
    passIndex: index + 1,
    passID: row.passID,
    timestamp: row.timestamp,
    tagID: row.tagID,
    tagProvider: row.tagProvider,
    passType: row.passType,
    passCharge: row.passCharge,
  }));

  const summaryQuery = `
    SELECT 
      COUNT(*) AS nPasses
    FROM 
      PASSES 
    WHERE 
      fk_toll_station_id = ?
      AND DATE(timestamp) BETWEEN ? AND ?;
  `;

  const [summary] = await dbConnection.execute(summaryQuery, [tollStationID, date_from, date_to]);

  return {
    stationID: tollStationID,
    stationOperator: rows.length > 0 ? rows[0].tagProvider : null,
    requestTimestamp: new Date().toISOString(),
    periodFrom: date_from,
    periodTo: date_to,
    nPasses: summary[0].nPasses,
    passList: passList,
  };
};
