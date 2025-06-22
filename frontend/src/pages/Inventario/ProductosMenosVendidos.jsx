import React, { useEffect, useState } from 'react';
import { API_URL } from '../../api';
import { useNavigate } from 'react-router-dom';

function ProductosMenosVendidos() {
  const [datos, setDatos] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/'; // redirige si no hay token
      return;
    }

    fetch(`${API_URL}/api/inventario/productos-menos-vendidos`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then(res => res.json())
      .then(data => {  
        if (data && Array.isArray(data.productos_menos_vendidos)) {
          setDatos(data.productos_menos_vendidos);
        } else {
          setDatos([]);
        }
      })
      .catch(err => console.error("Error al cargar productos:", err));
  }, []);

  // Ordenar datos según sortConfig
  const sortedDatos = React.useMemo(() => {
    if (!sortConfig.key) return datos;

    const sorted = [...datos].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      // Si son números, ordenar numéricamente
      if (!isNaN(parseFloat(aVal)) && !isNaN(parseFloat(bVal))) {
        return parseFloat(aVal) - parseFloat(bVal);
      }
      // Si no, ordenar como strings
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
      <h2>📉 Productos Menos Vendidos y que Requieren Estrategias Promocionales</h2>
      <div style={{ maxHeight: '500px', overflowY: 'auto', border: '1px solid #ccc' }}>
        <table border="1" cellPadding="5" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ position: 'sticky', top: 0, backgroundColor: '#ffe6e6', cursor: 'pointer' }}>
            <tr>
              <th onClick={() => handleSort('nombre')}>Producto{renderSortArrow('nombre')}</th>
              <th onClick={() => handleSort('precio_venta')} style={{ textAlign: 'right' }}>
                Precio Venta{renderSortArrow('precio_venta')}
              </th>
              <th onClick={() => handleSort('total_ventas_6_meses')} style={{ textAlign: 'right' }}>
                Total Ventas (6 meses){renderSortArrow('total_ventas_6_meses')}
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
                  <td style={{ textAlign: 'right' }}>${parseFloat(p.ingreso_total).toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4" style={{ textAlign: 'center' }}>No hay productos con bajo rendimiento</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <p style={{ marginTop: '1rem', fontStyle: 'italic', color: '#555' }}>
        Este reporte identifica los productos con menores ingresos generados en los últimos 6 meses.
        El cálculo se basa en la suma de las cantidades vendidas multiplicadas por su precio de venta.
        Estos productos podrían beneficiarse de estrategias promocionales para aumentar su rotación y ventas.
      </p>
      <button className="btn btn-dark" onClick={() => navigate('/inventario')}>Volver</button>
    </div>
  );
}

export default ProductosMenosVendidos;
