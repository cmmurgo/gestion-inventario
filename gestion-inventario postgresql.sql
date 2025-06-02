-- PostgreSQL version


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
('Lucía', 'Pérez', 'lucia.perez@example.com', '2614234567', 'Calle Mitre 456', '27-87654321-0', NULL),
('No es cliente', 'No es cliente', 'sin_registrar@example.com', '10000000', 'Sin Calle', '10-10000000-0', NULL);


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
('2x1 Bebidas', 'Lleva 2 y paga 1', 50, '2025-05-01', '2025-06-30', NULL),
('3x1 Bebidas', 'Lleva 3 y paga 1', 33, '2025-05-10', '2025-06-10', NULL);


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
('Gaseosa Cola 1.5L', 'Bebidas', 'Botella de 1.5 litros', 100, 180, 15, 1, 7790000000003, NULL),
('Yogur Natural 1L', 'Lácteos', 'Yogur sin sabor', 90, 140, 10, 3, 7790000000004, NULL),
('Pan de Molde', 'Panificados', 'Pan blanco en paquete', 80, 120, 20, NULL, 7790000000005, NULL),
('Aceite Girasol 1L', 'Aceites', 'Aceite comestible de girasol', 150, 220, 5, NULL, 7790000000006, NULL),
('Galletitas Dulces', 'Snacks', 'Galletas de chocolate', 60, 100, 30, 2, 7790000000007, NULL),
('Jugo en Polvo', 'Bebidas', 'Sabor naranja', 20, 45, 50, 1, 7790000000008, NULL),
('Café Molido 250g', 'Bebidas', 'Café tostado molido', 200, 300, 5, NULL, 7790000000009, NULL),
('Arroz 1kg', 'Almacén', 'Arroz largo fino', 70, 110, 10, NULL, 7790000000010, NULL),
('Fideos Spaghetti', 'Almacén', 'Pasta seca', 60, 100, 10, NULL, 7790000000011, NULL),
('Sal fina 500g', 'Almacén', 'Sal común', 20, 35, 15, NULL, 7790000000012, NULL),
('Azúcar 1kg', 'Almacén', 'Azúcar refinada', 50, 90, 20, NULL, 7790000000013, NULL),
('Mermelada Frutilla', 'Almacén', 'Mermelada natural', 90, 140, 5, 3, 7790000000014, NULL),
('Harina 000 1kg', 'Almacén', 'Harina común', 40, 70, 30, NULL, 7790000000015, NULL),
('Huevos docena', 'Huevos', 'Huevos de gallina', 150, 220, 5, NULL, 7790000000016, NULL),
('Manteca 200g', 'Lácteos', 'Manteca con sal', 100, 160, 5, 3, 7790000000017, NULL),
('Queso Cremoso', 'Lácteos', 'Queso fresco', 250, 350, 5, NULL, 7790000000018, NULL),
('Cerveza 500ml', 'Bebidas', 'Cerveza rubia', 180, 300, 10, NULL, 7790000000019, NULL),
('Jabón de Tocador', 'Limpieza', 'Jabón perfumado', 50, 90, 20, NULL, 7790000000020, NULL),
('Shampoo 400ml', 'Limpieza', 'Shampoo para cabello normal', 200, 300, 5, NULL, 7790000000021, NULL),
('Papel Higiénico', 'Limpieza', 'Rollo doble hoja', 60, 100, 30, NULL, 7790000000022, NULL),
('Lavandina 1L', 'Limpieza', 'Desinfectante líquido', 30, 60, 20, NULL, 7790000000023, NULL),
('Detergente 500ml', 'Limpieza', 'Detergente para vajilla', 40, 70, 15, NULL, 7790000000024, NULL),
('Desodorante Ambiente', 'Limpieza', 'Spray de ambiente', 120, 180, 5, NULL, 7790000000025, NULL),
('Servilletas', 'Limpieza', 'Paquete x100', 50, 80, 10, NULL, 7790000000026, NULL),
('Carne Picada 1kg', 'Carnes', 'Carne vacuna', 900, 1200, 5, NULL, 7790000000027, NULL),
('Pollo Entero', 'Carnes', 'Pollo fresco entero', 800, 1000, 3, NULL, 7790000000028, NULL),
('Milanesa Soja', 'Congelados', 'Empanado vegetal', 150, 200, 10, NULL, 7790000000029, NULL),
('Helado 1L', 'Congelados', 'Sabor vainilla', 300, 450, 5, 2, 7790000000030, NULL);
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
    id SERIAL PRIMARY KEY,
    id_venta INT,
    id_producto INT,
    cantidad INT,
    fecha_baja DATE,
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
    motivo VARCHAR(100),
    cantidad INT,
    fecha_baja DATE,
    CONSTRAINT fk_perdida_producto FOREIGN KEY (id_producto) REFERENCES producto(id)
);

INSERT INTO perdida (id_producto, fecha, motivo, cantidad, fecha_baja) VALUES
(2, '2025/05/25', 'falla de fábrica', 1, NULL),
(1, '2025/05/20', 'envase roto', 2, NULL);


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
    id SERIAL PRIMARY KEY,
    id_orden_compra INT,
    id_producto INT,
    cantidad INT,
    fecha_baja DATE,
    CONSTRAINT fk_detalle_oc_oc FOREIGN KEY (id_orden_compra) REFERENCES orden_compra(id),
    CONSTRAINT fk_detalle_oc_producto FOREIGN KEY (id_producto) REFERENCES producto(id)
);

INSERT INTO detalle_orden_compra (id, id_orden_compra, id_producto, cantidad, fecha_baja) VALUES
(1, 1, 1, 100, NULL),
(2, 2, 2, 50, NULL);


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
(1, 1, 'compra', 100, '2025-05-09', NULL),
(2, 2, 'venta', -50, '2025-05-10', NULL),
(3, 1, 'perdida', -2, '2025-05-10', NULL),
(4, 2, 'compra', 150, '2025-05-10', NULL);


