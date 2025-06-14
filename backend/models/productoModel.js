const db = require('../config/db');

exports.getAll = () => {
  return db.query(`
    SELECT producto.*, 
           rubro.nombre AS rubro_nombre,
           proveedor.nombre AS proveedor_nombre
    FROM producto
    LEFT JOIN rubro ON producto.id_rubro = rubro.id
    LEFT JOIN proveedor ON producto.id_proveedor = proveedor.id
    WHERE producto.fecha_baja IS NULL
  `);
};

exports.getById = (id) => {
  return db.query(`
    SELECT * FROM producto WHERE id = $1 AND fecha_baja IS NULL
  `, [id]);
};

exports.create = (data) => {
  const {
    nombre,
    id_rubro,
    descripcion,
    precio_costo,
    precio_venta,
    stock_minimo,
    id_promocion,
    codigo_barra,
    id_proveedor
  } = data;

  return db.query(`
    INSERT INTO producto 
    (nombre, id_rubro, descripcion, precio_costo, precio_venta, stock_minimo, id_promocion, codigo_barra, id_proveedor)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
  `, [nombre, id_rubro, descripcion, precio_costo, precio_venta, stock_minimo, id_promocion, codigo_barra, id_proveedor]);
};

exports.update = (id, data) => {
  const {
    nombre,
    id_rubro,
    descripcion,
    precio_costo,
    precio_venta,
    stock_minimo,
    id_promocion,
    codigo_barra,
    id_proveedor
  } = data;

  return db.query(`
    UPDATE producto SET
      nombre = $1,
      id_rubro = $2,
      descripcion = $3,
      precio_costo = $4,
      precio_venta = $5,
      stock_minimo = $6,
      id_promocion = $7,
      codigo_barra = $8,
      id_proveedor = $9
    WHERE id = $10
  `, [nombre, id_rubro, descripcion, precio_costo, precio_venta, stock_minimo, id_promocion, codigo_barra, id_proveedor, id]);
};

exports.delete = (id) => {
  return db.query(`
    UPDATE producto SET fecha_baja = CURRENT_DATE WHERE id = $1
  `, [id]);
};
