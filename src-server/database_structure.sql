CREATE TABLE `utenti` (
    `ID` INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `username` VARCHAR(255) COLLATE utf8_unicode_ci NOT NULL,
    `nome` VARCHAR(100) COLLATE utf8_unicode_ci NOT NULL,
    `cognome` VARCHAR(100) COLLATE utf8_unicode_ci NOT NULL,
    `email` VARCHAR(100) COLLATE utf8_unicode_ci NOT NULL,
    `password` VARCHAR(255) COLLATE utf8_unicode_ci NOT NULL,
    `admin` TINYINT(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `aule` (
    `ID` INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `nome` VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `prenotazioni` (
    `ID` INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `id_aula` INT(11),
    `giorno` VARCHAR(25),
    `orario1` VARCHAR(25),
    `orario2` VARCHAR(25),
    `professore` VARCHAR(25),
    `descrizione` VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
