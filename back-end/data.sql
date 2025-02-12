-- Disable foreign key checks
SET FOREIGN_KEY_CHECKS=0;

-- Load data into TOLL_STATIONS table
LOAD DATA INFILE "C:\\ProgramData\\MySQL\\MySQL Server 8.0\\Uploads\\tollstations2024.csv"
INTO TABLE `connect.oll`.`TOLL_STATIONS`
FIELDS TERMINATED BY ',' ENCLOSED BY '"' 
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(@OpID, @Operator, @TollID, @PM, @Name, @Locality, @Road, @Lat, @Long, @Email, @Price1, @Price2, @Price3, @Price4)
SET
  opid = @OpID,
  `TOLL_STATION_ID` = @TollID,
  name = @Name,
  locality = @Locality,
  road = @Road,
  lat = @Lat,
  `long` = @Long,
  email = @Email,
  price1 = @Price1,
  price2 = @Price2,
  price3 = @Price3,
  price4 = @Price4;

-- Load data into PASSES table
LOAD DATA INFILE "C:\\ProgramData\\MySQL\\MySQL Server 8.0\\Uploads\\passes-sample.csv"
INTO TABLE `connect.oll`.`PASSES`
FIELDS TERMINATED BY ',' ENCLOSED BY '"' 
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(@timestamp, @tollID, @tagRef, @tagHomeID, @charge)
SET
  `tagRef_id` = @tagRef,
  `timestamp` = @timestamp,
  fk_toll_station_id = @tollID,
  fk_tag_home_id = @tagHomeID,
  charge = @charge; 
-- Load data into OPERATORS table
LOAD DATA INFILE "C:\\ProgramData\\MySQL\\MySQL Server 8.0\\Uploads\\operators.csv"
INTO TABLE `connect.oll`.`OPERATORS`
FIELDS TERMINATED BY ',' ENCLOSED BY '"' 
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(id_operator, operator_name);

-- Load data into USERS table
LOAD DATA INFILE "C:\\ProgramData\\MySQL\\MySQL Server 8.0\\Uploads\\users.csv"
INTO TABLE `connect.oll`.`USERS`
FIELDS TERMINATED BY ',' ENCLOSED BY '"' 
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(username, password, privilege, fk_operator_id);

-- Load data into DEBTS_PER_STATION table
LOAD DATA INFILE "C:\\ProgramData\\MySQL\\MySQL Server 8.0\\Uploads\\debts_per_station.csv"
INTO TABLE `connect.oll`.`DEBTS_PER_STATION`
FIELDS TERMINATED BY ',' ENCLOSED BY '"' 
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(OPERATORS_idOPERATORS, `TOLL_STATIONS_idTOLL_STATIONS`, ofeilh);



-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS=1;