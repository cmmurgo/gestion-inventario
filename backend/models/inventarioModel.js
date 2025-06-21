const pool = require('../config/db'); 

exports.buscarProductoPorCodigo = async (codigo) => {
  const result = await pool.query(
    `SELECT p.id, p.nombre as nombre, r.nombre as categoria, 
       p.descripcion as descripcion, p.precio_costo as precio_costo, 
       p.precio_venta as precio_venta, p.stock_minimo,   
       pr.nombre as promocion_nombre, 
       pr.condiciones as promocion_condiciones,  
       CASE 
          WHEN pr.id IS NOT NULL 
              AND CURRENT_DATE BETWEEN pr.fecha_inicio AND pr.fecha_fin 
              AND pr.fecha_baja IS NULL
          THEN pr.porcentaje
          ELSE 0
        END as porcentaje, 
        CASE 
          WHEN pr.id IS NOT NULL 
              AND CURRENT_DATE BETWEEN pr.fecha_inicio AND pr.fecha_fin 
              AND pr.fecha_baja IS NULL
            THEN 'Activa'
          ELSE 'Inactiva'
        END as estado_promocion
       FROM producto p
    INNER JOIN rubro r on r.id=p.id_rubro
    LEFT JOIN promocion pr on pr.id=p.id_promocion
    WHERE codigo_barra = $1 
    AND p.fecha_baja IS NULL
    AND pr.fecha_baja IS NULL`,
    [codigo]
  );
  return result.rows[0];
};

exports.getAllProductos = async () => {
  const result = await pool.query(
    `SELECT p.id, p.nombre, r.nombre as categoria, p.descripcion, p.precio_costo, p.precio_venta, p.stock_minimo,   
       pr.nombre as promocion_nombre, 
       pr.condiciones as promocion_condiciones,  
       CASE 
          WHEN pr.id IS NOT NULL 
              AND CURRENT_DATE BETWEEN pr.fecha_inicio AND pr.fecha_fin 
              AND pr.fecha_baja IS NULL
          THEN pr.porcentaje
          ELSE 0
        END as porcentaje,
        CASE 
          WHEN pr.id IS NOT NULL 
              AND CURRENT_DATE BETWEEN pr.fecha_inicio AND pr.fecha_fin 
              AND pr.fecha_baja IS NULL
            THEN 'Activa'
          ELSE 'Inactiva'
        END as estado_promocion
    FROM producto p
    INNER JOIN rubro r on r.id=p.id_rubro
    LEFT JOIN promocion pr on pr.id=p.id_promocion
    WHERE p.fecha_baja IS NULL
    AND pr.fecha_baja IS NULL
    ORDER BY p.id`
  );
  return result.rows;
};

exports.buscarProductoPorId = async (id) => {
  const result = await pool.query(
    `SELECT p.id, p.nombre, r.nombre as categoria, p.descripcion, p.precio_costo, p.precio_venta, p.stock_minimo,   
       pr.nombre as promocion_nombre, 
       pr.condiciones as promocion_condiciones,  
       CASE 
          WHEN pr.id IS NOT NULL 
              AND CURRENT_DATE BETWEEN pr.fecha_inicio AND pr.fecha_fin 
              AND pr.fecha_baja IS NULL
          THEN pr.porcentaje
          ELSE 0
        END as porcentaje,
        CASE 
          WHEN pr.id IS NOT NULL 
              AND CURRENT_DATE BETWEEN pr.fecha_inicio AND pr.fecha_fin 
              AND pr.fecha_baja IS NULL
            THEN 'Activa'
          ELSE 'Inactiva'
        END as estado_promocion
       FROM producto p
     INNER JOIN rubro r on r.id=p.id_rubro
     LEFT JOIN promocion pr on pr.id=p.id_promocion
     WHERE p.id = $1 
     AND p.fecha_baja IS NULL
     AND pr.fecha_baja IS NULL`,
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
    `SELECT SUM(
        CASE 
          WHEN tipo = 'venta' THEN -monto
          WHEN tipo IN ('compra', 'perdida') THEN monto
          ELSE 0
        END
      ) AS total
     FROM movimientos
     WHERE fecha_baja IS NULL
       AND fecha >= date_trunc('month', CURRENT_DATE)`
  );

  return result.rows[0].total;
};

exports.totalGastos = async () => {
  const result = await pool.query(
    `SELECT SUM(monto) AS total
     FROM movimientos
     WHERE fecha_baja IS NULL
       AND tipo IN ('compra', 'perdida')
       AND fecha >= date_trunc('month', CURRENT_DATE)`
  );

  return result.rows[0].total;
};

exports.totalCompras = async () => {
  const result = await pool.query(
    `SELECT COUNT(*) AS total
     FROM movimientos
     WHERE fecha_baja IS NULL
       AND tipo = 'compra'
       AND fecha >= date_trunc('month', CURRENT_DATE)`
  );
  return result.rows[0].total;
};


exports.totalPerdidas = async () => {
  const result = await pool.query(
    `SELECT COUNT(*) AS total
     FROM movimientos
     WHERE fecha_baja IS NULL
       AND tipo = 'perdida'
       AND fecha >= date_trunc('month', CURRENT_DATE)`
  );
  return result.rows[0].total;
};

