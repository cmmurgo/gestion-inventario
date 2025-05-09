-- PostgreSQL version
BEGIN;

-- Crear la tabla
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'user'
);

-- Insertar los datos
INSERT INTO users (id, email, password, role) VALUES
(1, 'cmmurgo@gmail.com', '$2b$10$pGiXjmcr6BGZOmu75j0kXuPTQtWvVvu3GnXipeRGYXaKEWPhrg4rK', 'admin');

-- Ajustar secuencia para SERIAL (si usás PostgreSQL 10+)
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

COMMIT;
