const db = require('../config/db');

exports.getAll = () => {
  return db.query(`
    SELECT r.*, 
      EXISTS (
        SELECT 1 FROM producto p 
        WHERE p.id_rubro = r.id AND p.fecha_baja IS NULL
      ) AS tiene_productos
    FROM rubro r
    ORDER BY nombre
  `);
};

exports.getById = (id) => {
  return db.query('SELECT * FROM rubro WHERE id = $1', [id]);
};

exports.create = (data) => {
  const { nombre } = data;
  return db.query('INSERT INTO rubro (nombre) VALUES ($1)', [nombre]);
};

exports.update = (id, data) => {
  return db.query('UPDATE rubro SET nombre = $1 WHERE id = $2', [data.nombre, id]);
};

exports.tieneProductos = async (id) => {
  const { rows } = await db.query(`
    SELECT 1 FROM producto WHERE id_rubro = $1 AND fecha_baja IS NULL LIMIT 1
  `, [id]);
  return rows.length > 0;
};

exports.delete = (id) => {
  return db.query('DELETE FROM rubro WHERE id = $1', [id]);
};
