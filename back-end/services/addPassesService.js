const dbConnection = require('../models/db');
const fs = require('fs');
const path = require('path');

exports.addPasses = async (req, res) => {
  try {
    const csvFilePath = 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/passes-sample.csv';

    if (!fs.existsSync(csvFilePath)) {
      return res.status(400).json({
        status: 'failed',
        info: 'File passes-sample.csv not found.',
      });
    }

    const loadDataQuery = `
      LOAD DATA INFILE ?
      INTO TABLE PASSES
      FIELDS TERMINATED BY ',' ENCLOSED BY '"'
      LINES TERMINATED BY '\\n'
      IGNORE 1 ROWS
      (@timestamp, @tollID, @tagRef, @tagHomeID, @charge)
      SET
        timestamp = @timestamp,
        fk_toll_station_id = @tollID,
        fk_tag_home_id = @tagHomeID,
        charge = @charge;
    `;
    await dbConnection.query(loadDataQuery, [csvFilePath]);

    // Call the stored procedure
    const callProcedureQuery = `CALL processPasses()`;
    await dbConnection.query(callProcedureQuery);

    // Respond with success
    res.status(200).json({ status: 'OK' });
  } catch (error) {
    console.error('Error adding passes:', error.message);
    res.status(500).json({
      status: 'failed',
      info: error.message,
    });
  }
};
