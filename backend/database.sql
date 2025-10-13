-- MySQL Workbench Forward Engineering
 
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
 
-- -----------------------------------------------------
-- Schema Gestion-des-locaux
-- -----------------------------------------------------
 
-- -----------------------------------------------------
-- Schema Gestion-des-locaux
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `Gestion-des-locaux` DEFAULT CHARACTER SET utf8 ;
USE `Gestion-des-locaux` ;
 
-- -----------------------------------------------------
-- Table `Gestion-des-locaux`.`Batiments`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Gestion-des-locaux`.`Batiments` (
  `idBatiment` VARCHAR(20) NOT NULL,
  `site` VARCHAR(20) NOT NULL,
  `designation` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`idBatiment`))
ENGINE = InnoDB;
 
 
-- -----------------------------------------------------
-- Table `Gestion-des-locaux`.`Salles`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Gestion-des-locaux`.`Salles` (
  `idSalle` VARCHAR(45) NOT NULL,
  `fonction` VARCHAR(45) NOT NULL,
  `occupant` VARCHAR(45) NOT NULL DEFAULT 'Aucun',
  `plafond` DECIMAL(10,5) NOT NULL DEFAULT 0.0,
  `prises` INT NOT NULL DEFAULT 0,
  `pointsWifi` INT NOT NULL DEFAULT 0,
  `ventilateurs` INT NOT NULL DEFAULT 0,
  `climatiseurs` INT NOT NULL DEFAULT 0,
  `idBatiment` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`idSalle`),
  INDEX `fk_Salles_Batiments_idx` (`idBatiment` ASC) VISIBLE,
  CONSTRAINT `fk_Salles_Batiments`
    FOREIGN KEY (`idBatiment`)
    REFERENCES `Gestion-des-locaux`.`Batiments` (`idBatiment`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
 
 
-- -----------------------------------------------------
-- Table `Gestion-des-locaux`.`Portes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Gestion-des-locaux`.`Portes` (
  `nombre` INT NOT NULL,
  `typePorte` VARCHAR(45) NOT NULL DEFAULT 'Non précisé',
  `idSalle` VARCHAR(45) NOT NULL,
  INDEX `fk_Salle-Porte_Salles1_idx` (`idSalle` ASC) VISIBLE,
  PRIMARY KEY (`typePorte`, `idSalle`),
  CONSTRAINT `fk_Salle-Porte_Salles1`
    FOREIGN KEY (`idSalle`)
    REFERENCES `Gestion-des-locaux`.`Salles` (`idSalle`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
 
 
-- -----------------------------------------------------
-- Table `Gestion-des-locaux`.`Fenetres`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Gestion-des-locaux`.`Fenetres` (
  `nombre` INT NOT NULL,
  `typeFenetre` VARCHAR(45) NOT NULL DEFAULT 'Non précisé',
  `idSalle` VARCHAR(45) NOT NULL,
  INDEX `fk_Salle-Fenetre_Salles1_idx` (`idSalle` ASC) VISIBLE,
  PRIMARY KEY (`idSalle`, `typeFenetre`),
  CONSTRAINT `fk_Salle-Fenetre_Salles1`
    FOREIGN KEY (`idSalle`)
    REFERENCES `Gestion-des-locaux`.`Salles` (`idSalle`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
 
 
-- -----------------------------------------------------
-- Table `Gestion-des-locaux`.`Mur`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Gestion-des-locaux`.`Mur` (
  `typeMur` VARCHAR(45) NOT NULL DEFAULT 'Peinture',
  `surface` DECIMAL(10,5) NOT NULL,
  `idSalle` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`typeMur`, `idSalle`),
  INDEX `fk_Mur_Salles1_idx` (`idSalle` ASC) VISIBLE,
  CONSTRAINT `fk_Mur_Salles1`
    FOREIGN KEY (`idSalle`)
    REFERENCES `Gestion-des-locaux`.`Salles` (`idSalle`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
 
 
-- -----------------------------------------------------
-- Table `Gestion-des-locaux`.`Sol`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Gestion-des-locaux`.`Sol` (
  `typeSol` VARCHAR(45) NOT NULL DEFAULT 'Carrelage',
  `surface` DECIMAL(10,5) NOT NULL,
  `idSalle` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`typeSol`, `idSalle`),
  INDEX `fk_Sol_Salles1_idx` (`idSalle` ASC) VISIBLE,
  CONSTRAINT `fk_Sol_Salles1`
    FOREIGN KEY (`idSalle`)
    REFERENCES `Gestion-des-locaux`.`Salles` (`idSalle`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
 
 
-- -----------------------------------------------------
-- Table `Gestion-des-locaux`.`Lampes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Gestion-des-locaux`.`Lampes` (
  `typeLampe` VARCHAR(45) NOT NULL DEFAULT 'Non précisé',
  `nombre` INT NOT NULL,
  `idSalle` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`typeLampe`, `idSalle`),
  INDEX `fk_Lampes_Salles1_idx` (`idSalle` ASC) VISIBLE,
  CONSTRAINT `fk_Lampes_Salles1`
    FOREIGN KEY (`idSalle`)
    REFERENCES `Gestion-des-locaux`.`Salles` (`idSalle`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Gestion-des-locaux`.`Users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Gestion-des-locaux`.`Users` (
  `username` VARCHAR(50) NOT NULL,
  `password` CHAR(64) NOT NULL COMMENT 'SHA2-256 hash',
  PRIMARY KEY (`username`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Gestion-des-locaux`.`UserTokens`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Gestion-des-locaux`.`UserTokens` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  `token` VARCHAR(255) NOT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expiresAt` TIMESTAMP NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_UserTokens_Users_idx` (`username` ASC) VISIBLE,
  UNIQUE INDEX `token_UNIQUE` (`token` ASC) VISIBLE,
  CONSTRAINT `fk_UserTokens_Users`
    FOREIGN KEY (`username`)
    REFERENCES `Gestion-des-locaux`.`Users` (`username`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Insertion des utilisateurs par défaut
-- -----------------------------------------------------
INSERT INTO `Gestion-des-locaux`.`Users` (`username`, `password`) VALUES
('admin1', SHA2('P@ssw0rd', 256)),
('admin2', SHA2('P@ssw0rd', 256)),
('admin3', SHA2('P@ssw0rd', 256));


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;