import React, { useEffect, useState } from 'react';
import { API_URL } from '../../api';
import { useNavigate } from 'react-router-dom';

function TasaRotacion() {
  const [datos, setDatos] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/';
      return;
    }

    fetch(`${API_URL}/api/inventario/tasa-rotacion`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.tasa_rotacion)) {
          setDatos(data.tasa_rotacion);
        } else {
          setDatos([]);
        }
      })
      .catch(err => console.error("Error al cargar rotación de productos:", err));
  }, []);

  // Función para calcular tasa de rotación (usada en ordenamiento también)
  const calcularRotacion = (p) => {
    return p.stock_promedio_mensual > 0
      ? p.total_ventas_6_meses / p.stock_promedio_mensual
      : null;
  };

  const sortedDatos = React.useMemo(() => {
    if (!sortConfig.key) return datos;

    const sorted = [...datos].sort((a, b) => {
      let aVal, bVal;

      if (sortConfig.key === 'tasa_rotacion') {
        aVal = calcularRotacion(a);
        bVal = calcularRotacion(b);
      } else {
        aVal = a[sortConfig.key];
        bVal = b[sortConfig.key];
      }

      // Si valores son null o undefined, ponerlos al final
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      // Orden numérico si ambos valores son números
      if (!isNaN(parseFloat(aVal)) && !isNaN(parseFloat(bVal))) {
        return parseFloat(aVal) - parseFloat(bVal);
      }
      // Orden alfabético si no
      return aVal?.toString().localeCompare(bVal?.toString());
    });

    if (sortConfig.direction === 'desc') sorted.reverse();
    return sorted;
  }, [datos, sortConfig]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const renderSortArrow = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
  };

  return (
    <div>
      <h2>📊 Reporte de Rotación de Productos</h2>
      <div style={{ maxHeight: '500px', overflowY: 'auto', border: '1px solid #ccc' }}>
        <table border="1" cellPadding="5" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ position: 'sticky', top: 0, backgroundColor: '#e6f0ff', cursor: 'pointer' }}>
            <tr>
              <th onClick={() => handleSort('nombre')}>Producto{renderSortArrow('nombre')}</th>
              <th onClick={() => handleSort('total_ventas_6_meses')} style={{ textAlign: 'right' }}>
                Ventas{renderSortArrow('total_ventas_6_meses')}
              </th>
              <th onClick={() => handleSort('stock_promedio_mensual')} style={{ textAlign: 'right' }}>
                Stock Promedio Mensual{renderSortArrow('stock_promedio_mensual')}
              </th>
              <th onClick={() => handleSort('tasa_rotacion')} style={{ textAlign: 'right' }}>
                Tasa de Rotación{renderSortArrow('tasa_rotacion')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedDatos.length > 0 ? (
              sortedDatos.map(p => {
                const rotacion = p.stock_promedio_mensual > 0
                  ? (p.total_ventas_6_meses / p.stock_promedio_mensual).toFixed(2)
                  : 'N/A';
                return (
                  <tr key={p.producto_id}>
                    <td>{p.nombre}</td>
                    <td style={{ textAlign: 'right' }}>{p.total_ventas_6_meses}</td>
                    <td style={{ textAlign: 'right' }}>{p.stock_promedio_mensual}</td>
                    <td style={{ textAlign: 'right' }}>{rotacion}</td>
                  </tr>
                );
              })
            ) : (
              <tr><td colSpan="4" style={{ textAlign: 'center' }}>No hay datos disponibles</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <p style={{ marginTop: '1rem', fontStyle: 'italic', color: '#555' }}>
        Este reporte calcula la tasa de rotación de productos dividiendo las ventas en los últimos seis meses 
        por el stock promedio mensual. Un valor alto indica que el producto se vende rápidamente y requiere 
        una reposición más frecuente, mientras que un valor bajo puede señalar baja rotación o exceso de stock.
      </p>
      <button className="btn btn-dark" onClick={() => navigate('/inventario')}>Volver</button>
    </div>
  );
}

export default TasaRotacion;
