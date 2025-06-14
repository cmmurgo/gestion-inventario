import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductoById } from '../../services/productService';

export default function VerProducto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    getProductoById(id)
      .then(res => setProducto(res.data))
      .catch(() => setErrorMessage('Error al obtener el producto.'));
  }, [id]);

  return (
    <div style={{ padding: '2rem' }}>
      <h4>VER PRODUCTO</h4>
      <div style={{ background: '#eee', padding: '2rem', maxWidth: '400px' }}>
        {[
          ['NOMBRE', producto.nombre],
          ['CATEGORÍA', producto.categoria],
          ['DESCRIPCIÓN', producto.descripcion],
          ['PRECIO COSTO', producto.precio_costo],
          ['PRECIO VENTA', producto.precio_venta],
          ['STOCK MÍNIMO', producto.stock_minimo],
          ['ID PROMOCIÓN', producto.id_promocion],
          ['CÓDIGO DE BARRA', producto.codigo_barra]
        ].map(([label, value], i) => (
          <div className="mb-3" key={i}>
            <label className="form-label">{label}:</label>
            <div className="form-control bg-light">{value || '-'}</div>
          </div>
        ))}
      </div>
      {errorMessage && <p className="text-danger mt-2">{errorMessage}</p>}
      <div className="mt-4" style={{ maxWidth: '400px' }}>
        <button className="btn btn-dark" onClick={() => navigate('/productos')}>Volver</button>
      </div>
    </div>
  );
}
