-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema connect.oll
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema connect.oll
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `connect.oll` DEFAULT CHARACTER SET utf8 ;


USE `connect.oll` ;

-- -----------------------------------------------------
-- Table `connect.oll`.`OPERATORS`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `connect.oll`.`OPERATORS` (
  `id_operator` VARCHAR(45) NOT NULL,
  `operator_name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_operator`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `connect.oll`.`TOLL_STATIONS`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `connect.oll`.`TOLL_STATIONS` (
  `TOLL_STATION_ID` VARCHAR(45) NOT NULL,
  `lat` INT NOT NULL,
  `long` INT NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `locality` VARCHAR(45) NOT NULL,
  `road` VARCHAR(45) NOT NULL,
  `opid` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `price1` INT NULL,
  `price2` INT NULL,
  `price3` INT NULL,
  `price4` INT NULL,
  `fk_operator_of_station` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`TOLL_STATION_ID`),
  INDEX `fk_TOLL STATIONS_OPERATORS1_idx` (`fk_operator_of_station` ASC) VISIBLE,
  CONSTRAINT `fk_TOLL_STATIONS_OPERATORS1`
    FOREIGN KEY (`fk_operator_of_station`)
    REFERENCES `connect.oll`.`OPERATORS` (`id_operator`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `connect.oll`.`PASSES`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `connect.oll`.`PASSES` (
  `passes_id` INT NOT NULL AUTO_INCREMENT,
  `tagRef_id` VARCHAR(45) NOT NULL,
  `timestamp` DATETIME(3) NOT NULL,
  `charge` INT NOT NULL,
  `fk_toll_station_id` VARCHAR(45) NOT NULL,
  `fk_tag_home_id` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`passes_id`),
  INDEX `fk_PASSINGS_TOLL STATIONS_idx` (`fk_toll_station_id` ASC) VISIBLE,
  INDEX `fk_PASSINGS_OPERATORS1_idx` (`fk_tag_home_id` ASC) VISIBLE,
  UNIQUE INDEX `passes_id_UNIQUE` (`passes_id` ASC) VISIBLE,
  CONSTRAINT `fk_PASSINGS_TOLL STATIONS`
    FOREIGN KEY (`fk_toll_station_id`)
    REFERENCES `connect.oll`.`TOLL_STATIONS` (`TOLL_STATION_ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_PASSINGS_OPERATORS1`
    FOREIGN KEY (`fk_tag_home_id`)
    REFERENCES `connect.oll`.`OPERATORS` (`id_operator`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `connect.oll`.`USERS`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `connect.oll`.`USERS` (
  `idUSERS` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  `privilege` ENUM('ADMIN', 'OPERATOR', 'USER') NOT NULL,
  `fk_operator_id` VARCHAR(45) NULL,
  PRIMARY KEY (`idUSERS`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE,
  INDEX `fk_USERS_OPERATORS1_idx` (`fk_operator_id` ASC) VISIBLE,
  CONSTRAINT `fk_USERS_OPERATORS1`
    FOREIGN KEY (`fk_operator_id`)
    REFERENCES `connect.oll`.`OPERATORS` (`id_operator`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `connect.oll`.`DEBTS_PER_STATION`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `connect.oll`.`DEBTS_PER_STATION` (
  `OPERATORS_idOPERATORS` VARCHAR(45) NOT NULL,
  `TOLL_STATIONS_idTOLL_STATIONS` VARCHAR(45) NOT NULL,
  `ofeilh` INT NOT NULL,
  PRIMARY KEY (`OPERATORS_idOPERATORS`, `TOLL_STATIONS_idTOLL_STATIONS`),
  INDEX `fk_OPERATORS_has_TOLL STATIONS_TOLL STATIONS1_idx` (`TOLL_STATIONS_idTOLL_STATIONS` ASC) VISIBLE,
  INDEX `fk_OPERATORS_has_TOLL STATIONS_OPERATORS1_idx` (`OPERATORS_idOPERATORS` ASC) VISIBLE,
  CONSTRAINT `fk_OPERATORS_has_TOLL STATIONS_OPERATORS1`
    FOREIGN KEY (`OPERATORS_idOPERATORS`)
    REFERENCES `connect.oll`.`OPERATORS` (`id_operator`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_OPERATORS_has_TOLL STATIONS_TOLL_STATIONS1`
    FOREIGN KEY (`TOLL_STATIONS_idTOLL_STATIONS`)
    REFERENCES `connect.oll`.`TOLL_STATIONS` (`TOLL_STATION_ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `connect.oll`.`PAYMENTS`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `connect.oll`.`PAYMENTS` (
  `payment_id` INT NOT NULL AUTO_INCREMENT,
  `operator_from` VARCHAR(45) NOT NULL,
  `operator_to` VARCHAR(45) NOT NULL,
  `poso` INT NOT NULL,
  PRIMARY KEY (`payment_id`),
  INDEX `fk_OPERATORS_has_OPERATORS_OPERATORS2_idx` (`operator_to` ASC) VISIBLE,
  INDEX `fk_OPERATORS_has_OPERATORS_OPERATORS1_idx` (`operator_from` ASC) VISIBLE,
  UNIQUE INDEX `plhrwmh_id_UNIQUE` (`payment_id` ASC) VISIBLE,
  CONSTRAINT `fk_OPERATORS_has_OPERATORS_OPERATORS1`
    FOREIGN KEY (`operator_from`)
    REFERENCES `connect.oll`.`OPERATORS` (`id_operator`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_OPERATORS_has_OPERATORS_OPERATORS2`
    FOREIGN KEY (`operator_to`)
    REFERENCES `connect.oll`.`OPERATORS` (`id_operator`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;