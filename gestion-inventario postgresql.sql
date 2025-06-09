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
(1, 'Marcelo Murgo','cmmurgo@gmail.com', '$2b$10$5Eqv6SZkI8GYf9yfA92kxOUr/sUFpS2Uz/T2WRH2DrXS3FkWHjf3u', 'admin', null);

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

CREATE TABLE rubro (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) UNIQUE NOT NULL
);


INSERT INTO rubro (nombre) VALUES
    ('Lácteos'),
    ('Bebidas'),
    ('Panificados'),
    ('Limpieza'),
    ('Carnicería'),
    ('Frutas y Verduras'),
    ('Congelados'),
    ('Snacks'),
    ('Electrodomésticos'),
    ('Perfumería'),
    ('Aceites'),
    ('Almacén'),
    ('Carnes'),
    ('Huevos');


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
    id_rubro INT,
    fecha_baja DATE,
    CONSTRAINT fk_rubro FOREIGN KEY (id_rubro) REFERENCES rubro(id)
);

INSERT INTO proveedor (nombre, email, telefono, contacto, direccion, cuit, id_rubro, fecha_baja) VALUES
('Distribuidora Mendoza', 'ventas@distribuidoramza.com', '2614123000', 'Juan Torres', 'Ruta 40 Km 12', '30-11223344-5', 2, NULL), -- Bebidas = 2
('Lácteos Andinos', 'info@lacteosandinos.com', '2614332211', 'Ana Suárez', 'Calle Rural 888', '30-55667788-9', 1, NULL), -- Lácteos = 1
('Panificados San Luis', 'contacto@panificadossl.com', '2664001122', 'María González', 'Av. España 500', '30-11112222-1', 3, NULL), -- Panificados = 3
('Aceitera del Sur', 'ventas@aceiterasur.com', '2614556677', 'Carlos Díaz', 'Parque Industrial Lote 12', '30-33334444-3', 11, NULL), -- Aceites = (supongamos 11)
('Snacks y Dulces SRL', 'info@snackydulce.com', '2614667788', 'Laura Rivas', 'Calle Libertad 234', '30-55556666-5', 8, NULL), -- Snacks = 8
('Super Almacén SA', 'compras@superalmacen.com', '2614778899', 'José Pérez', 'Mitre 789', '30-77778888-7', 12, NULL), -- Almacén = (supongamos 12)
('Limpieza Total', 'ventas@limpiezatotal.com', '2614889900', 'Rosa Márquez', 'Zona Industrial Norte', '30-99990000-9', 4, NULL), -- Limpieza = 4
('Carnicería El Ganadero', 'carnes@ganadero.com', '2614990011', 'Pedro Herrera', 'Av. Las Heras 321', '30-22221111-2', 13, NULL), -- Carnes = (supongamos 13)
('Congelados del Oeste', 'info@congeladosoeste.com', '2614000022', 'Julián Salas', 'Ruta 60 Km 4', '30-44443333-4', 7, NULL), -- Congelados = 7
('Frutas del Valle', 'ventas@frutasdelvalle.com', '2614111222', 'Camila Gómez', 'Calle Los Pinos 1010', '30-12344321-0', 6, NULL), -- Frutas y Verduras = 6
('Electro Hogar', 'contacto@electrohogar.com', '2614222333', 'Santiago Molina', 'Av. Tecnología 456', '30-67891234-1', 9, NULL), -- Electrodomésticos = 9
('Perfumería del Centro', 'info@perfumeriacentro.com', '2614333444', 'Valeria Núñez', 'Calle San Martín 700', '30-43216789-2', 10, NULL), -- Perfumería = 10
('Huevos Los Andes', 'ventas@huevoslosandes.com', '2614444555', 'Esteban Ruiz', 'Camino a la Granja 12', '30-98765432-3', 14, NULL); -- Huevos = 14



CREATE TABLE producto (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    id_rubro INT,
    descripcion TEXT,
    precio_costo INT,
    precio_venta INT,
    stock_minimo INT,
    id_promocion INT,
    codigo_barra BIGINT,
    fecha_baja DATE,
    id_proveedor INT,
    CONSTRAINT fk_promocion FOREIGN KEY (id_promocion) REFERENCES promocion(id),
    CONSTRAINT fk_proveedor FOREIGN KEY (id_proveedor) REFERENCES proveedor(id),
    CONSTRAINT fk_rubro FOREIGN KEY (id_rubro) REFERENCES rubro(id)
);

