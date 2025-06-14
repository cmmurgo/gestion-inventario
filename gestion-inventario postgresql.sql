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
('Gaseosa Cola 1.5L', 2, 'Botella de 1.5 litros', 100, 180, 15, 1, 7794635020504, NULL, 1), -- Bebidas = 2
('Yogur Natural 1L', 1, 'Yogur sin sabor', 90, 140, 10, 3, 7790000000004, NULL, 2), -- Lácteos = 1
('Pan de Molde', 3, 'Pan blanco en paquete', 80, 120, 20, NULL, 7790000000005, NULL, 3), -- Panificados = 3
('Aceite Girasol 1L', 11, 'Aceite comestible de girasol', 150, 220, 5, NULL, 7790000000006, NULL, 4), -- Aceites = 11
('Galletitas Dulces', 8, 'Galletas de chocolate', 60, 100, 30, 2, 7790000000007, NULL, 5), -- Snacks = 8
('Jugo en Polvo', 2, 'Sabor naranja', 20, 45, 50, 1, 7790000000008, NULL, 5), -- Bebidas = 2
('Café Molido 250g', 2, 'Café tostado molido', 200, 300, 5, NULL, 7790000000009, NULL, 4), -- Bebidas = 2 (proveedor 13)
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

CREATE TABLE detalle_venta (
    id SERIAL PRIMARY KEY,
    id_venta INT,
    id_producto INT,
    cantidad INT,
    fecha_baja DATE,
    CONSTRAINT fk_detalle_venta_venta FOREIGN KEY (id_venta) REFERENCES venta(id),
    CONSTRAINT fk_detalle_venta_producto FOREIGN KEY (id_producto) REFERENCES producto(id)
);

CREATE TABLE perdida (
    id SERIAL PRIMARY KEY,
    id_producto INT,
    fecha DATE,
    motivo VARCHAR(100),
    cantidad INT,
    fecha_baja DATE,
    CONSTRAINT fk_perdida_producto FOREIGN KEY (id_producto) REFERENCES producto(id)
);


CREATE TABLE orden_compra (
    id SERIAL PRIMARY KEY,
    id_proveedor INT,
    fecha DATE,
    estado VARCHAR(50),
    fecha_baja DATE,
    CONSTRAINT fk_orden_proveedor FOREIGN KEY (id_proveedor) REFERENCES proveedor(id)
);



CREATE TABLE detalle_orden_compra (
    id SERIAL PRIMARY KEY,
    id_orden_compra INT,
    id_producto INT,
    cantidad INT,
    fecha_baja DATE,
    CONSTRAINT fk_detalle_oc_oc FOREIGN KEY (id_orden_compra) REFERENCES orden_compra(id),
    CONSTRAINT fk_detalle_oc_producto FOREIGN KEY (id_producto) REFERENCES producto(id)
);


CREATE TABLE movimientos (
    id SERIAL PRIMARY KEY,
    id_operacion INT,
    id_producto INT,
    tipo VARCHAR(50),
    cantidad INT,
    fecha DATE,
    fecha_baja DATE,
    monto INT,
    CONSTRAINT fk_movimiento_producto FOREIGN KEY (id_producto) REFERENCES producto(id)
);

-- Enero 2025
INSERT INTO venta (fecha, id_cliente) VALUES
('2025-01-03', 2), ('2025-01-05', 3), ('2025-01-07', 4), ('2025-01-10', 5), ('2025-01-12', 6),
('2025-01-15', 7), ('2025-01-17', 8), ('2025-01-20', 9), ('2025-01-22', 10), ('2025-01-25', 11);

-- Febrero 2025
INSERT INTO venta (fecha, id_cliente) VALUES
('2025-02-02', 3), ('2025-02-05', 4), ('2025-02-08', 5), ('2025-02-11', 6), ('2025-02-14', 7),
('2025-02-17', 8), ('2025-02-20', 9), ('2025-02-23', 10), ('2025-02-26', 11), ('2025-02-28', 2);

-- Marzo 2025
INSERT INTO venta (fecha, id_cliente) VALUES
('2025-03-01', 4), ('2025-03-04', 5), ('2025-03-07', 6), ('2025-03-10', 7), ('2025-03-13', 8),
('2025-03-16', 9), ('2025-03-19', 10), ('2025-03-22', 11), ('2025-03-25', 2), ('2025-03-28', 3);

-- Abril 2025
INSERT INTO venta (fecha, id_cliente) VALUES
('2025-04-02', 5), ('2025-04-05', 6), ('2025-04-08', 7), ('2025-04-11', 8), ('2025-04-14', 9),
('2025-04-17', 10), ('2025-04-20', 11), ('2025-04-23', 2), ('2025-04-26', 3), ('2025-04-29', 4);

