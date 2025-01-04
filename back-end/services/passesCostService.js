const dbConnection = require('../models/db');

exports.fetchPassesCost = async (tollOpID, tagOpID, date_from, date_to, format = 'json') => {
  const query = `
    SELECT 
      COUNT(*) AS nPasses,
      SUM(p.charge) AS passesCost
    FROM 
      PASSES p
    INNER JOIN 
      TOLL_STATIONS ts ON p.fk_toll_station_id = ts.TOLL_STATION_ID
    INNER JOIN 
      OPERATORS oTag ON p.fk_tag_home_id = oTag.id_operator
    WHERE 
      ts.opid = ? -- toll operator
      AND oTag.id_operator = ? -- tag operator
      AND DATE(p.timestamp) BETWEEN ? AND ?;
  `;

  const [rows] = await dbConnection.execute(query, [tollOpID, tagOpID, date_from, date_to]);

  const result = rows[0] || { nPasses: 0, passesCost: 0.0 };

  const responseData = {
    tollOpID,
    tagOpID,
    requestTimestamp: new Date().toISOString(),
    periodFrom: date_from,
    periodTo: date_to,
    nPasses: result.nPasses,
    passesCost: result.passesCost
  };

  if (format === 'csv') {
    const csvHeader = ['tollOpID', 'tagOpID', 'requestTimestamp', 'periodFrom', 'periodTo', 'nPasses', 'passesCost'];
    const csvValues = [
      responseData.tollOpID,
      responseData.tagOpID,
      responseData.requestTimestamp,
      responseData.periodFrom,
      responseData.periodTo,
      responseData.nPasses,
      responseData.passesCost
    ];
    const csvData = `${csvHeader.join(',')}\n${csvValues.join(',')}`;
    return { csv: csvData };
  }

  return responseData;
};
