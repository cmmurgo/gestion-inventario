import React, { useEffect, useState } from 'react';
import { API_URL } from '../../api';
import { useNavigate } from 'react-router-dom';

function ProductosMenosVendidos() {
  const [datos, setDatos] = useState([]);
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

  return (
    <div>
      <h2>📉 Productos Menos Vendidos y que Requieren Estrategias Promocionales</h2>
      <div style={{ maxHeight: '500px', overflowY: 'auto', border: '1px solid #ccc' }}>
        <table border="1" cellPadding="5" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ position: 'sticky', top: 0, backgroundColor: '#ffe6e6' }}>
            <tr>
              <th>Producto</th>
              <th>Precio Venta</th>
              <th>Total Ventas (6 meses)</th>
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
                  <td>${parseFloat(p.ingreso_total).toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4">No hay productos con bajo rendimiento</td></tr>
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
