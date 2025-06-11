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
('No es cliente', 'No es cliente', 'sin_registrar@example.com', '10000000', 'Sin Calle', '10-10000000-0', NULL),
('Carlos', 'Gonzalez', 'carlos.gonzalez@example.com', '2614123456', 'Av. San Martín 123', '20-12345678-9', NULL),
('Lucía', 'Pérez', 'lucia.perez@example.com', '2614234567', 'Calle Mitre 456', '27-87654321-0', NULL),
('Martín', 'Fernández', 'martin.fernandez@example.com', '2614345678', 'Paso de los Andes 789', '23-98765432-1', NULL),
('Sofía', 'Ramírez', 'sofia.ramirez@example.com', '2614456789', 'Boulogne Sur Mer 321', '27-11223344-5', NULL),
('Javier', 'Torres', 'javier.torres@example.com', '2614567890', 'España 654', '20-99887766-3', NULL),
('Valentina', 'Morales', 'valentina.morales@example.com', '2614667891', 'Godoy Cruz 123', '27-55667788-9', NULL),
('Diego', 'Sánchez', 'diego.sanchez@example.com', '2614778912', 'Dorrego 456', '20-11223344-6', NULL),
('Florencia', 'López', 'florencia.lopez@example.com', '2614889123', 'Guaymallén 789', '23-33445566-7', NULL),
('Tomás', 'Rivas', 'tomas.rivas@example.com', '2614991234', 'Las Heras 321', '27-44556677-8', NULL),
('Micaela', 'Castro', 'micaela.castro@example.com', '2614002345', 'San José 654', '20-55667788-9', NULL);


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


--------------------------
-- Más datos para pruebas:
--------------------------

