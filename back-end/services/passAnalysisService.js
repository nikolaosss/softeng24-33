const dbConnection = require('../models/db');

exports.fetchPassAnalysis = async (stationOpID, tagOpID, date_from, date_to) => {
    const query = `
      SELECT 
        p.passes_id AS passID,
        p.timestamp AS timestamp,
        p.tagRef_id AS tagID,
        p.fk_toll_station_id AS stationID,
        p.charge AS passCharge
      FROM 
        PASSES p
      INNER JOIN 
        TOLL_STATIONS ts ON p.fk_toll_station_id = ts.TOLL_STATION_ID
      INNER JOIN 
        OPERATORS oTag ON p.fk_tag_home_id = oTag.id_operator
      WHERE 
        ts.opid = ? -- Use opid for station operator
        AND oTag.id_operator = ? -- Use id_operator for tag operator
        AND DATE(p.timestamp) BETWEEN ? AND ?;
    `;
  
    const [rows] = await dbConnection.execute(query, [stationOpID, tagOpID, date_from, date_to]);
  
    const passList = rows.map((row, index) => ({
      passIndex: index + 1,
      passID: row.passID,
      stationID: row.stationID,
      timestamp: row.timestamp,
      tagID: row.tagID,
      passCharge: row.passCharge,
    }));
  
    return {
      stationOpID,
      tagOpID,
      requestTimestamp: new Date().toISOString(),
      periodFrom: date_from,
      periodTo: date_to,
      nPasses: passList.length,
      passList,
    };
  };
  