-- Mayo 2025
INSERT INTO venta (fecha, id_cliente) VALUES
('2025-05-03', 6), ('2025-05-06', 7), ('2025-05-09', 8), ('2025-05-12', 9), ('2025-05-15', 10),
('2025-05-18', 11), ('2025-05-21', 2), ('2025-05-24', 3), ('2025-05-27', 4), ('2025-05-30', 5);

-- Junio 2025
INSERT INTO venta (fecha, id_cliente) VALUES
('2025-06-01', 7), ('2025-06-04', 8), ('2025-06-07', 9), ('2025-06-10', 10), ('2025-06-13', 11),
('2025-06-16', 2), ('2025-06-19', 3), ('2025-06-22', 4), ('2025-06-25', 5), ('2025-06-28', 6);

-- A partir de aquí supongamos que las IDs de ventas van desde 1 a 60 (10 por mes * 6 meses)

-- Detalles de venta (productos y cantidades aleatorias)

INSERT INTO detalle_venta (id_venta, id_producto, cantidad) VALUES
(1, 1, 2), (1, 5, 1),
(2, 3, 1), (3, 2, 3),
(4, 6, 2), (5, 7, 1),
(6, 8, 4), (7, 4, 1),
(8, 9, 2), (9, 10, 1),
(10, 11, 2),

(11, 2, 2), (12, 5, 3),
(13, 1, 1), (14, 3, 2),
(15, 6, 1), (16, 7, 3),
(17, 8, 2), (18, 4, 1),
(19, 9, 1), (20, 10, 4),

(21, 11, 2), (22, 2, 1),
(23, 1, 3), (24, 5, 2),
(25, 3, 1), (26, 6, 4),
(27, 7, 2), (28, 8, 3),
(29, 4, 1), (30, 9, 2),

(31, 10, 1), (32, 11, 3),
(33, 2, 1), (34, 1, 2),
(35, 5, 1), (36, 3, 3),
(37, 6, 2), (38, 7, 1),
(39, 8, 4), (40, 4, 1),

(41, 9, 2), (42, 10, 1),
(43, 11, 3), (44, 2, 2),
(45, 1, 1), (46, 5, 3),
(47, 3, 2), (48, 6, 1),
(49, 7, 4), (50, 8, 1),

(51, 4, 3), (52, 9, 1),
(53, 10, 2), (54, 11, 1),
(55, 2, 4), (56, 1, 2),
(57, 5, 3), (58, 3, 1),
(59, 6, 2), (60, 7, 1);

-- Ahora las órdenes de compra y sus detalles (10 por mes, enero-junio)

-- Enero 2025
INSERT INTO orden_compra (id_proveedor, fecha, estado) VALUES
(1, '2025-01-04', 'recibido'), (2, '2025-01-06', 'recibido'), (3, '2025-01-09', 'recibido'),
(4, '2025-01-11', 'recibido'), (5, '2025-01-13', 'recibido'), (6, '2025-01-16', 'recibido'),
(7, '2025-01-18', 'recibido'), (8, '2025-01-21', 'recibido'), (9, '2025-01-23', 'recibido'), (10, '2025-01-26', 'recibido');

-- Febrero 2025
INSERT INTO orden_compra (id_proveedor, fecha, estado) VALUES
(2, '2025-02-03', 'recibido'), (3, '2025-02-06', 'recibido'), (4, '2025-02-09', 'recibido'),
(5, '2025-02-12', 'recibido'), (6, '2025-02-15', 'recibido'), (7, '2025-02-18', 'recibido'),
(8, '2025-02-21', 'recibido'), (9, '2025-02-24', 'recibido'), (10, '2025-02-27', 'recibido'), (1, '2025-02-28', 'recibido');

-- Marzo 2025
INSERT INTO orden_compra (id_proveedor, fecha, estado) VALUES
(3, '2025-03-02', 'recibido'), (4, '2025-03-05', 'recibido'), (5, '2025-03-08', 'recibido'),
(6, '2025-03-11', 'recibido'), (7, '2025-03-14', 'recibido'), (8, '2025-03-17', 'recibido'),
(9, '2025-03-20', 'recibido'), (10, '2025-03-23', 'recibido'), (1, '2025-03-26', 'recibido'), (2, '2025-03-29', 'recibido');

-- Abril 2025
INSERT INTO orden_compra (id_proveedor, fecha, estado) VALUES
(4, '2025-04-03', 'recibido'), (5, '2025-04-06', 'recibido'), (6, '2025-04-09', 'recibido'),
(7, '2025-04-12', 'recibido'), (8, '2025-04-15', 'recibido'), (9, '2025-04-18', 'recibido'),
(10, '2025-04-21', 'recibido'), (1, '2025-04-24', 'recibido'), (2, '2025-04-27', 'recibido'), (3, '2025-04-30', 'recibido');