exports.movimientosPorMes = async () => {
  const query = `
    SELECT
        TO_CHAR(m.fecha, 'YYYY-MM') AS mes_anio,
        SUM(CASE WHEN m.tipo = 'compra' THEN m.monto ELSE 0 END) AS monto_compras,
        SUM(CASE WHEN m.tipo = 'venta' THEN m.monto * (-1) ELSE 0 END) AS monto_ventas,
        SUM(CASE WHEN m.tipo = 'perdida' THEN m.monto * (-1) ELSE 0 END) AS monto_perdidas
      FROM movimientos m
      WHERE
        m.fecha_baja IS NULL
        AND m.fecha >= (CURRENT_DATE - INTERVAL '12 months')
        AND m.fecha < (DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month')
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
  ` WITH stock_calculado AS (
  SELECT
    p.id,
    p.nombre,
    r.nombre AS rubro,
    p.descripcion,
    p.stock_minimo,
    COALESCE(SUM(CASE 
        WHEN m.tipo = 'compra' THEN m.cantidad
        WHEN m.tipo IN ('venta', 'perdida') THEN -m.cantidad
        ELSE 0 
    END), 0) AS stock_actual
  FROM producto p
  LEFT JOIN movimientos m ON m.id_producto = p.id AND m.fecha_baja IS NULL
  INNER JOIN rubro r ON r.id = p.id_rubro
  WHERE p.fecha_baja IS NULL
  GROUP BY p.id, p.nombre, r.nombre, p.descripcion, p.stock_minimo
)

SELECT *,
       ROUND(stock_minimo * 1.2, 2) AS umbral_stock_bajo
FROM stock_calculado
WHERE stock_actual <= stock_minimo * 1.2;

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
            WHEN m.tipo = 'compra' THEN m.cantidad
            WHEN m.tipo IN ('venta', 'perdida') THEN -m.cantidad
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
    ),
    ventas_6_meses AS (
      SELECT 
        id_producto,
        SUM(cantidad) AS total_ventas
      FROM movimientos
      WHERE 
        tipo = 'venta' 
        AND fecha_baja IS NULL
        AND fecha >= CURRENT_DATE - INTERVAL '6 months'
      GROUP BY id_producto
    )
    SELECT 
      p.id AS producto_id,
      p.nombre,
      COALESCE(v.total_ventas, 0) AS total_ventas_6_meses,
      spm.stock_promedio_mensual,
      CASE 
        WHEN spm.stock_promedio_mensual > 0 THEN 
          ROUND(COALESCE(v.total_ventas, 0)::numeric / spm.stock_promedio_mensual, 2)
        ELSE NULL
      END AS tasa_rotacion_6_meses
    FROM producto p
    LEFT JOIN ventas_6_meses v ON v.id_producto = p.id
    LEFT JOIN stock_promedio_mensual spm ON spm.id_producto = p.id
    WHERE p.fecha_baja IS NULL
    ORDER BY tasa_rotacion_6_meses DESC NULLS LAST;
  `;

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
      COALESCE(SUM(-m.cantidad), 0) AS total_ventas_6_meses,
      COALESCE(SUM(-m.monto), 0) AS ingreso_total
    FROM producto p
    LEFT JOIN movimientos m ON m.id_producto = p.id
      AND m.tipo = 'venta'
      AND m.fecha_baja IS NULL
      AND m.fecha >= CURRENT_DATE - INTERVAL '6 months'
    WHERE p.fecha_baja IS NULL
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
      COALESCE(SUM(-m.cantidad), 0) AS total_ventas_6_meses,
      COALESCE(SUM(-m.monto), 0) AS ingreso_total
    FROM producto p
    LEFT JOIN movimientos m ON m.id_producto = p.id
      AND m.tipo = 'venta'
      AND m.fecha_baja IS NULL
      AND m.fecha >= CURRENT_DATE - INTERVAL '6 months'
    WHERE p.fecha_baja IS NULL
    GROUP BY p.id, p.nombre, p.precio_venta
    HAVING COALESCE(SUM(-m.cantidad), 0) <= 10
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
exports.stockProducto = async () => {
  const query = `
    SELECT
      p.nombre,
      r.nombre AS rubro,
      p.descripcion,
      p.stock_minimo,
      COALESCE(SUM(
        CASE 
          WHEN m.tipo = 'compra' THEN m.cantidad
          WHEN m.tipo IN ('venta', 'perdida') THEN -m.cantidad
          ELSE 0 
        END
      ), 0) AS stock_actual
    FROM producto p
    LEFT JOIN movimientos m ON m.id_producto = p.id AND m.fecha_baja IS NULL
    INNER JOIN rubro r ON r.id = p.id_rubro
    WHERE p.fecha_baja IS NULL
    GROUP BY p.id, p.nombre, r.nombre, p.descripcion, p.stock_minimo
    ORDER BY p.nombre;
  `;

  try {
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error('Error al consultar stock:', error);
    throw error;
  }
};


