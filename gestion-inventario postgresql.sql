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
(1, 'Marcelo Murgo','cmmurgo@gmail.com', '$2b$10$Dg/pOEjkYFP2F5vtFJugped7tRoaUoVkHAiG/JM1wD.N/gaQHNHOC', 'admin', null);

CREATE TABLE cliente (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    apellido VARCHAR(100),
    email VARCHAR(100),
    telefono VARCHAR(50),
    direccion VARCHAR(255),
    cuit_cuil VARCHAR(20),
    fecha_baja DATE
);

INSERT INTO cliente (nombre, apellido, email, telefono, direccion, cuit_cuil, fecha_baja) VALUES
('Carlos', 'Gonzalez', 'carlos.gonzalez@example.com', '2614123456', 'Av. San Martín 123', '20-12345678-9', NULL),
('Lucía', 'Pérez', 'lucia.perez@example.com', '2614234567', 'Calle Mitre 456', '27-87654321-0', NULL);


CREATE TABLE promocion (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    condiciones TEXT,
    porcentaje INT,
    fecha_inicio DATE,
    fecha_fin DATE,
    fecha_baja DATE
);

INSERT INTO promocion (nombre, condiciones, porcentaje, fecha_inicio, fecha_fin, fecha_baja) VALUES
('Promo Invierno', 'Descuento por temporada invernal', 15, '2025-06-01', '2025-08-31', NULL),
('2x1 Bebidas', 'Lleva 2 y paga 1', 50, '2025-05-01', '2025-06-30', NULL);


CREATE TABLE proveedor (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    email VARCHAR(100),
    telefono VARCHAR(50),
    contacto VARCHAR(100),
    direccion VARCHAR(255),
    cuit VARCHAR(20),
    rubro VARCHAR(100),
    fecha_baja DATE
);

INSERT INTO proveedor (nombre, email, telefono, contacto, direccion, cuit, rubro, fecha_baja) VALUES
('Distribuidora Mendoza', 'ventas@distribuidoramza.com', '2614123000', 'Juan Torres', 'Ruta 40 Km 12', '30-11223344-5', 'Bebidas', NULL),
('Lácteos Andinos', 'info@lacteosandinos.com', '2614332211', 'Ana Suárez', 'Calle Rural 888', '30-55667788-9', 'Lácteos', NULL);


CREATE TABLE producto (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    categoria VARCHAR(100),
    descripcion TEXT,
    precio_costo INT,
    precio_venta INT,
    stock_minimo INT,
    id_promocion INT,
    codigo_barra BIGINT,
    fecha_baja DATE,
    CONSTRAINT fk_promocion FOREIGN KEY (id_promocion) REFERENCES promocion(id)
);

INSERT INTO producto (nombre, categoria, descripcion, precio_costo, precio_venta, stock_minimo, id_promocion, codigo_barra, fecha_baja) VALUES
('Agua Mineral 500ml', 'Bebidas', 'Agua sin gas en botella plástica', 50, 100, 10, 2, 7791234567890, NULL),
('Leche Entera 1L', 'Lácteos', 'Leche entera pasteurizada', 120, 180, 20, NULL, 7790987654321, NULL);


CREATE TABLE venta (
    id SERIAL PRIMARY KEY,
    fecha DATE,
    id_cliente INT,
    fecha_baja DATE,
    CONSTRAINT fk_cliente FOREIGN KEY (id_cliente) REFERENCES cliente(id)
);

INSERT INTO venta (fecha, id_cliente, fecha_baja) VALUES
('2025-05-10', 1, NULL),
('2025-05-12', 2, NULL);


CREATE TABLE detalle_venta (
    id_venta INT,
    id_producto INT,
    cantidad INT,
    fecha_baja DATE,
    PRIMARY KEY (id_venta, id_producto),
    CONSTRAINT fk_detalle_venta_venta FOREIGN KEY (id_venta) REFERENCES venta(id),
    CONSTRAINT fk_detalle_venta_producto FOREIGN KEY (id_producto) REFERENCES producto(id)
);

INSERT INTO detalle_venta (id_venta, id_producto, cantidad, fecha_baja) VALUES
(1, 1, 2, NULL),
(1, 2, 1, NULL),
(2, 1, 3, NULL);


CREATE TABLE perdida (
    id SERIAL PRIMARY KEY,
    id_producto INT,
    fecha DATE,
    cantidad INT,
    fecha_baja DATE,
    CONSTRAINT fk_perdida_producto FOREIGN KEY (id_producto) REFERENCES producto(id)
);

INSERT INTO perdida (id_producto, fecha, cantidad, fecha_baja) VALUES
(2, '2025-05-11', 1, NULL),
(1, '2025-05-13', 2, NULL);


CREATE TABLE orden_compra (
    id SERIAL PRIMARY KEY,
    id_proveedor INT,
    fecha DATE,
    estado VARCHAR(50),
    fecha_baja DATE,
    CONSTRAINT fk_orden_proveedor FOREIGN KEY (id_proveedor) REFERENCES proveedor(id)
);

INSERT INTO orden_compra (id_proveedor, fecha, estado, fecha_baja) VALUES
(1, '2025-05-09', 'Pendiente', NULL),
(2, '2025-05-10', 'Recibido', NULL);


CREATE TABLE detalle_orden_compra (
    id_orden_compra INT,
    id_producto INT,
    cantidad INT,
    fecha_baja DATE,
    PRIMARY KEY (id_orden_compra, id_producto),
    CONSTRAINT fk_detalle_oc_oc FOREIGN KEY (id_orden_compra) REFERENCES orden_compra(id),
    CONSTRAINT fk_detalle_oc_producto FOREIGN KEY (id_producto) REFERENCES producto(id)
);

INSERT INTO detalle_orden_compra (id_orden_compra, id_producto, cantidad, fecha_baja) VALUES
(1, 1, 100, NULL),
(2, 2, 50, NULL);


CREATE TABLE movimientos (
    id SERIAL PRIMARY KEY,
    id_operacion INT,
    id_producto INT,
    tipo VARCHAR(50),
    cantidad INT,
    fecha DATE,
    fecha_baja DATE,
    CONSTRAINT fk_movimiento_producto FOREIGN KEY (id_producto) REFERENCES producto(id)
);

INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES
(1, 1, 'venta', 100, '2025-05-09', NULL),
(2, 2, 'compra', 50, '2025-05-10', NULL),
(3, 1, 'perdida', 2, '2025-05-10', NULL),
(4, 2, 'compra', 1, '2025-05-10', NULL);


COMMIT;