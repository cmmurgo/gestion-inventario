import React, { useEffect, useState } from 'react';
import { API_URL } from '../../api';
import { useNavigate } from 'react-router-dom';

function ProductosMayorIngreso() {
  const [datos, setDatos] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/'; // redirige si no hay token
      return;
    }

    fetch(`${API_URL}/api/inventario/productos-mayor-ingreso`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then(res => res.json())
      .then(data => {      
        if (data && Array.isArray(data.productos_mayor_ingreso)) {
          setDatos(data.productos_mayor_ingreso);
        } else {
          setDatos([]);
        }
      })
      .catch(err => console.error("Error al cargar productos por ingreso:", err));
  }, []);

  // Ordenar datos según sortConfig
  const sortedDatos = React.useMemo(() => {
    if (!sortConfig.key) return datos;

    const sorted = [...datos].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

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
      <h2>💰 Productos que Generan Mayores Ingresos</h2>
      <div style={{ maxHeight: '500px', overflowY: 'auto', border: '1px solid #ccc' }}>
        <table border="1" cellPadding="5" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ position: 'sticky', top: 0, backgroundColor: '#ffe6cc', cursor: 'pointer' }}>
            <tr>
              <th onClick={() => handleSort('nombre')}>Producto{renderSortArrow('nombre')}</th>
              <th onClick={() => handleSort('precio_venta')} style={{ textAlign: 'right' }}>
                Precio Unitario{renderSortArrow('precio_venta')}
              </th>
              <th onClick={() => handleSort('total_ventas_6_meses')} style={{ textAlign: 'right' }}>
                Ventas (6 meses){renderSortArrow('total_ventas_6_meses')}
              </th>
              <th onClick={() => handleSort('ingreso_total')} style={{ textAlign: 'right' }}>
                Ingreso Total{renderSortArrow('ingreso_total')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedDatos.length > 0 ? (
              sortedDatos.map(p => (
                <tr key={p.producto_id}>
                  <td>{p.nombre}</td>
                  <td style={{ textAlign: 'right' }}>${parseFloat(p.precio_venta).toFixed(2)}</td>
                  <td style={{ textAlign: 'right' }}>{p.total_ventas_6_meses}</td>
                  <td style={{ textAlign: 'right' }}><strong>${parseFloat(p.ingreso_total).toLocaleString()}</strong></td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4" style={{ textAlign: 'center' }}>No hay datos disponibles</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <p style={{ marginTop: '1rem', fontStyle: 'italic', color: '#555' }}>
        Este reporte muestra los productos que han generado mayores ingresos en los últimos 6 meses.
        El ingreso total se calcula multiplicando el precio unitario por la cantidad total vendida 
        en ese período (<code>precio de venta del producto × total ventas ultimos 6 meses</code>).
        Esta información es útil para identificar los productos más rentables del negocio.
      </p>
      <button className="btn btn-dark" onClick={() => navigate('/inventario')}>Volver</button>
    </div>
  );
}

export default ProductosMayorIngreso;
