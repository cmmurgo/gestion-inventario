import React, { useEffect, useState } from 'react';
import { API_URL } from '../../api';
import { useNavigate } from 'react-router-dom';

function StockBajo() {
  const [productos, setProductos] = useState([]);
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
        setProductos(data.stock_bajos);
      })
      .catch(err => console.error("Error al cargar productos:", err));
  }, []);

  return (
    <div>
      <h2>🛑 Productos con stock bajo</h2>

      <div style={{ maxHeight: '500px', overflowY: 'auto', border: '1px solid #ccc' }}>
        <table border="1" cellPadding="3" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f2f2f2' }}>
            <tr>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Descripción</th>
              <th>Stock Mínimo</th>
              <th>Stock Actual</th>
              <th>Umbral</th>
            </tr>
          </thead>
          <tbody>
            {productos.length > 0 ? (
              productos.map(p => (
                <tr key={p.id} style={{ backgroundColor: '#ffe5e5' }}>
                  <td>{p.nombre}</td>
                  <td>{p.categoria}</td>
                  <td>{p.descripcion}</td>
                  <td>{p.stock_minimo}</td>
                  <td>{p.stock_actual}</td>
                  <td>{p.umbral_stock_bajo}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6">No hay productos con stock bajo</td></tr>
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
