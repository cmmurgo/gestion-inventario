const db = require('../config/db');

exports.getAll = () => {
  return db.query(`
    SELECT * FROM promocion WHERE fecha_baja IS NULL
  `);
};

exports.getActivas = () => {
  return db.query(`
    SELECT id, nombre 
    FROM promocion 
    WHERE fecha_baja IS NULL 
      AND CURRENT_DATE >= fecha_inicio
      AND (fecha_fin IS NULL OR CURRENT_DATE <= fecha_fin)
  `);
};

exports.getById = (id) => {
  return db.query(`
    SELECT * FROM promocion WHERE id = $1 AND fecha_baja IS NULL
  `, [id]);
};

exports.create = (data) => {
  const { nombre, condiciones, porcentaje, fecha_inicio, fecha_fin } = data;

  return db.query(`
    INSERT INTO promocion (nombre, condiciones, porcentaje, fecha_inicio, fecha_fin)
    VALUES ($1, $2, $3, $4, $5)
  `, [nombre, condiciones, porcentaje, fecha_inicio, fecha_fin]);
};

exports.update = (id, data) => {
  return db.query(`
    UPDATE promocion SET 
      nombre = $1, condiciones = $2, porcentaje = $3, fecha_inicio = $4, fecha_fin = $5
    WHERE id = $6
  `, [
    data.nombre,
    data.condiciones,
    data.porcentaje,
    data.fecha_inicio,
    data.fecha_fin,
    id
  ]);
};

exports.delete = (id) => {
  return db.query(`
    UPDATE promocion SET fecha_baja = CURRENT_DATE WHERE id = $1
  `, [id]);
};

