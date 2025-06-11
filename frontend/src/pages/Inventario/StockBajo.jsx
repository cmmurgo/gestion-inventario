import React, { useEffect, useState } from 'react';
import { API_URL } from '../../api';
import { useNavigate } from 'react-router-dom';

function StockBajo() {
  const [productos, setProductos] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/'; // redirige si no hay token
      return;
    }

    fetch(`${API_URL}/api/inventario/stock-bajos`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setProductos(data.stock_bajos || []);
      })
      .catch(err => console.error("Error al cargar productos:", err));
  }, []);

  // Ordenar productos según sortConfig
  const sortedProductos = React.useMemo(() => {
    if (!sortConfig.key) return productos;

    const sorted = [...productos].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      // Para números
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return aVal - bVal;
      }
      // Para strings (por si acaso)
      return aVal?.toString().localeCompare(bVal?.toString());
    });

    if (sortConfig.direction === 'desc') sorted.reverse();
    return sorted;
  }, [productos, sortConfig]);

  // Maneja click en encabezado para ordenar
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Mostrar flechas de orden
  const renderSortArrow = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
  };

  return (
    <div>
      <h2>🛑 Productos con stock bajo</h2>

      <div style={{ maxHeight: '500px', overflowY: 'auto', border: '1px solid #ccc' }}>
        <table border="1" cellPadding="3" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f2f2f2', cursor: 'pointer' }}>
            <tr>
              <th onClick={() => handleSort('nombre')}>Nombre{renderSortArrow('nombre')}</th>
              <th onClick={() => handleSort('categoria')}>Categoría{renderSortArrow('categoria')}</th>
              <th onClick={() => handleSort('descripcion')}>Descripción{renderSortArrow('descripcion')}</th>
              <th onClick={() => handleSort('stock_minimo')} style={{ textAlign: 'right' }}>
                Stock Mínimo{renderSortArrow('stock_minimo')}
              </th>
              <th onClick={() => handleSort('stock_actual')} style={{ textAlign: 'right' }}>
                Stock Actual{renderSortArrow('stock_actual')}
              </th>
              <th onClick={() => handleSort('umbral_stock_bajo')} style={{ textAlign: 'right' }}>
                Umbral{renderSortArrow('umbral_stock_bajo')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedProductos.length > 0 ? (
              sortedProductos.map((p, index) => (
                <tr key={index} style={{ backgroundColor: '#ffe5e5' }}>
                  <td>{p.nombre}</td>
                  <td>{p.categoria || p.nombre /* Corregí acá, estaba repetido nombre */}</td>
                  <td>{p.descripcion}</td>
                  <td style={{ textAlign: 'right' }}>{p.stock_minimo}</td>
                  <td style={{ textAlign: 'right' }}>{p.stock_actual}</td>
                  <td style={{ textAlign: 'right' }}>{p.umbral_stock_bajo}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>
                  No hay productos con stock bajo
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p style={{ marginTop: '1rem', fontStyle: 'italic', color: '#555' }}>
        Este reporte identifica los productos cuyo stock actual se encuentra por debajo del stock mínimo
        o dentro de un umbral de alerta definido. El objetivo es anticiparse a quiebres de stock y 
        facilitar decisiones de reposición o compras antes de que se agoten los productos.
      </p>
      <button className="btn btn-dark" onClick={() => navigate('/inventario')}>Volver</button>
    </div>
  );
}

export default StockBajo;
