CREATE DATABASE db_comprobantes
	CHARACTER SET utf8mb4
	COLLATE utf8mb4_general_ci;

--
-- Set character set the client will use to send SQL statements to the server
--
SET NAMES 'utf8';

--
-- Set default database
--
USE db_comprobantes;

--
-- Create table `tbl_usuarios`
--
CREATE TABLE tbl_usuarios (
  usuario VARCHAR(50) NOT NULL,
  pswd VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  active TINYINT(1) NOT NULL DEFAULT 1,
  role VARCHAR(50) NOT NULL,
  date_insert TIMESTAMP NULL DEFAULT current_timestamp(),
  supervisor VARCHAR(50) NOT NULL,
  PRIMARY KEY (usuario)
)
ENGINE = INNODB,
AVG_ROW_LENGTH = 16384,
CHARACTER SET utf8mb4,
COLLATE utf8mb4_general_ci,
ROW_FORMAT = DYNAMIC;

--
-- Create index `IX_supervisor` on table `tbl_usuarios`
--
ALTER TABLE tbl_usuarios 
  ADD INDEX IX_supervisor(supervisor);


--
-- Create foreign key
--
ALTER TABLE tbl_usuarios 
  ADD CONSTRAINT FK_supervisor FOREIGN KEY (supervisor)
    REFERENCES tbl_usuarios(usuario) ON DELETE NO ACTION;



--
-- Create table `tbl_menu`
--
CREATE TABLE tbl_menu (
  id INT(11) NOT NULL AUTO_INCREMENT,
  label VARCHAR(50) NOT NULL,
  icon VARCHAR(50) NOT NULL,
  link VARCHAR(100) NOT NULL,
  orden INT(11) DEFAULT 0,
  role_access VARCHAR(100) NOT NULL,
  active TINYINT(1) DEFAULT 1,
  PRIMARY KEY (id)
)
ENGINE = INNODB,
AUTO_INCREMENT = 1,
AVG_ROW_LENGTH = 16384,
CHARACTER SET utf8mb4,
COLLATE utf8mb4_general_ci,
ROW_FORMAT = DYNAMIC;

CREATE TABLE tbl_comprobante (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio INT(10) NOT NULL,
    documento LONGTEXT,           -- El archivo en sí
    estado INT(1) DEFAULT 1,
    digitador VARCHAR(50),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


--
-- INSERTS USUARIOS
-- 
INSERT INTO `tbl_usuarios` (`usuario`, `pswd`, `name`, `email`, `active`, `role`, `date_insert`, `supervisor`) 
VALUES ('samuel', '90cc33a41b541af2c1964e3e10a46088cbdedf63031efaa35d588a698c91193f', 'Samuel Gonzalez', 'benja1715@gmail.com', '1', 'supervisor', current_timestamp(), 'samuel');

INSERT INTO `tbl_usuarios` (`usuario`, `pswd`, `name`, `email`, `active`, `role`, `date_insert`, `supervisor`) 
VALUES ('benjamin', '8ee9938e4b960a50540f1ca9299facc5a5f342d0848b402c322fd14592e4bc32', 'Benjamin Gonzalez', 'benja1715@gmail.com', '1', 'usuario', current_timestamp(), 'samuel');

INSERT INTO `tbl_usuarios` (`usuario`, `pswd`, `name`, `email`, `active`, `role`, `date_insert`, `supervisor`) 
VALUES ('martin', 'b6f8d434a847fb0f0c1a8d9b936b8ca952e224f205a55f4ba9b2c20f88fdc9e7', 'Martin Gonzalez', 'benja1715@gmail.com', '1', 'usuario', current_timestamp(), 'samuel');

--
-- INSERTS MENU
-- 
INSERT INTO `tbl_menu` ( `label`, `icon`, `link`, `orden`, `role_access` ) 
VALUES ('Listado Comprobantes', 'history', '../historial/', 1, 'usuario');

INSERT INTO `tbl_menu` ( `label`, `icon`, `link`, `orden`, `role_access` ) 
VALUES ('Registrar', 'receipt', '../registrar_comprobante/', 2, 'usuario');

INSERT INTO `tbl_menu` ( `label`, `icon`, `link`, `orden`, `role_access` ) 
VALUES ('Salir', 'log-out', '../index.html', 3, 'usuario');
