-- PostgreSQL version
BEGIN;

-- Crear la tabla
CREATE TABLE usuario (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  clave VARCHAR(255) NOT NULL,
  rol VARCHAR(50) NOT NULL DEFAULT 'user',
  fecha_baja TIMESTAMP
);

-- Insertar los datos
INSERT INTO usuario (id,nombre, email, clave, rol, fecha_baja) VALUES
(1, 'Marcelo Murgo','cmmurgo@gmail.com', '$2b$10$pGiXjmcr6BGZOmu75j0kXuPTQtWvVvu3GnXipeRGYXaKEWPhrg4rK', 'admin', null);

-- Ajustar secuencia para SERIAL
SELECT setval('usuario_id_seq', (SELECT MAX(id) FROM usuario));

COMMIT;
