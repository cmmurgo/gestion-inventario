import React, { useEffect, useState } from 'react';
import { API_URL } from '../../api';
import { useNavigate } from 'react-router-dom';

function ReporteStockProducto() {
  const [datos, setDatos] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/';
      return;
    }

    fetch(`${API_URL}/api/inventario/stock-producto`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.stock_producto)) {
          setDatos(data.stock_producto);
        } else {
          setDatos([]);
        }
      })
      .catch(err => console.error('Error al cargar stock de productos:', err));
  }, []);

  // Función para ordenar datos según columna y dirección
  const sortedDatos = React.useMemo(() => {
    if (!sortConfig.key) return datos;

    const sorted = [...datos].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      // Diferenciar entre números y strings
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return aVal - bVal;
      }
      // Comparación para strings
      return aVal.toString().localeCompare(bVal.toString());
    });

    if (sortConfig.direction === 'desc') sorted.reverse();
    return sorted;
  }, [datos, sortConfig]);

  // Maneja el click en encabezados para ordenar
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Para mostrar flechas de orden en el encabezado
  const renderSortArrow = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
  };

  return (
    <div>
      <h2>📦 Reporte de Stock de Productos</h2>
      <div style={{ maxHeight: '500px', overflowY: 'auto', border: '1px solid #ccc' }}>
        <table border="1" cellPadding="5" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ position: 'sticky', top: 0, backgroundColor: '#e6f0ff', cursor: 'pointer' }}>
            <tr>
              <th onClick={() => handleSort('nombre')}>
                Producto{renderSortArrow('nombre')}
              </th>
              <th onClick={() => handleSort('rubro')}>
                Rubro{renderSortArrow('rubro')}
              </th>
              <th onClick={() => handleSort('descripcion')}>
                Descripción{renderSortArrow('descripcion')}
              </th>
              <th onClick={() => handleSort('stock_minimo')} style={{ textAlign: 'right' }}>
                Stock Mínimo{renderSortArrow('stock_minimo')}
              </th>
              <th onClick={() => handleSort('stock_actual')} style={{ textAlign: 'right' }}>
                Stock Actual{renderSortArrow('stock_actual')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedDatos.length > 0 ? (
              sortedDatos.map((p, index) => (
                <tr key={index}>
                  <td>{p.nombre}</td>
                  <td>{p.rubro}</td>
                  <td>{p.descripcion}</td>
                  <td style={{ textAlign: 'right' }}>{p.stock_minimo}</td>
                  <td style={{ textAlign: 'right' }}>{p.stock_actual}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>
                  No hay datos disponibles
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p style={{ marginTop: '1rem', fontStyle: 'italic', color: '#555' }}>
        Este reporte muestra el stock actual de cada producto comparado con el stock mínimo definido.
        Permite identificar productos con bajo stock para tomar acciones oportunas de reposición.
      </p>

      <button className="btn btn-dark" onClick={() => navigate('/inventario')}>
        Volver
      </button>
    </div>
  );
}

export default ReporteStockProducto;
