// backend/src/models/detalleOrdenCompraModel.js
const pool = require('../config/db');

exports.getByOrdenCompraId = async (id_orden_compra, client = pool) => {
  const result = await client.query(
    `SELECT
        doc.id,
        doc.id_orden_compra,
        doc.id_producto,
        pr.nombre AS producto_nombre,
        doc.cantidad,
        pr.precio_costo as precio_unitario_costo,
        (doc.cantidad * pr.precio_costo) as total
      FROM detalle_orden_compra doc
      INNER JOIN producto pr ON pr.id = doc.id_producto
      WHERE doc.id_orden_compra = $1 AND doc.fecha_baja IS NULL`,
    [id_orden_compra]
  );
  return result.rows;
};

exports.create = async ({ id_orden_compra, id_producto, cantidad }, client = pool) => {
  await client.query(
    `INSERT INTO detalle_orden_compra (id_orden_compra, id_producto, cantidad)
     VALUES ($1, $2, $3)`,
    [id_orden_compra, id_producto, cantidad]
  );
};

exports.softDeleteByOrdenCompraId = async (id_orden_compra, client = pool) => {
  await client.query(
    `UPDATE detalle_orden_compra
     SET fecha_baja = NOW()
     WHERE id_orden_compra = $1 AND fecha_baja IS NULL`,
    [id_orden_compra]
  );
};

exports.update = async (id, { cantidad }, client = pool) => {
    await client.query(
        `UPDATE detalle_orden_compra SET cantidad = $1 WHERE id = $2`,
        [cantidad, id]
    );
};