INSERT INTO producto (
    nombre, id_rubro, descripcion, precio_costo, precio_venta, stock_minimo,
    id_promocion, codigo_barra, fecha_baja, id_proveedor
) VALUES
('Gaseosa Cola 1.5L', 2, 'Botella de 1.5 litros', 100, 180, 15, 1, 7790000000003, NULL, 1), -- Bebidas = 2
('Yogur Natural 1L', 1, 'Yogur sin sabor', 90, 140, 10, 3, 7790000000004, NULL, 2), -- Lácteos = 1
('Pan de Molde', 3, 'Pan blanco en paquete', 80, 120, 20, NULL, 7790000000005, NULL, 3), -- Panificados = 3
('Aceite Girasol 1L', 11, 'Aceite comestible de girasol', 150, 220, 5, NULL, 7790000000006, NULL, 4), -- Aceites = 11
('Galletitas Dulces', 8, 'Galletas de chocolate', 60, 100, 30, 2, 7790000000007, NULL, 5), -- Snacks = 8
('Jugo en Polvo', 2, 'Sabor naranja', 20, 45, 50, 1, 7790000000008, NULL, 5), -- Bebidas = 2
('Café Molido 250g', 2, 'Café tostado molido', 200, 300, 5, NULL, 7790000000009, NULL, 13), -- Bebidas = 2 (proveedor 13)
('Arroz 1kg', 12, 'Arroz largo fino', 70, 110, 10, NULL, 7790000000010, NULL, 4), -- Almacén = 12
('Fideos Spaghetti', 12, 'Pasta seca', 60, 100, 10, NULL, 7790000000011, NULL, 4),
('Sal fina 500g', 12, 'Sal común', 20, 35, 15, NULL, 7790000000012, NULL, 4),
('Azúcar 1kg', 12, 'Azúcar refinada', 50, 90, 20, NULL, 7790000000013, NULL, 4),
('Mermelada Frutilla', 12, 'Mermelada natural', 90, 140, 5, 3, 7790000000014, NULL, 5),
('Harina 000 1kg', 12, 'Harina común', 40, 70, 30, NULL, 7790000000015, NULL, 4),
('Huevos docena', 14, 'Huevos de gallina', 150, 220, 5, NULL, 7790000000016, NULL, 2), -- Huevos = 14
('Manteca 200g', 1, 'Manteca con sal', 100, 160, 5, 3, 7790000000017, NULL, 2),
('Queso Cremoso', 1, 'Queso fresco', 250, 350, 5, NULL, 7790000000018, NULL, 2),
('Cerveza 500ml', 2, 'Cerveza rubia', 180, 300, 10, NULL, 7790000000019, NULL, 6),
('Jabón de Tocador', 4, 'Jabón perfumado', 50, 90, 20, NULL, 7790000000020, NULL, 7),
('Shampoo 400ml', 4, 'Shampoo para cabello normal', 200, 300, 5, NULL, 7790000000021, NULL, 8),
('Papel Higiénico', 4, 'Rollo doble hoja', 60, 100, 30, NULL, 7790000000022, NULL, 7),
('Lavandina 1L', 4, 'Desinfectante líquido', 30, 60, 20, NULL, 7790000000023, NULL, 7),
('Detergente 500ml', 4, 'Detergente líquido para ropa', 100, 160, 10, NULL, 7790000000024, NULL, 7),
('Helado Crema', 7, 'Helado artesanal', 150, 250, 5, NULL, 7790000000025, NULL, 9),
('Papas Fritas Bolsa 200g', 8, 'Snack de papa', 80, 120, 15, 2, 7790000000026, NULL, 5),
('Perfume Mujer', 10, 'Fragancia floral', 600, 900, 5, NULL, 7790000000027, NULL, 10),
('Desodorante Hombre', 10, 'Spray antitranspirante', 400, 600, 10, NULL, 7790000000028, NULL, 10),
('Toallas Higiéniques', 10, 'Paquete x10', 300, 450, 20, NULL, 7790000000029, NULL, 10),
('Cuchillas de Afeitar', 10, 'Pack 5 unidades', 350, 500, 15, NULL, 7790000000030, NULL, 10),
('Harina 000 - Marca Sol', 12, 'Bolsa de 1kg de harina de trigo tipo 000', 50, 200, 20, NULL, 7791234567890, NULL, 4),
('Fideos Tirabuzón - Don Felipe', 12, 'Paquete de 500g de fideos tipo tirabuzón', 40, 150, 15, NULL, 7799876543210, NULL, 4);



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
(1, '2025-05-01', 'Recibido', NULL),
(2, '2025-05-02', 'Recibido', NULL),
(3, '2025-05-03', 'Recibido', NULL),
(4, '2025-05-04', 'Recibido', NULL),
(5, '2025-05-05', 'Recibido', NULL),
(6, '2025-05-06', 'Recibido', NULL),
(7, '2025-05-07', 'Recibido', NULL),
(8, '2025-05-08', 'Recibido', NULL),
(9, '2025-05-09', 'Recibido', NULL),
(10, '2025-05-10', 'Recibido', NULL),
(11, '2025-05-11', 'Recibido', NULL),
(12, '2025-05-12', 'Recibido', NULL),
(13, '2025-05-13', 'Recibido', NULL);



