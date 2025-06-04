import React, { useEffect, useState } from 'react';
import { API_URL } from '../../api';
import { useNavigate } from 'react-router-dom';

function TasaRotacion() {
  const [datos, setDatos] = useState([]);
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

  return (
    <div>
      <h2>📊 Reporte de Rotación de Productos</h2>
      <div style={{ maxHeight: '500px', overflowY: 'auto', border: '1px solid #ccc' }}>
        <table border="1" cellPadding="5" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ position: 'sticky', top: 0, backgroundColor: '#e6f0ff' }}>
            <tr>
              <th>Producto</th>
              <th>Ventas</th>
              <th>Stock Promedio Mensual</th>
              <th>Tasa de Rotación</th>
            </tr>
          </thead>
          <tbody>
            {datos.length > 0 ? (
              datos.map(p => {
                const rotacion = p.stock_promedio_mensual > 0
                  ? (p.total_ventas_6_meses / p.stock_promedio_mensual).toFixed(2)
                  : 'N/A';
                return (
                  <tr key={p.producto_id}>
                    <td>{p.nombre}</td>
                    <td>{p.total_ventas_6_meses}</td>
                    <td>{p.stock_promedio_mensual}</td>
                    <td>{rotacion}</td>
                  </tr>
                );
              })
            ) : (
              <tr><td colSpan="4">No hay datos disponibles</td></tr>
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