-- Mayo 2025
INSERT INTO orden_compra (id_proveedor, fecha, estado) VALUES
(5, '2025-05-04', 'recibido'), (6, '2025-05-07', 'recibido'), (7, '2025-05-10', 'recibido'),
(8, '2025-05-13', 'recibido'), (9, '2025-05-16', 'recibido'), (10, '2025-05-19', 'recibido'),
(1, '2025-05-22', 'recibido'), (2, '2025-05-25', 'recibido'), (3, '2025-05-28', 'recibido'), (4, '2025-05-31', 'recibido');

-- Junio 2025
INSERT INTO orden_compra (id_proveedor, fecha, estado) VALUES
(6, '2025-06-02', 'recibido'), (7, '2025-06-05', 'recibido'), (8, '2025-06-08', 'recibido'),
(9, '2025-06-11', 'recibido'), (10, '2025-06-14', 'recibido'), (1, '2025-06-17', 'recibido'),
(2, '2025-06-20', 'recibido'), (3, '2025-06-23', 'recibido'), (4, '2025-06-26', 'recibido'), (5, '2025-06-29', 'recibido');

-- Asumimos IDs de orden_compra desde 1 a 60

-- Detalles orden compra (productos y cantidades)
INSERT INTO detalle_orden_compra (id_orden_compra, id_producto, cantidad) VALUES
(1, 1, 10), (2, 2, 15), (3, 3, 20), (4, 4, 12), (5, 5, 18),
(6, 6, 25), (7, 7, 10), (8, 8, 15), (9, 9, 20), (10, 10, 12),

(11, 11, 18), (12, 1, 20), (13, 2, 10), (14, 3, 15), (15, 4, 25),
(16, 5, 10), (17, 6, 12), (18, 7, 20), (19, 8, 15), (20, 9, 10),

(21, 10, 20), (22, 11, 10), (23, 1, 15), (24, 2, 18), (25, 3, 12),
(26, 4, 15), (27, 5, 20), (28, 6, 10), (29, 7, 15), (30, 8, 20),

(31, 9, 12), (32, 10, 15), (33, 11, 18), (34, 1, 10), (35, 2, 20),
(36, 3, 25), (37, 4, 18), (38, 5, 10), (39, 6, 15), (40, 7, 12),

(41, 8, 20), (42, 9, 25), (43, 10, 18), (44, 11, 20), (45, 1, 12),
(46, 2, 10), (47, 3, 15), (48, 4, 20), (49, 5, 18), (50, 6, 25),

(51, 7, 15), (52, 8, 10), (53, 9, 20), (54, 10, 15), (55, 11, 12),
(56, 1, 20), (57, 2, 18), (58, 3, 15), (59, 4, 10), (60, 5, 12);

-- Finalmente, insertamos movimientos asociados (venta = venta, compra = compra)

-- Para ventas (id_operacion = id_venta, tipo = 'venta')
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, monto) VALUES
(1, 1, 'venta', -2, '2025-01-03', -2*180),
(1, 5, 'venta', -1, '2025-01-03', -1*100),

(2, 3, 'venta', -1, '2025-01-05', -1*120),
(3, 2, 'venta', -3, '2025-01-07', -3*140),

(4, 6, 'venta', -2, '2025-01-10', -2*45),
(5, 7, 'venta', -1, '2025-01-12', -1*300),

(6, 8, 'venta', -4, '2025-01-15', 4*110),
(7, 4, 'venta', -1, '2025-01-17', 1*220),

(8, 9, 'venta', -2, '2025-01-20', -2*100),
(9, 10, 'venta', -1, '2025-01-22', -1*35),

(10, 11, 'venta', -2, '2025-01-25', -2*90);

-- (Solo ejemplo, si quieres puedo generar todo completo igual)

-- Para compras (id_operacion = id_orden_compra, tipo = 'compra')
INSERT INTO movimientos (id_operacion, id_producto, tipo, cantidad, fecha, monto) VALUES
(1, 1, 'compra', 10, '2025-01-04', 10*100),
(2, 2, 'compra', 15, '2025-01-06', 15*90),
(3, 3, 'compra', 20, '2025-01-09', 20*80),
(4, 4, 'compra', 12, '2025-01-11', 12*150),
(5, 5, 'compra', 18, '2025-01-13', 18*60),
(6, 6, 'compra', 25, '2025-01-16', 25*20),
(7, 7, 'compra', 10, '2025-01-18', 10*200),
(8, 8, 'compra', 15, '2025-01-21', 15*70),
(9, 9, 'compra', 20, '2025-01-23', 20*60),
(10, 10, 'compra', 12, '2025-01-26', 12*20);