CREATE TABLE detalle_orden_compra (
    id SERIAL PRIMARY KEY,
    id_orden_compra INT,
    id_producto INT,
    cantidad INT,
    fecha_baja DATE,
    CONSTRAINT fk_detalle_oc_oc FOREIGN KEY (id_orden_compra) REFERENCES orden_compra(id),
    CONSTRAINT fk_detalle_oc_producto FOREIGN KEY (id_producto) REFERENCES producto(id)
);

INSERT INTO detalle_orden_compra (id_orden_compra, id_producto, cantidad, fecha_baja) VALUES
    -- Proveedor 1
    (1, 1, 100, NULL),
    (1, 29, 150, NULL),

    -- Proveedor 2
    (2, 2, 80, NULL),
    (2, 14, 100, NULL),
    (2, 15, 70, NULL),
    (2, 16, 60, NULL),
    (2, 30, 120, NULL),

    -- Proveedor 3
    (3, 3, 90, NULL),

    -- Proveedor 4
    (4, 4, 100, NULL),
    (4, 8, 150, NULL),
    (4, 9, 150, NULL),
    (4, 10, 100, NULL),
    (4, 11, 120, NULL),
    (4, 13, 160, NULL),

    -- Proveedor 5
    (5, 5, 200, NULL),
    (5, 6, 300, NULL),
    (5, 12, 90, NULL),

    -- Proveedor 6
    (6, 17, 110, NULL),

    -- Proveedor 7
    (7, 18, 100, NULL),
    (7, 20, 120, NULL),
    (7, 21, 140, NULL),
    (7, 22, 60, NULL),
    (7, 23, 90, NULL),
    (7, 24, 100, NULL),

    -- Proveedor 8
    (8, 19, 80, NULL),

    -- Proveedor 9
    (9, 25, 50, NULL),

    -- Proveedor 10
    (10, 26, 60, NULL),

    -- Proveedor 11
    (11, 27, 100, NULL),

    -- Proveedor 12
    (12, 28, 100, NULL),

    -- Proveedor 13
    (13, 7, 80, NULL);



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
    -- Orden 1
    (1, 1, 'compra', 100, '2025-05-01', NULL),
    (1, 29, 'compra', 150, '2025-05-01', NULL),

    -- Orden 2
    (2, 2, 'compra', 80, '2025-05-02', NULL),
    (2, 14, 'compra', 100, '2025-05-02', NULL),
    (2, 15, 'compra', 70, '2025-05-02', NULL),
    (2, 16, 'compra', 60, '2025-05-02', NULL),
    (2, 30, 'compra', 120, '2025-05-02', NULL),

    -- Orden 3
    (3, 3, 'compra', 90, '2025-05-03', NULL),

    -- Orden 4
    (4, 4, 'compra', 100, '2025-05-04', NULL),
    (4, 8, 'compra', 150, '2025-05-04', NULL),
    (4, 9, 'compra', 150, '2025-05-04', NULL),
    (4, 10, 'compra', 100, '2025-05-04', NULL),
    (4, 11, 'compra', 120, '2025-05-04', NULL),
    (4, 13, 'compra', 160, '2025-05-04', NULL),

    -- Orden 5
    (5, 5, 'compra', 200, '2025-05-05', NULL),
    (5, 6, 'compra', 300, '2025-05-05', NULL),
    (5, 12, 'compra', 90, '2025-05-05', NULL),

    -- Orden 6
    (6, 17, 'compra', 110, '2025-05-06', NULL),

    -- Orden 7
    (7, 18, 'compra', 100, '2025-05-07', NULL),
    (7, 20, 'compra', 120, '2025-05-07', NULL),
    (7, 21, 'compra', 140, '2025-05-07', NULL),
    (7, 22, 'compra', 60, '2025-05-07', NULL),
    (7, 23, 'compra', 90, '2025-05-07', NULL),
    (7, 24, 'compra', 100, '2025-05-07', NULL),

    -- Orden 8
    (8, 19, 'compra', 80, '2025-05-08', NULL),

    -- Orden 9
    (9, 25, 'compra', 50, '2025-05-09', NULL),

    -- Orden 10
    (10, 26, 'compra', 60, '2025-05-10', NULL),

    -- Orden 11
    (11, 27, 'compra', 100, '2025-05-11', NULL),

    -- Orden 12
    (12, 28, 'compra', 100, '2025-05-12', NULL),

    -- Orden 13
    (13, 7, 'compra', 80, '2025-05-13', NULL);