-- Ventas (Enero)
INSERT INTO venta (id, fecha, id_cliente, fecha_baja) VALUES (3, '2025-01-05', 3, NULL);
INSERT INTO venta (id, fecha, id_cliente, fecha_baja) VALUES (4, '2025-01-10', 2, NULL);
INSERT INTO venta (id, fecha, id_cliente, fecha_baja) VALUES (5, '2025-01-15', 4, NULL);
INSERT INTO venta (id, fecha, id_cliente, fecha_baja) VALUES (6, '2025-01-20', 4, NULL);
INSERT INTO venta (id, fecha, id_cliente, fecha_baja) VALUES (7, '2025-01-25', 5, NULL);
-- Detalle de Ventas (Enero)
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (4, 3, 12, 2, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (5, 3, 14, 3, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (6, 4, 17, 1, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (7, 4, 28, 5, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (8, 5, 18, 5, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (9, 5, 15, 3, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (10, 6, 17, 5, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (11, 6, 7, 5, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (12, 7, 28, 5, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (13, 7, 5, 3, NULL);
-- Ordenes de Compra (Enero)
INSERT INTO orden_compra (id, id_proveedor, fecha, estado, fecha_baja) VALUES (14, 9, '2025-01-03', 'Recibido', NULL);
INSERT INTO orden_compra (id, id_proveedor, fecha, estado, fecha_baja) VALUES (15, 9, '2025-01-08', 'Recibido', NULL);
INSERT INTO orden_compra (id, id_proveedor, fecha, estado, fecha_baja) VALUES (16, 4, '2025-01-13', 'Recibido', NULL);
INSERT INTO orden_compra (id, id_proveedor, fecha, estado, fecha_baja) VALUES (17, 4, '2025-01-18', 'Recibido', NULL);
INSERT INTO orden_compra (id, id_proveedor, fecha, estado, fecha_baja) VALUES (18, 6, '2025-01-23', 'Recibido', NULL);
-- Detalles y Movimientos (Enero)
INSERT INTO detalle_orden_compra (id, id_orden_compra, id_producto, cantidad, fecha_baja) VALUES (43, 14, 4, 107, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1003, 14, 4, 'compra', 107, '2025-01-03', NULL);
INSERT INTO detalle_orden_compra (id, id_orden_compra, id_producto, cantidad, fecha_baja) VALUES (44, 14, 24, 99, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1004, 14, 24, 'compra', 99, '2025-01-03', NULL);
INSERT INTO detalle_orden_compra (id, id_orden_compra, id_producto, cantidad, fecha_baja) VALUES (45, 15, 24, 93, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1005, 15, 24, 'compra', 93, '2025-01-08', NULL);
INSERT INTO detalle_orden_compra (id, id_orden_compra, id_producto, cantidad, fecha_baja) VALUES (46, 15, 20, 109, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1006, 15, 20, 'compra', 109, '2025-01-08', NULL);
INSERT INTO detalle_orden_compra (id, id_orden_compra, id_producto, cantidad, fecha_baja) VALUES (47, 16, 21, 171, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1007, 16, 21, 'compra', 171, '2025-01-13', NULL);
INSERT INTO detalle_orden_compra (id, id_orden_compra, id_producto, cantidad, fecha_baja) VALUES (48, 16, 11, 138, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1008, 16, 11, 'compra', 138, '2025-01-13', NULL);
INSERT INTO detalle_orden_compra (id, id_orden_compra, id_producto, cantidad, fecha_baja) VALUES (49, 17, 9, 196, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1009, 17, 9, 'compra', 196, '2025-01-18', NULL);
INSERT INTO detalle_orden_compra (id, id_orden_compra, id_producto, cantidad, fecha_baja) VALUES (50, 17, 4, 120, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1010, 17, 4, 'compra', 120, '2025-01-18', NULL);
INSERT INTO detalle_orden_compra (id, id_orden_compra, id_producto, cantidad, fecha_baja) VALUES (51, 18, 14, 76, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1011, 18, 14, 'compra', 76, '2025-01-23', NULL);
INSERT INTO detalle_orden_compra (id, id_orden_compra, id_producto, cantidad, fecha_baja) VALUES (52, 18, 19, 192, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1012, 18, 19, 'compra', 192, '2025-01-23', NULL);
-- Perdidas (Enero)
INSERT INTO perdida (id, id_producto, fecha, motivo, cantidad, fecha_baja) VALUES (3, 20, '2025-01-15', 'mal estado', 2, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1013, 3, 20, 'perdida', 2, '2025-01-15', NULL);
-- Ventas (Febrero)
INSERT INTO venta (id, fecha, id_cliente, fecha_baja) VALUES (8, '2025-02-05', 4, NULL);
INSERT INTO venta (id, fecha, id_cliente, fecha_baja) VALUES (9, '2025-02-10', 5, NULL);
INSERT INTO venta (id, fecha, id_cliente, fecha_baja) VALUES (10, '2025-02-15', 4, NULL);
INSERT INTO venta (id, fecha, id_cliente, fecha_baja) VALUES (11, '2025-02-20', 5, NULL);
INSERT INTO venta (id, fecha, id_cliente, fecha_baja) VALUES (12, '2025-02-25', 4, NULL);
-- Detalle de Ventas (Febrero)
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (14, 8, 23, 4, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (15, 8, 27, 4, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (16, 9, 13, 3, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (17, 9, 19, 3, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (18, 10, 18, 4, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (19, 10, 16, 3, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (20, 11, 22, 1, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (21, 11, 7, 4, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (22, 12, 5, 3, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (23, 12, 25, 5, NULL);
-- Ordenes de Compra (Febrero)
INSERT INTO orden_compra (id, id_proveedor, fecha, estado, fecha_baja) VALUES (19, 9, '2025-02-03', 'Recibido', NULL);
INSERT INTO orden_compra (id, id_proveedor, fecha, estado, fecha_baja) VALUES (20, 8, '2025-02-08', 'Recibido', NULL);
INSERT INTO orden_compra (id, id_proveedor, fecha, estado, fecha_baja) VALUES (21, 9, '2025-02-13', 'Recibido', NULL);
INSERT INTO orden_compra (id, id_proveedor, fecha, estado, fecha_baja) VALUES (22, 11, '2025-02-18', 'Recibido', NULL);
INSERT INTO orden_compra (id, id_proveedor, fecha, estado, fecha_baja) VALUES (23, 6, '2025-02-23', 'Recibido', NULL);
-- Detalles y Movimientos (Febrero)
INSERT INTO detalle_orden_compra (id, id_orden_compra, id_producto, cantidad, fecha_baja) VALUES (53, 19, 4, 90, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1014, 19, 4, 'compra', 90, '2025-02-03', NULL);
INSERT INTO detalle_orden_compra (id, id_orden_compra, id_producto, cantidad, fecha_baja) VALUES (54, 19, 29, 51, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1015, 19, 29, 'compra', 51, '2025-02-03', NULL);
INSERT INTO detalle_orden_compra (id, id_orden_compra, id_producto, cantidad, fecha_baja) VALUES (55, 20, 2, 142, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1016, 20, 2, 'compra', 142, '2025-02-08', NULL);
INSERT INTO detalle_orden_compra (id, id_orden_compra, id_producto, cantidad, fecha_baja) VALUES (56, 20, 3, 165, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1017, 20, 3, 'compra', 165, '2025-02-08', NULL);
INSERT INTO detalle_orden_compra (id, id_orden_compra, id_producto, cantidad, fecha_baja) VALUES (57, 21, 8, 135, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1018, 21, 8, 'compra', 135, '2025-02-13', NULL);
INSERT INTO detalle_orden_compra (id, id_orden_compra, id_producto, cantidad, fecha_baja) VALUES (58, 21, 22, 68, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1019, 21, 22, 'compra', 68, '2025-02-13', NULL);
INSERT INTO detalle_orden_compra (id, id_orden_compra, id_producto, cantidad, fecha_baja) VALUES (59, 22, 3, 185, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1020, 22, 3, 'compra', 185, '2025-02-18', NULL);
INSERT INTO detalle_orden_compra (id, id_orden_compra, id_producto, cantidad, fecha_baja) VALUES (60, 22, 13, 102, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1021, 22, 13, 'compra', 102, '2025-02-18', NULL);
INSERT INTO detalle_orden_compra (id, id_orden_compra, id_producto, cantidad, fecha_baja) VALUES (61, 23, 29, 63, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1022, 23, 29, 'compra', 63, '2025-02-23', NULL);
INSERT INTO detalle_orden_compra (id, id_orden_compra, id_producto, cantidad, fecha_baja) VALUES (62, 23, 24, 81, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1023, 23, 24, 'compra', 81, '2025-02-23', NULL);
-- Perdidas (Febrero)
INSERT INTO perdida (id, id_producto, fecha, motivo, cantidad, fecha_baja) VALUES (4, 8, '2025-02-18', 'vencido', 2, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1024, 4, 8, 'perdida', 2, '2025-02-18', NULL);
INSERT INTO perdida (id, id_producto, fecha, motivo, cantidad, fecha_baja) VALUES (5, 20, '2025-02-10', 'mal estado', 2, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1025, 5, 20, 'perdida', 2, '2025-02-10', NULL);
-- Ventas (Marzo)
INSERT INTO venta (id, fecha, id_cliente, fecha_baja) VALUES (13, '2025-03-05', 5, NULL);
INSERT INTO venta (id, fecha, id_cliente, fecha_baja) VALUES (14, '2025-03-10', 3, NULL);
INSERT INTO venta (id, fecha, id_cliente, fecha_baja) VALUES (15, '2025-03-15', 2, NULL);
INSERT INTO venta (id, fecha, id_cliente, fecha_baja) VALUES (16, '2025-03-20', 6, NULL);
INSERT INTO venta (id, fecha, id_cliente, fecha_baja) VALUES (17, '2025-03-25', 2, NULL);
-- Detalle de Ventas (Marzo)
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (24, 13, 1, 1, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (25, 13, 20, 5, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (26, 14, 5, 5, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (27, 14, 8, 4, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (28, 15, 11, 3, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (29, 15, 15, 5, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (30, 16, 11, 4, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (31, 16, 16, 1, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (32, 17, 1, 1, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (33, 17, 10, 2, NULL);
-- Ordenes de Compra (Marzo)
INSERT INTO orden_compra (id, id_proveedor, fecha, estado, fecha_baja) VALUES (24, 5, '2025-03-03', 'Recibido', NULL);
INSERT INTO orden_compra (id, id_proveedor, fecha, estado, fecha_baja) VALUES (25, 12, '2025-03-08', 'Recibido', NULL);
INSERT INTO orden_compra (id, id_proveedor, fecha, estado, fecha_baja) VALUES (26, 2, '2025-03-13', 'Recibido', NULL);
INSERT INTO orden_compra (id, id_proveedor, fecha, estado, fecha_baja) VALUES (27, 7, '2025-03-18', 'Recibido', NULL);
INSERT INTO orden_compra (id, id_proveedor, fecha, estado, fecha_baja) VALUES (28, 11, '2025-03-23', 'Recibido', NULL);
-- Detalles y Movimientos (Marzo)
INSERT INTO detalle_orden_compra (id, id_orden_compra, id_producto, cantidad, fecha_baja) VALUES (63, 24, 21, 86, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1026, 24, 21, 'compra', 86, '2025-03-03', NULL);
INSERT INTO detalle_orden_compra (id, id_orden_compra, id_producto, cantidad, fecha_baja) VALUES (64, 24, 13, 59, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1027, 24, 13, 'compra', 59, '2025-03-03', NULL);
INSERT INTO detalle_orden_compra (id, id_orden_compra, id_producto, cantidad, fecha_baja) VALUES (65, 25, 18, 156, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1028, 25, 18, 'compra', 156, '2025-03-08', NULL);
INSERT INTO detalle_orden_compra (id, id_orden_compra, id_producto, cantidad, fecha_baja) VALUES (66, 25, 14, 56, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1029, 25, 14, 'compra', 56, '2025-03-08', NULL);
INSERT INTO detalle_orden_compra (id, id_orden_compra, id_producto, cantidad, fecha_baja) VALUES (67, 26, 25, 88, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1030, 26, 25, 'compra', 88, '2025-03-13', NULL);
INSERT INTO detalle_orden_compra (id, id_orden_compra, id_producto, cantidad, fecha_baja) VALUES (68, 26, 15, 162, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1031, 26, 15, 'compra', 162, '2025-03-13', NULL);
INSERT INTO detalle_orden_compra (id, id_orden_compra, id_producto, cantidad, fecha_baja) VALUES (69, 27, 5, 144, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1032, 27, 5, 'compra', 144, '2025-03-18', NULL);
INSERT INTO detalle_orden_compra (id, id_orden_compra, id_producto, cantidad, fecha_baja) VALUES (70, 27, 25, 167, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1033, 27, 25, 'compra', 167, '2025-03-18', NULL);
INSERT INTO detalle_orden_compra (id, id_orden_compra, id_producto, cantidad, fecha_baja) VALUES (71, 28, 25, 69, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1034, 28, 25, 'compra', 69, '2025-03-23', NULL);
INSERT INTO detalle_orden_compra (id, id_orden_compra, id_producto, cantidad, fecha_baja) VALUES (72, 28, 18, 199, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1035, 28, 18, 'compra', 199, '2025-03-23', NULL);
-- Perdidas (Marzo)
INSERT INTO perdida (id, id_producto, fecha, motivo, cantidad, fecha_baja) VALUES (6, 25, '2025-03-14', 'vencido', 3, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1036, 6, 25, 'perdida', 3, '2025-03-14', NULL);
INSERT INTO perdida (id, id_producto, fecha, motivo, cantidad, fecha_baja) VALUES (7, 30, '2025-03-16', 'vencido', 1, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1037, 7, 30, 'perdida', 1, '2025-03-16', NULL);
INSERT INTO perdida (id, id_producto, fecha, motivo, cantidad, fecha_baja) VALUES (8, 25, '2025-03-17', 'roto', 2, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1038, 8, 25, 'perdida', 2, '2025-03-17', NULL);
-- Ventas (Abril)
INSERT INTO venta (id, fecha, id_cliente, fecha_baja) VALUES (18, '2025-04-05', 4, NULL);
INSERT INTO venta (id, fecha, id_cliente, fecha_baja) VALUES (19, '2025-04-10', 6, NULL);
INSERT INTO venta (id, fecha, id_cliente, fecha_baja) VALUES (20, '2025-04-15', 5, NULL);
INSERT INTO venta (id, fecha, id_cliente, fecha_baja) VALUES (21, '2025-04-20', 2, NULL);
INSERT INTO venta (id, fecha, id_cliente, fecha_baja) VALUES (22, '2025-04-25', 4, NULL);
-- Detalle de Ventas (Abril)
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (34, 18, 25, 3, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (35, 18, 18, 4, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (36, 19, 29, 3, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (37, 19, 7, 1, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (38, 20, 11, 3, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (39, 20, 2, 4, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (40, 21, 5, 1, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (41, 21, 9, 3, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (42, 22, 13, 2, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (43, 22, 6, 1, NULL);
-- Ordenes de Compra (Abril)
INSERT INTO orden_compra (id, id_proveedor, fecha, estado, fecha_baja) VALUES (29, 7, '2025-04-03', 'Recibido', NULL);
INSERT INTO orden_compra (id, id_proveedor, fecha, estado, fecha_baja) VALUES (30, 1, '2025-04-08', 'Recibido', NULL);
INSERT INTO orden_compra (id, id_proveedor, fecha, estado, fecha_baja) VALUES (31, 6, '2025-04-13', 'Recibido', NULL);
INSERT INTO orden_compra (id, id_proveedor, fecha, estado, fecha_baja) VALUES (32, 12, '2025-04-18', 'Recibido', NULL);
INSERT INTO orden_compra (id, id_proveedor, fecha, estado, fecha_baja) VALUES (33, 6, '2025-04-23', 'Recibido', NULL);
-- Detalles y Movimientos (Abril)
INSERT INTO detalle_orden_compra (id, id_orden_compra, id_producto, cantidad, fecha_baja) VALUES (73, 29, 5, 108, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1039, 29, 5, 'compra', 108, '2025-04-03', NULL);
INSERT INTO detalle_orden_compra (id, id_orden_compra, id_producto, cantidad, fecha_baja) VALUES (74, 29, 26, 146, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1040, 29, 26, 'compra', 146, '2025-04-03', NULL);
INSERT INTO detalle_orden_compra (id, id_orden_compra, id_producto, cantidad, fecha_baja) VALUES (75, 30, 13, 53, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1041, 30, 13, 'compra', 53, '2025-04-08', NULL);
INSERT INTO detalle_orden_compra (id, id_orden_compra, id_producto, cantidad, fecha_baja) VALUES (76, 30, 1, 102, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1042, 30, 1, 'compra', 102, '2025-04-08', NULL);
INSERT INTO detalle_orden_compra (id, id_orden_compra, id_producto, cantidad, fecha_baja) VALUES (77, 31, 15, 68, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1043, 31, 15, 'compra', 68, '2025-04-13', NULL);
INSERT INTO detalle_orden_compra (id, id_orden_compra, id_producto, cantidad, fecha_baja) VALUES (78, 31, 12, 161, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1044, 31, 12, 'compra', 161, '2025-04-13', NULL);
INSERT INTO detalle_orden_compra (id, id_orden_compra, id_producto, cantidad, fecha_baja) VALUES (79, 32, 21, 74, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1045, 32, 21, 'compra', 74, '2025-04-18', NULL);
INSERT INTO detalle_orden_compra (id, id_orden_compra, id_producto, cantidad, fecha_baja) VALUES (80, 32, 10, 81, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1046, 32, 10, 'compra', 81, '2025-04-18', NULL);
INSERT INTO detalle_orden_compra (id, id_orden_compra, id_producto, cantidad, fecha_baja) VALUES (81, 33, 30, 190, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1047, 33, 30, 'compra', 190, '2025-04-23', NULL);
INSERT INTO detalle_orden_compra (id, id_orden_compra, id_producto, cantidad, fecha_baja) VALUES (82, 33, 4, 112, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1048, 33, 4, 'compra', 112, '2025-04-23', NULL);
-- Perdidas (Abril)
INSERT INTO perdida (id, id_producto, fecha, motivo, cantidad, fecha_baja) VALUES (9, 9, '2025-04-03', 'vencido', 3, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1049, 9, 9, 'perdida', 3, '2025-04-03', NULL);
-- Ventas (Mayo)
INSERT INTO venta (id, fecha, id_cliente, fecha_baja) VALUES (23, '2025-05-05', 5, NULL);
INSERT INTO venta (id, fecha, id_cliente, fecha_baja) VALUES (24, '2025-05-10', 2, NULL);
INSERT INTO venta (id, fecha, id_cliente, fecha_baja) VALUES (25, '2025-05-15', 3, NULL);
INSERT INTO venta (id, fecha, id_cliente, fecha_baja) VALUES (26, '2025-05-20', 3, NULL);
INSERT INTO venta (id, fecha, id_cliente, fecha_baja) VALUES (27, '2025-05-25', 3, NULL);
-- Detalle de Ventas (Mayo)
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (44, 23, 20, 5, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (45, 23, 25, 1, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (46, 24, 5, 3, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (47, 24, 11, 5, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (48, 25, 27, 3, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (49, 25, 18, 3, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (50, 26, 28, 2, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (51, 26, 6, 4, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (52, 27, 4, 3, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (53, 27, 23, 5, NULL);
-- Ordenes de Compra (Mayo)
INSERT INTO orden_compra (id, id_proveedor, fecha, estado, fecha_baja) VALUES (34, 4, '2025-05-03', 'Recibido', NULL);
INSERT INTO orden_compra (id, id_proveedor, fecha, estado, fecha_baja) VALUES (35, 4, '2025-05-08', 'Recibido', NULL);
INSERT INTO orden_compra (id, id_proveedor, fecha, estado, fecha_baja) VALUES (36, 5, '2025-05-13', 'Recibido', NULL);
INSERT INTO orden_compra (id, id_proveedor, fecha, estado, fecha_baja) VALUES (37, 5, '2025-05-18', 'Recibido', NULL);
INSERT INTO orden_compra (id, id_proveedor, fecha, estado, fecha_baja) VALUES (38, 3, '2025-05-23', 'Recibido', NULL);
-- Detalles y Movimientos (Mayo)
INSERT INTO detalle_orden_compra (id, id_orden_compra, id_producto, cantidad, fecha_baja) VALUES (83, 34, 4, 101, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1050, 34, 4, 'compra', 101, '2025-05-03', NULL);
INSERT INTO detalle_orden_compra (id, id_orden_compra, id_producto, cantidad, fecha_baja) VALUES (84, 34, 21, 158, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1051, 34, 21, 'compra', 158, '2025-05-03', NULL);
INSERT INTO detalle_orden_compra (id, id_orden_compra, id_producto, cantidad, fecha_baja) VALUES (85, 35, 1, 172, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1052, 35, 1, 'compra', 172, '2025-05-08', NULL);
INSERT INTO detalle_orden_compra (id, id_orden_compra, id_producto, cantidad, fecha_baja) VALUES (86, 35, 8, 183, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1053, 35, 8, 'compra', 183, '2025-05-08', NULL);
INSERT INTO detalle_orden_compra (id, id_orden_compra, id_producto, cantidad, fecha_baja) VALUES (87, 36, 1, 120, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1054, 36, 1, 'compra', 120, '2025-05-13', NULL);
INSERT INTO detalle_orden_compra (id, id_orden_compra, id_producto, cantidad, fecha_baja) VALUES (88, 36, 26, 83, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1055, 36, 26, 'compra', 83, '2025-05-13', NULL);
INSERT INTO detalle_orden_compra (id, id_orden_compra, id_producto, cantidad, fecha_baja) VALUES (89, 37, 10, 148, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1056, 37, 10, 'compra', 148, '2025-05-18', NULL);
INSERT INTO detalle_orden_compra (id, id_orden_compra, id_producto, cantidad, fecha_baja) VALUES (90, 37, 4, 154, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1057, 37, 4, 'compra', 154, '2025-05-18', NULL);
INSERT INTO detalle_orden_compra (id, id_orden_compra, id_producto, cantidad, fecha_baja) VALUES (91, 38, 14, 123, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1058, 38, 14, 'compra', 123, '2025-05-23', NULL);
INSERT INTO detalle_orden_compra (id, id_orden_compra, id_producto, cantidad, fecha_baja) VALUES (92, 38, 13, 156, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1059, 38, 13, 'compra', 156, '2025-05-23', NULL);
-- Perdidas (Mayo)
INSERT INTO perdida (id, id_producto, fecha, motivo, cantidad, fecha_baja) VALUES (10, 7, '2025-05-03', 'mal estado', 3, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1060, 10, 7, 'perdida', 3, '2025-05-03', NULL);
INSERT INTO perdida (id, id_producto, fecha, motivo, cantidad, fecha_baja) VALUES (11, 18, '2025-05-27', 'vencido', 2, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1061, 11, 18, 'perdida', 2, '2025-05-27', NULL);
-- Ventas (Junio)
INSERT INTO venta (id, fecha, id_cliente, fecha_baja) VALUES (28, '2025-06-05', 3, NULL);
INSERT INTO venta (id, fecha, id_cliente, fecha_baja) VALUES (29, '2025-06-10', 2, NULL);
INSERT INTO venta (id, fecha, id_cliente, fecha_baja) VALUES (30, '2025-06-15', 3, NULL);
INSERT INTO venta (id, fecha, id_cliente, fecha_baja) VALUES (31, '2025-06-20', 5, NULL);
INSERT INTO venta (id, fecha, id_cliente, fecha_baja) VALUES (32, '2025-06-25', 2, NULL);
-- Detalle de Ventas (Junio)
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (54, 28, 27, 1, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (55, 28, 19, 3, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (56, 29, 12, 1, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (57, 29, 10, 3, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (58, 30, 9, 5, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (59, 30, 3, 2, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (60, 31, 24, 2, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (61, 31, 22, 1, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (62, 32, 2, 4, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (63, 32, 24, 4, NULL);
-- Ordenes de Compra (Junio)
INSERT INTO orden_compra (id, id_proveedor, fecha, estado, fecha_baja) VALUES (39, 3, '2025-06-03', 'Recibido', NULL);
INSERT INTO orden_compra (id, id_proveedor, fecha, estado, fecha_baja) VALUES (40, 4, '2025-06-08', 'Recibido', NULL);
INSERT INTO orden_compra (id, id_proveedor, fecha, estado, fecha_baja) VALUES (41, 11, '2025-06-13', 'Recibido', NULL);
INSERT INTO orden_compra (id, id_proveedor, fecha, estado, fecha_baja) VALUES (42, 5, '2025-06-18', 'Recibido', NULL);
INSERT INTO orden_compra (id, id_proveedor, fecha, estado, fecha_baja) VALUES (43, 6, '2025-06-23', 'Recibido', NULL);
-- Detalles y Movimientos (Junio)
INSERT INTO detalle_orden_compra (id, id_orden_compra, id_producto, cantidad, fecha_baja) VALUES (93, 39, 21, 135, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1062, 39, 21, 'compra', 135, '2025-06-03', NULL);
INSERT INTO detalle_orden_compra (id, id_orden_compra, id_producto, cantidad, fecha_baja) VALUES (94, 39, 7, 85, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1063, 39, 7, 'compra', 85, '2025-06-03', NULL);
INSERT INTO detalle_orden_compra (id, id_orden_compra, id_producto, cantidad, fecha_baja) VALUES (95, 40, 19, 200, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1064, 40, 19, 'compra', 200, '2025-06-08', NULL);
INSERT INTO detalle_orden_compra (id, id_orden_compra, id_producto, cantidad, fecha_baja) VALUES (96, 40, 14, 61, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1065, 40, 14, 'compra', 61, '2025-06-08', NULL);
INSERT INTO detalle_orden_compra (id, id_orden_compra, id_producto, cantidad, fecha_baja) VALUES (97, 41, 17, 117, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1066, 41, 17, 'compra', 117, '2025-06-13', NULL);
INSERT INTO detalle_orden_compra (id, id_orden_compra, id_producto, cantidad, fecha_baja) VALUES (98, 41, 9, 132, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1067, 41, 9, 'compra', 132, '2025-06-13', NULL);
INSERT INTO detalle_orden_compra (id, id_orden_compra, id_producto, cantidad, fecha_baja) VALUES (99, 42, 15, 151, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1068, 42, 15, 'compra', 151, '2025-06-18', NULL);
INSERT INTO detalle_orden_compra (id, id_orden_compra, id_producto, cantidad, fecha_baja) VALUES (100, 42, 6, 124, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1069, 42, 6, 'compra', 124, '2025-06-18', NULL);
INSERT INTO detalle_orden_compra (id, id_orden_compra, id_producto, cantidad, fecha_baja) VALUES (101, 43, 4, 94, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1070, 43, 4, 'compra', 94, '2025-06-23', NULL);
INSERT INTO detalle_orden_compra (id, id_orden_compra, id_producto, cantidad, fecha_baja) VALUES (102, 43, 30, 109, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1071, 43, 30, 'compra', 109, '2025-06-23', NULL);
-- Perdidas (Junio)
INSERT INTO perdida (id, id_producto, fecha, motivo, cantidad, fecha_baja) VALUES (12, 29, '2025-06-20', 'roto', 1, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1072, 12, 29, 'perdida', 1, '2025-06-20', NULL);
INSERT INTO perdida (id, id_producto, fecha, motivo, cantidad, fecha_baja) VALUES (13, 11, '2025-06-15', 'roto', 2, NULL);
INSERT INTO movimientos (id, id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1073, 13, 11, 'perdida', 2, '2025-06-15', NULL);

--Movimientos de ventas:
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1, 1, 'venta', 2, '2025-05-10', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (1, 2, 'venta', 1, '2025-05-10', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (2, 1, 'venta', 3, '2025-05-12', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (3, 12, 'venta', 2, '2025-01-05', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (3, 14, 'venta', 3, '2025-01-05', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (4, 17, 'venta', 1, '2025-01-10', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (4, 28, 'venta', 5, '2025-01-10', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (5, 18, 'venta', 5, '2025-01-15', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (5, 15, 'venta', 3, '2025-01-15', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (6, 17, 'venta', 5, '2025-01-20', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (6, 7, 'venta', 5, '2025-01-20', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (7, 28, 'venta', 5, '2025-01-25', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (7, 5, 'venta', 3, '2025-01-25', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (8, 23, 'venta', 4, '2025-02-05', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (8, 27, 'venta', 4, '2025-02-05', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (9, 13, 'venta', 3, '2025-02-10', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (9, 19, 'venta', 3, '2025-02-10', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (10, 18, 'venta', 4, '2025-02-15', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (10, 16, 'venta', 3, '2025-02-15', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (11, 22, 'venta', 1, '2025-02-20', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (11, 7, 'venta', 4, '2025-02-20', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (12, 5, 'venta', 3, '2025-02-25', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (12, 25, 'venta', 5, '2025-02-25', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (13, 1, 'venta', 1, '2025-03-05', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (13, 20, 'venta', 5, '2025-03-05', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (14, 5, 'venta', 5, '2025-03-10', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (14, 8, 'venta', 4, '2025-03-10', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (15, 11, 'venta', 3, '2025-03-15', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (15, 15, 'venta', 5, '2025-03-15', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (16, 11, 'venta', 4, '2025-03-20', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (16, 16, 'venta', 1, '2025-03-20', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (17, 1, 'venta', 1, '2025-03-25', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (17, 10, 'venta', 2, '2025-03-25', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (18, 25, 'venta', 3, '2025-04-05', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (18, 18, 'venta', 4, '2025-04-05', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (19, 29, 'venta', 3, '2025-04-10', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (19, 7, 'venta', 1, '2025-04-10', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (20, 11, 'venta', 3, '2025-04-15', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (20, 2, 'venta', 4, '2025-04-15', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (21, 5, 'venta', 1, '2025-04-20', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (21, 9, 'venta', 3, '2025-04-20', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (22, 13, 'venta', 2, '2025-04-25', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (22, 6, 'venta', 1, '2025-04-25', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (23, 20, 'venta', 5, '2025-05-05', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (23, 25, 'venta', 1, '2025-05-05', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (24, 5, 'venta', 3, '2025-05-10', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (24, 11, 'venta', 5, '2025-05-10', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (25, 27, 'venta', 3, '2025-05-15', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (25, 18, 'venta', 3, '2025-05-15', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (26, 28, 'venta', 2, '2025-05-20', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (26, 6, 'venta', 4, '2025-05-20', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (27, 4, 'venta', 3, '2025-05-25', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (27, 23, 'venta', 5, '2025-05-25', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (28, 27, 'venta', 1, '2025-06-05', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (28, 19, 'venta', 3, '2025-06-05', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (29, 12, 'venta', 1, '2025-06-10', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (29, 10, 'venta', 3, '2025-06-10', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (30, 9, 'venta', 5, '2025-06-15', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (30, 3, 'venta', 2, '2025-06-15', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (31, 24, 'venta', 2, '2025-06-20', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (31, 22, 'venta', 1, '2025-06-20', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (32, 2, 'venta', 4, '2025-06-25', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (32, 24, 'venta', 4, '2025-06-25', NULL);


-----------------------------------
-- Más datos de ventas para pruebas:
-----------------------------------

-- Ventas (January)
INSERT INTO venta (id, fecha, id_cliente, fecha_baja) VALUES (33, '2025-01-05', 9, NULL);
INSERT INTO venta (id, fecha, id_cliente, fecha_baja) VALUES (34, '2025-01-10', 3, NULL);
INSERT INTO venta (id, fecha, id_cliente, fecha_baja) VALUES (35, '2025-01-15', 6, NULL);
INSERT INTO venta (id, fecha, id_cliente, fecha_baja) VALUES (36, '2025-01-20', 5, NULL);
INSERT INTO venta (id, fecha, id_cliente, fecha_baja) VALUES (37, '2025-01-25', 3, NULL);
-- Detalle de Ventas (January)
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (64, 33, 3, 19, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (65, 33, 17, 20, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (66, 34, 9, 12, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (67, 34, 26, 12, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (68, 34, 6, 11, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (69, 35, 26, 12, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (70, 35, 10, 16, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (71, 35, 18, 11, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (72, 36, 6, 17, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (73, 36, 27, 12, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (74, 36, 20, 19, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (75, 37, 6, 11, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (76, 37, 23, 13, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (77, 37, 19, 15, NULL);
-- Ventas (February)
INSERT INTO venta (id, fecha, id_cliente, fecha_baja) VALUES (38, '2025-02-05', 10, NULL);
INSERT INTO venta (id, fecha, id_cliente, fecha_baja) VALUES (39, '2025-02-10', 11, NULL);
INSERT INTO venta (id, fecha, id_cliente, fecha_baja) VALUES (40, '2025-02-15', 3, NULL);
INSERT INTO venta (id, fecha, id_cliente, fecha_baja) VALUES (41, '2025-02-20', 10, NULL);
INSERT INTO venta (id, fecha, id_cliente, fecha_baja) VALUES (42, '2025-02-25', 4, NULL);
-- Detalle de Ventas (February)
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (78, 38, 10, 18, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (79, 38, 16, 18, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (80, 39, 15, 15, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (81, 39, 13, 10, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (82, 39, 3, 19, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (83, 40, 7, 20, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (84, 40, 2, 18, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (85, 41, 5, 16, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (86, 41, 20, 10, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (87, 41, 4, 14, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (88, 42, 27, 20, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (89, 42, 7, 13, NULL);
-- Ventas (March)
INSERT INTO venta (id, fecha, id_cliente, fecha_baja) VALUES (43, '2025-03-05', 11, NULL);
INSERT INTO venta (id, fecha, id_cliente, fecha_baja) VALUES (44, '2025-03-10', 11, NULL);
INSERT INTO venta (id, fecha, id_cliente, fecha_baja) VALUES (45, '2025-03-15', 11, NULL);
INSERT INTO venta (id, fecha, id_cliente, fecha_baja) VALUES (46, '2025-03-20', 7, NULL);
INSERT INTO venta (id, fecha, id_cliente, fecha_baja) VALUES (47, '2025-03-25', 8, NULL);
-- Detalle de Ventas (March)
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (90, 43, 2, 10, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (91, 43, 9, 14, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (92, 43, 26, 11, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (93, 44, 17, 12, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (94, 44, 22, 13, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (95, 44, 30, 18, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (96, 45, 9, 13, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (97, 45, 24, 17, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (98, 45, 10, 15, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (99, 46, 10, 14, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (100, 46, 11, 18, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (101, 47, 28, 13, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (102, 47, 15, 17, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (103, 47, 20, 19, NULL);
-- Ventas (April)
INSERT INTO venta (id, fecha, id_cliente, fecha_baja) VALUES (48, '2025-04-05', 10, NULL);
INSERT INTO venta (id, fecha, id_cliente, fecha_baja) VALUES (49, '2025-04-10', 11, NULL);
INSERT INTO venta (id, fecha, id_cliente, fecha_baja) VALUES (50, '2025-04-15', 6, NULL);
INSERT INTO venta (id, fecha, id_cliente, fecha_baja) VALUES (51, '2025-04-20', 5, NULL);
INSERT INTO venta (id, fecha, id_cliente, fecha_baja) VALUES (52, '2025-04-25', 8, NULL);
-- Detalle de Ventas (April)
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (104, 48, 27, 19, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (105, 48, 25, 18, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (106, 49, 16, 19, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (107, 49, 21, 18, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (108, 50, 6, 11, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (109, 50, 30, 18, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (110, 50, 9, 14, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (111, 51, 26, 10, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (112, 51, 12, 17, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (113, 51, 11, 12, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (114, 52, 18, 13, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (115, 52, 12, 12, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (116, 52, 21, 16, NULL);
-- Ventas (May)
INSERT INTO venta (id, fecha, id_cliente, fecha_baja) VALUES (53, '2025-05-05', 5, NULL);
INSERT INTO venta (id, fecha, id_cliente, fecha_baja) VALUES (54, '2025-05-10', 11, NULL);
INSERT INTO venta (id, fecha, id_cliente, fecha_baja) VALUES (55, '2025-05-15', 8, NULL);
INSERT INTO venta (id, fecha, id_cliente, fecha_baja) VALUES (56, '2025-05-20', 9, NULL);
INSERT INTO venta (id, fecha, id_cliente, fecha_baja) VALUES (57, '2025-05-25', 8, NULL);
-- Detalle de Ventas (May)
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (117, 53, 20, 16, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (118, 53, 13, 15, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (119, 54, 12, 13, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (120, 54, 6, 16, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (121, 54, 6, 17, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (122, 55, 2, 10, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (123, 55, 3, 17, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (124, 55, 14, 12, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (125, 56, 11, 16, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (126, 56, 2, 13, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (127, 56, 16, 10, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (128, 57, 6, 12, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (129, 57, 20, 15, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (130, 57, 13, 15, NULL);
-- Ventas (June)
INSERT INTO venta (id, fecha, id_cliente, fecha_baja) VALUES (58, '2025-06-05', 6, NULL);
INSERT INTO venta (id, fecha, id_cliente, fecha_baja) VALUES (59, '2025-06-10', 2, NULL);
INSERT INTO venta (id, fecha, id_cliente, fecha_baja) VALUES (60, '2025-06-15', 2, NULL);
INSERT INTO venta (id, fecha, id_cliente, fecha_baja) VALUES (61, '2025-06-20', 7, NULL);
INSERT INTO venta (id, fecha, id_cliente, fecha_baja) VALUES (62, '2025-06-25', 2, NULL);
-- Detalle de Ventas (June)
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (131, 58, 3, 16, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (132, 58, 23, 17, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (133, 59, 11, 15, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (134, 59, 28, 14, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (135, 59, 17, 15, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (136, 60, 10, 17, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (137, 60, 30, 14, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (138, 61, 6, 19, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (139, 61, 10, 10, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (140, 61, 13, 11, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (141, 62, 12, 16, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (142, 62, 8, 15, NULL);

INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (33, 10, 'venta', 19, '2025-01-05', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (33, 24, 'venta', 19, '2025-01-05', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (34, 28, 'venta', 14, '2025-01-10', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (34, 27, 'venta', 16, '2025-01-10', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (34, 7, 'venta', 13, '2025-01-10', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (35, 9, 'venta', 11, '2025-01-15', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (35, 9, 'venta', 20, '2025-01-15', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (36, 21, 'venta', 14, '2025-01-20', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (36, 5, 'venta', 14, '2025-01-20', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (36, 18, 'venta', 18, '2025-01-20', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (37, 8, 'venta', 13, '2025-01-25', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (37, 18, 'venta', 19, '2025-01-25', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (38, 24, 'venta', 14, '2025-02-05', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (38, 11, 'venta', 19, '2025-02-05', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (39, 6, 'venta', 16, '2025-02-10', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (39, 6, 'venta', 14, '2025-02-10', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (39, 5, 'venta', 17, '2025-02-10', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (40, 28, 'venta', 13, '2025-02-15', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (40, 30, 'venta', 13, '2025-02-15', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (40, 20, 'venta', 17, '2025-02-15', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (41, 4, 'venta', 18, '2025-02-20', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (41, 22, 'venta', 20, '2025-02-20', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (42, 28, 'venta', 12, '2025-02-25', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (42, 12, 'venta', 11, '2025-02-25', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (42, 3, 'venta', 14, '2025-02-25', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (43, 16, 'venta', 12, '2025-03-05', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (43, 10, 'venta', 13, '2025-03-05', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (43, 15, 'venta', 15, '2025-03-05', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (44, 17, 'venta', 19, '2025-03-10', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (44, 4, 'venta', 20, '2025-03-10', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (45, 15, 'venta', 10, '2025-03-15', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (45, 22, 'venta', 19, '2025-03-15', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (45, 1, 'venta', 10, '2025-03-15', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (46, 27, 'venta', 19, '2025-03-20', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (46, 18, 'venta', 10, '2025-03-20', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (46, 21, 'venta', 18, '2025-03-20', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (47, 6, 'venta', 12, '2025-03-25', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (47, 27, 'venta', 14, '2025-03-25', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (47, 13, 'venta', 19, '2025-03-25', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (48, 2, 'venta', 14, '2025-04-05', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (48, 19, 'venta', 10, '2025-04-05', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (48, 1, 'venta', 12, '2025-04-05', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (49, 18, 'venta', 10, '2025-04-10', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (49, 27, 'venta', 12, '2025-04-10', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (49, 1, 'venta', 15, '2025-04-10', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (50, 3, 'venta', 16, '2025-04-15', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (50, 8, 'venta', 15, '2025-04-15', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (51, 29, 'venta', 12, '2025-04-20', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (51, 28, 'venta', 15, '2025-04-20', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (51, 21, 'venta', 15, '2025-04-20', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (52, 15, 'venta', 15, '2025-04-25', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (52, 3, 'venta', 20, '2025-04-25', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (53, 23, 'venta', 17, '2025-05-05', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (53, 20, 'venta', 11, '2025-05-05', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (53, 3, 'venta', 20, '2025-05-05', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (54, 16, 'venta', 11, '2025-05-10', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (54, 1, 'venta', 12, '2025-05-10', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (54, 1, 'venta', 20, '2025-05-10', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (55, 4, 'venta', 12, '2025-05-15', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (55, 13, 'venta', 18, '2025-05-15', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (55, 7, 'venta', 14, '2025-05-15', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (56, 16, 'venta', 10, '2025-05-20', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (56, 26, 'venta', 15, '2025-05-20', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (56, 22, 'venta', 10, '2025-05-20', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (57, 2, 'venta', 10, '2025-05-25', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (57, 19, 'venta', 20, '2025-05-25', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (57, 24, 'venta', 20, '2025-05-25', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (58, 14, 'venta', 12, '2025-06-05', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (58, 28, 'venta', 13, '2025-06-05', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (58, 16, 'venta', 15, '2025-06-05', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (59, 17, 'venta', 16, '2025-06-10', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (59, 9, 'venta', 11, '2025-06-10', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (59, 23, 'venta', 20, '2025-06-10', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (60, 26, 'venta', 20, '2025-06-15', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (60, 3, 'venta', 11, '2025-06-15', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (61, 30, 'venta', 20, '2025-06-20', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (61, 22, 'venta', 11, '2025-06-20', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (62, 11, 'venta', 20, '2025-06-25', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (62, 6, 'venta', 17, '2025-06-25', NULL);

INSERT INTO venta (id, fecha, id_cliente, fecha_baja) VALUES (63, '2025-06-26', 2, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (143, 63, 11, 180, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (144, 63, 6, 170, NULL);
INSERT INTO detalle_venta (id, id_venta, id_producto, cantidad, fecha_baja) VALUES (145, 63, 4, 700, NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (63, 11, 'venta', 180, '2025-06-26', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (63, 6, 'venta', 170, '2025-06-26', NULL);
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, fecha_baja) VALUES (63, 4, 'venta', 700, '2025-06-26', NULL);