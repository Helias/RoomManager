CREATE TABLE `utenti` (
    `ID` INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `username` VARCHAR(255) COLLATE utf8_unicode_ci NOT NULL,
    `nome` VARCHAR(100) COLLATE utf8_unicode_ci NOT NULL,
    `cognome` VARCHAR(100) COLLATE utf8_unicode_ci NOT NULL,
    `email` VARCHAR(100) COLLATE utf8_unicode_ci NOT NULL,
    `password` VARCHAR(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
