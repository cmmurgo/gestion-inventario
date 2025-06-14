import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductoById } from '../../services/productService';
import { getPromocionById } from '../../services/promocionService';
import { getRubroById } from '../../services/rubroService';
import { getProveedorById } from '../../services/proveedorService';

export default function VerProducto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [promoNombre, setPromoNombre] = useState('');
  const [rubroNombre, setRubroNombre] = useState('');
  const [proveedorNombre, setProveedorNombre] = useState('');

  useEffect(() => {
    getProductoById(id)
      .then(res => {
        const prod = res.data;
        setProducto(prod);

        if (prod.id_promocion) {
          getPromocionById(prod.id_promocion)
            .then(resPromo => setPromoNombre(resPromo.data.nombre))
            .catch(() => setPromoNombre(''));
        }

        if (prod.id_rubro) {
          getRubroById(prod.id_rubro)
            .then(resRubro => setRubroNombre(resRubro.data.nombre))
            .catch(() => setRubroNombre(''));
        }

        if (prod.id_proveedor) {
          getProveedorById(prod.id_proveedor)
            .then(resProv => setProveedorNombre(resProv.data.nombre))
            .catch(() => setProveedorNombre(''));
        }
      })
      .catch(() => setErrorMessage('Error al obtener el producto.'));
  }, [id]);

  return (
    <div style={{ padding: '2rem' }}>
      <h4>VER PRODUCTO</h4>
      <div style={{ background: '#eee', padding: '2rem', maxWidth: '400px' }}>
        {[
          ['Nombre', producto.nombre],
          ['Rrubro', rubroNombre || '-'],
          ['Descripción', producto.descripcion],
          ['Precio Costo', producto.precio_costo],
          ['Precio Venta', producto.precio_venta],
          ['Stock Mínimo', producto.stock_minimo],
          ['Promoción', promoNombre || '-'],
          ['Proveedor', proveedorNombre || '-'],
          ['Código de barra', producto.codigo_barra]
        ].map(([label, value], i) => (
          <div className="mb-3" key={i}>
            <label className="form-label">{label}:</label>
            <div className="form-control bg-light">{value || '-'}</div>
          </div>
        ))}
      </div>
      {errorMessage && <p className="text-danger mt-2">{errorMessage}</p>}
      <div className="d-flex justify-content-between mt-4" style={{ maxWidth: '400px' }}>
        <button className="btn btn-dark" onClick={() => navigate('/productos')}>Volver</button>
        <button className="btn btn-primary" onClick={() => navigate(`/productos/editar/${id}`)}>Editar</button>
      </div>
    </div>
  );
}
