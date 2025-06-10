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
    `SELECT p.id, p.nombre, r.nombre as categoria, p.descripcion, p.precio_costo, p.precio_venta, p.stock_minimo 
    FROM producto p
    INNER JOIN rubro r on r.id=p.id_rubro
    WHERE p.fecha_baja IS NULL ORDER BY id`
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

exports.stockBajos = async () => {
  const query = 
  ` SELECT
    p.nombre,
    r.nombre AS rubro,
    p.descripcion,
    p.stock_minimo,
     COALESCE(SUM(CASE 
        WHEN m.tipo = 'compra' THEN m.cantidad
        WHEN m.tipo IN ('venta', 'perdida') THEN m.cantidad
        ELSE 0 
    END), 0) AS stock_actual,
    ROUND(p.stock_minimo * 1.2, 2) AS umbral_stock_bajo
    FROM producto p
    LEFT JOIN movimientos m ON m.id_producto = p.id AND m.fecha_baja IS NULL
    INNER JOIN rubro r ON r.id = p.id_rubro
    WHERE p.fecha_baja IS NULL
    GROUP BY p.id, p.nombre, r.nombre, p.descripcion, p.stock_minimo
    HAVING COALESCE(SUM(CASE 
          WHEN m.tipo = 'compra' THEN m.cantidad
          WHEN m.tipo IN ('venta', 'perdida') THEN m.cantidad
         ELSE 0 
    END), 0) <= p.stock_minimo * 1.2;

            `;
  
  try {
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error('Error al consultar stock bajos:', error);
    throw error;
  }
};


exports.tasaRotacion = async () => {
  const query = `
    WITH stock_por_mes AS (
      SELECT 
        m.id_producto,
        DATE_TRUNC('month', m.fecha) AS mes,
        SUM(
          CASE 
            WHEN m.tipo ILIKE 'compra' THEN m.cantidad
            WHEN m.tipo ILIKE 'venta' THEN -m.cantidad
			      WHEN m.tipo ILIKE 'perdida' THEN -m.cantidad
            ELSE 0
          END
        ) AS saldo_mes
      FROM movimientos m
      WHERE 
        m.fecha_baja IS NULL
        AND m.fecha >= CURRENT_DATE - INTERVAL '6 months'
      GROUP BY m.id_producto, DATE_TRUNC('month', m.fecha)
    ),
    stock_promedio_mensual AS (
      SELECT 
        id_producto,
        ROUND(AVG(saldo_mes)::numeric, 2) AS stock_promedio_mensual
      FROM stock_por_mes
      GROUP BY id_producto
    )

    SELECT 
      p.id AS producto_id,
      p.nombre,
      COALESCE(SUM(dv.cantidad), 0) AS total_ventas_6_meses,
      spm.stock_promedio_mensual,
      CASE 
        WHEN spm.stock_promedio_mensual > 0 THEN 
          ROUND(SUM(dv.cantidad)::numeric / spm.stock_promedio_mensual, 2)
        ELSE NULL
      END AS tasa_rotacion_6_meses

    FROM producto p

    LEFT JOIN detalle_venta dv ON dv.id_producto = p.id AND dv.fecha_baja IS NULL
    LEFT JOIN venta v ON v.id = dv.id_venta 
      AND v.fecha_baja IS NULL
      AND v.fecha >= CURRENT_DATE - INTERVAL '6 months'

    LEFT JOIN stock_promedio_mensual spm ON spm.id_producto = p.id
    WHERE p.fecha_baja IS NULL
    GROUP BY p.id, p.nombre, spm.stock_promedio_mensual
    ORDER BY tasa_rotacion_6_meses DESC NULLS LAST;  `;
  
  try {
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error('Error al consultar tasa rotacion:', error);
    throw error;
  }
};

exports.productosMayorIngreso = async () => {
  const query = `
    SELECT
        p.id AS producto_id,
        p.nombre,
        p.precio_venta,
        SUM(vd.cantidad) AS total_ventas_6_meses,
        SUM(vd.cantidad * p.precio_venta) AS ingreso_total
      FROM producto p
      JOIN detalle_venta vd ON vd.id_producto = p.id
      JOIN venta v ON v.id = vd.id_venta
      WHERE v.fecha >= CURRENT_DATE - INTERVAL '6 months'
      GROUP BY p.id, p.nombre, p.precio_venta
      ORDER BY ingreso_total DESC;
  `;
  
  try {
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error('Error al consultar productos mayor ingreso:', error);
    throw error;
  }
};

exports.productosMenosVendidos = async () => {
  const query = `
    SELECT
        p.id AS producto_id,
        p.nombre,
        p.precio_venta,
        COALESCE(SUM(vd.cantidad), 0) AS total_ventas_6_meses,
        COALESCE(SUM(vd.cantidad * p.precio_venta), 0) AS ingreso_total
      FROM producto p
      LEFT JOIN detalle_venta vd ON vd.id_producto = p.id
      LEFT JOIN venta v ON v.id = vd.id_venta AND v.fecha >= CURRENT_DATE - INTERVAL '6 months'
      GROUP BY p.id, p.nombre, p.precio_venta
      HAVING COALESCE(SUM(vd.cantidad), 0) <= 5 -- o 0 para sin ventas
      ORDER BY total_ventas_6_meses ASC, ingreso_total ASC;
  `;
  
  try {
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error('Error al consultar productos menos vendidos:', error);
    throw error;
  }
};

