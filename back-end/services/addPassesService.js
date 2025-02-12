const fs = require('fs');
const csv = require('csv-parser');
const dbConnection = require('../models/db'); 

exports.addPasses = async (filePath) => {
  const passes = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv({
        mapHeaders: ({ header }) => header.trim(), 
      }))
      .on('data', (row) => {
        console.log('Row Data:', row);
        passes.push([
          row.tagRef,
          row.timestamp, 
          parseFloat(row.charge),
          row.tollID, 
          row.tagHomeID,
        ]);
      })
      .on('end', async () => {
        try {
          console.log('Passes Data:', passes); 

          const insertQuery = `
            INSERT INTO PASSES (tagRef_id, timestamp, charge, fk_toll_station_id, fk_tag_home_id)
            VALUES ?;
          `;

          await dbConnection.query(insertQuery, [passes]);

          console.log('Data successfully inserted into PASSES table.');
          resolve();
        } catch (error) {
          console.error('Error inserting data:', error.message);
          reject(error);
        }
      })
      .on('error', (error) => {
        console.error('Error reading CSV file:', error.message);
        reject(error);
      });
  });
};
