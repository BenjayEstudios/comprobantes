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
-- Create index `UK_tbl_usuarios_role` on table `tbl_usuarios`
--
ALTER TABLE tbl_usuarios 
  ADD UNIQUE INDEX UK_tbl_usuarios_role(role);

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
AUTO_INCREMENT = 4,
AVG_ROW_LENGTH = 16384,
CHARACTER SET utf8mb4,
COLLATE utf8mb4_general_ci,
ROW_FORMAT = DYNAMIC;

--
-- Create foreign key
--
ALTER TABLE tbl_menu 
  ADD CONSTRAINT FK_role_access FOREIGN KEY (role_access)
    REFERENCES tbl_usuarios(role) ON DELETE NO ACTION;