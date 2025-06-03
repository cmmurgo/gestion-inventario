import React, { useEffect, useState } from 'react';
import { API_URL } from '../../api';
import { useNavigate } from 'react-router-dom';

function ProductosMayorIngreso() {
  const [datos, setDatos] = useState([]);
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

  return (
    <div>
      <h2>💰 Productos que Generan Mayores Ingresos</h2>
      <div style={{ maxHeight: '500px', overflowY: 'auto', border: '1px solid #ccc' }}>
        <table border="1" cellPadding="5" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ position: 'sticky', top: 0, backgroundColor: '#ffe6cc' }}>
            <tr>
              <th>Producto</th>
              <th>Precio Unitario</th>
              <th>Ventas (6 meses)</th>
              <th>Ingreso Total</th>
            </tr>
          </thead>
          <tbody>
            {datos.length > 0 ? (
              datos.map(p => (
                <tr key={p.producto_id}>
                  <td>{p.nombre}</td>
                  <td>${parseFloat(p.precio_venta).toFixed(2)}</td>
                  <td>{p.total_ventas_6_meses}</td>
                  <td><strong>${parseFloat(p.ingreso_total).toLocaleString()}</strong></td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4">No hay datos disponibles</td></tr>
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
