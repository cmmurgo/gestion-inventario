// backend/src/models/ordenCompraModel.js
const pool = require('../config/db');

exports.findAll = async () => {
  const result = await pool.query(`
    SELECT 
      oc.id,
      oc.fecha,
      oc.estado,
      oc.fecha_baja,
      p.nombre AS proveedor_nombre,
      oc.id_proveedor,
      COALESCE(SUM(doc.cantidad * pr.precio_costo), 0) AS total
    FROM orden_compra oc
    LEFT JOIN proveedor p ON oc.id_proveedor = p.id
    LEFT JOIN detalle_orden_compra doc ON oc.id = doc.id_orden_compra AND doc.fecha_baja IS NULL
    LEFT JOIN producto pr ON doc.id_producto = pr.id
    GROUP BY oc.id, oc.fecha, oc.estado, oc.fecha_baja, p.nombre, oc.id_proveedor
    ORDER BY oc.id DESC
  `);
  return result.rows;
};

exports.findById = async (id) => {
  const result = await pool.query(`
    SELECT 
      oc.id,
      oc.fecha,
      oc.estado,
      oc.id_proveedor,
      p.nombre AS proveedor_nombre,
      COALESCE(SUM(doc.cantidad * pr.precio_costo), 0) AS total
    FROM orden_compra oc
    LEFT JOIN proveedor p ON oc.id_proveedor = p.id
    LEFT JOIN detalle_orden_compra doc ON oc.id = doc.id_orden_compra AND doc.fecha_baja IS NULL
    LEFT JOIN producto pr ON doc.id_producto = pr.id
    WHERE oc.id = $1
    GROUP BY oc.id, oc.fecha, oc.estado, oc.id_proveedor, p.nombre
  `, [id]);
  
  return result.rows[0] || null;
};

exports.create = async ({ fecha, id_proveedor, estado = 'Creada' }) => {
  const result = await pool.query(`
    INSERT INTO orden_compra (fecha, id_proveedor, estado)
    VALUES ($1, $2, $3)
    RETURNING id
  `, [fecha, id_proveedor, estado]);
  
  return { id: result.rows[0].id };
};

exports.update = async (id, { fecha, id_proveedor, estado }) => {
  await pool.query(`
    UPDATE orden_compra 
    SET fecha = $1, id_proveedor = $2, estado = $3
    WHERE id = $4
  `, [fecha, id_proveedor, estado, id]);
};

exports.softDelete = async (id) => {
  await pool.query(`
    UPDATE orden_compra 
    SET fecha_baja = NOW()
    WHERE id = $1
  `, [id]);
};

exports.getById = async (id) => {
  return exports.findById(id);
};

exports.getAll = async () => {
  return exports.findAll();
};