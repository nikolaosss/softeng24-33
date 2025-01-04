const dbConnection = require('../models/db');

exports.fetchChargesBy = async (tollOpID, date_from, date_to, format = 'json') => {
  const query = `
    SELECT 
      oTag.id_operator AS visitingOpID,
      COUNT(*) AS nPasses,
      SUM(p.charge) AS passesCost
    FROM 
      PASSES p
    INNER JOIN 
      TOLL_STATIONS ts ON p.fk_toll_station_id = ts.TOLL_STATION_ID
    INNER JOIN 
      OPERATORS oTag ON p.fk_tag_home_id = oTag.id_operator
    WHERE 
      ts.opid = ? -- toll operator ID
      AND DATE(p.timestamp) BETWEEN ? AND ?
    GROUP BY 
      oTag.id_operator;
  `;

  const [rows] = await dbConnection.execute(query, [tollOpID, date_from, date_to]);

  const vOpList = rows.map(row => ({
    visitingOpID: row.visitingOpID,
    nPasses: row.nPasses,
    passesCost: row.passesCost,
  }));

  const responseData = {
    tollOpID,
    requestTimestamp: new Date().toISOString(),
    periodFrom: date_from,
    periodTo: date_to,
    vOpList,
  };

  if (format === 'csv') {
    const csvHeader = ['tollOpID', 'requestTimestamp', 'periodFrom', 'periodTo', 'visitingOpID', 'nPasses', 'passesCost'];
    const csvRows = vOpList.map(op => [
      tollOpID,
      responseData.requestTimestamp,
      responseData.periodFrom,
      responseData.periodTo,
      op.visitingOpID,
      op.nPasses,
      op.passesCost,
    ]);

    const csvData = [csvHeader.join(','), ...csvRows.map(row => row.join(','))].join('\n');
    return { csv: csvData };
  }

  return responseData;
};
