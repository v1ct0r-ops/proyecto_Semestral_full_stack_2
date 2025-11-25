-- Script de inicialización de base de datos para Level-Up Gamer
-- MySQL 8.0+

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS levelup_gamer_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Crear usuario de aplicación
CREATE USER IF NOT EXISTS 'levelup_user'@'localhost' IDENTIFIED BY 'levelup_password';

-- Otorgar privilegios
GRANT ALL PRIVILEGES ON levelup_gamer_db.* TO 'levelup_user'@'localhost';

-- Aplicar cambios
FLUSH PRIVILEGES;

-- Usar la base de datos
USE levelup_gamer_db;

-- Las tablas se crearán automáticamente por JPA/Hibernate
-- Este script solo configura la base de datos inicial

-- Mostrar información
SELECT 'Base de datos levelup_gamer_db creada exitosamente' AS mensaje;
SELECT 'Usuario levelup_user configurado' AS usuario;
SELECT 'El backend Spring Boot creará las tablas automáticamente' AS info;