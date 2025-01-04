const dbConnection = require('../models/db');

exports.resetStations = async () => {
  const resetQuery = `
    SET FOREIGN_KEY_CHECKS=0;

    DELETE FROM toll_stations;

    LOAD DATA INFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/tollstations2024.csv'
    INTO TABLE toll_stations
    FIELDS TERMINATED BY ',' ENCLOSED BY '"'
    LINES TERMINATED BY '\\n'
    IGNORE 1 ROWS
    (@OpID, @Operator, @TollID, @PM, @Name, @Locality, @Road, @Lat, @Long, @Email, @Price1, @Price2, @Price3, @Price4)
    SET
      opid = @OpID,
      TOLL_STATION_ID = @TollID,
      name = @Name,
      locality = @Locality,
      road = @Road,
      lat = @Lat,
      \`long\` = @Long,
      email = @Email,
      price1 = @Price1,
      price2 = @Price2,
      price3 = @Price3,
      price4 = @Price4;

    SET FOREIGN_KEY_CHECKS=1;
  `;

  await dbConnection.query(resetQuery);
  return { status: 'OK' };
};
