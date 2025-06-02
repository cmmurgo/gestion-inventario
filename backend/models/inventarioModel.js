const pool = require('../config/db'); 

exports.buscarProductoPorCodigo = async (codigo) => {
  const result = await pool.query(
    'SELECT * FROM producto WHERE codigo_barra = $1 AND fecha_baja IS NULL',
    [codigo]
  );
  return result.rows[0];
};

exports.getAllProductos = async () => {
  const result = await pool.query(
    'SELECT id, nombre, categoria, descripcion,precio_costo, precio_venta, stock_minimo FROM producto WHERE fecha_baja IS NULL ORDER BY id'
  );
  return result.rows;
};

exports.buscarProductoPorId = async (id) => {
  const result = await pool.query(
    'SELECT * FROM producto WHERE id = $1 AND fecha_baja IS NULL',
    [id]
  );
  return result.rows[0];
};

exports.totalVentas = async () => {
  const result = await pool.query(
    `Select count(id) AS total from venta
      WHERE fecha_baja IS NULL and fecha >= date_trunc('month', CURRENT_DATE)`  
  );
  return result.rows[0].total;
};

exports.totalIngresos = async () => {
  const result = await pool.query(
    `Select sum(dv.cantidad*(p.precio_venta-p.precio_costo)) AS total from detalle_venta dv
      INNER JOIN producto p ON p.id = dv.id_producto
      INNER JOIN venta v ON v.id = dv.id_venta
      WHERE dv.fecha_baja IS NULL 
      and v.fecha >= date_trunc('month', CURRENT_DATE)`  
  );
  return result.rows[0].total;
};

exports.totalGastos = async () => {
  const result = await pool.query(
    `Select sum(doc.cantidad*(p.precio_costo)+pe.cantidad*(p.precio_costo)) AS total from detalle_orden_compra doc
      INNER JOIN producto p ON p.id = doc.id_producto
      INNER JOIN orden_compra oc ON oc.id = doc.id_orden_compra
      INNER JOIN perdida pe ON p.id = pe.id_producto
      WHERE doc.fecha_baja IS NULL 
      and pe.fecha_baja IS NULL
      and oc.fecha >= date_trunc('month', CURRENT_DATE)`  
  );
  return result.rows[0].total;
};

exports.totalCompras = async () => {
  const result = await pool.query(
    `Select count(id) AS total from orden_compra
      WHERE fecha_baja IS NULL and fecha >= date_trunc('month', CURRENT_DATE)`  
  );
  return result.rows[0].total;
};

exports.totalPerdidas = async () => {
  const result = await pool.query(
    `Select count(id) AS total from perdida
      WHERE fecha_baja IS NULL and fecha >= date_trunc('month', CURRENT_DATE)`  
  );
  return result.rows[0].total;
};

exports.movimientosPorMes = async () => {
  const query = `
    SELECT
              TO_CHAR(m.fecha, 'YYYY-MM') AS mes_anio,
              SUM(CASE 
                      WHEN m.tipo = 'compra' THEN m.cantidad * p.precio_costo 
                      ELSE 0 
                  END) AS monto_compras,
              SUM(CASE 
                      WHEN m.tipo = 'venta' THEN m.cantidad * p.precio_venta 
                      ELSE 0 
                  END) * (-1) AS monto_ventas,
              SUM(CASE 
                      WHEN m.tipo = 'perdida' THEN m.cantidad * p.precio_costo 
                      ELSE 0 
                  END) * (-1) AS monto_perdidas
          FROM movimientos m
          INNER JOIN producto p ON m.id_producto = p.id
          WHERE
              m.fecha_baja IS NULL
              AND p.fecha_baja IS NULL
              AND EXTRACT(YEAR FROM m.fecha) = EXTRACT(YEAR FROM CURRENT_DATE)
          GROUP BY TO_CHAR(m.fecha, 'YYYY-MM')
          ORDER BY mes_anio;
            `;
  
  try {
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error('Error al consultar movimientos por mes:', error);
    throw error;
  }
};
