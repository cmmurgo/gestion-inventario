import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductoById, actualizarProducto } from '../../services/productService';

export default function EditarProducto() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [producto, setProducto] = useState({});
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [mostrarMensaje, setMostrarMensaje] = useState(false);

  useEffect(() => {
    getProductoById(id)
      .then(res => setProducto(res.data))
      .catch(err => console.error('Error al cargar producto', err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto({ ...producto, [name]: value });
  };

  const handleGuardar = async () => {
    try {
      const datos = {
        ...producto,
        precio_costo: parseInt(producto.precio_costo) || 0,
        precio_venta: parseInt(producto.precio_venta),
        stock_minimo: parseInt(producto.stock_minimo) || 0,
        id_promocion: producto.id_promocion ? parseInt(producto.id_promocion) : null,
        codigo_barra: parseInt(producto.codigo_barra)
      };

      await actualizarProducto(id, datos);
      setMensaje('Producto actualizado correctamente');
      setTipoMensaje('success');
    } catch (error) {
      console.error(error);
      setMensaje('Error al actualizar producto');
      setTipoMensaje('error');
    }

    setMostrarMensaje(true);
    setTimeout(() => setMostrarMensaje(false), 3000);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h4>EDITAR PRODUCTO</h4>
      <div style={{ background: '#eee', padding: '2rem', maxWidth: '400px' }}>
        {[
          ['nombre', 'Nombre'],
          ['categoria', 'Categoría'],
          ['descripcion', 'Descripción'],
          ['precio_costo', 'Precio Costo'],
          ['precio_venta', 'Precio Venta'],
          ['stock_minimo', 'Stock Mínimo'],
          ['id_promocion', 'ID Promoción'],
          ['codigo_barra', 'Código de Barra']
        ].map(([key, label], i) => (
          <div className="mb-3" key={i}>
            <label className="form-label">{label}:</label>
            <input
              type={key.includes('precio') || key.includes('stock') || key.includes('codigo') ? 'number' : 'text'}
              className="form-control"
              name={key}
              value={producto[key] || ''}
              onChange={handleChange}
            />
          </div>
        ))}
      </div>

      <div
        className={`alert text-center mt-3 ${tipoMensaje === 'success' ? 'alert-success' : 'alert-danger'} ${mostrarMensaje ? 'show' : 'd-none'}`}
      >
        {tipoMensaje === 'success' ? '✅' : '❌'} {mensaje}
      </div>

      <div className="d-flex justify-content-between mt-4" style={{ maxWidth: '400px' }}>
        <button className="btn btn-dark" onClick={() => navigate('/productos')}>Volver</button>
        <button className="btn btn-success" onClick={handleGuardar}>GUARDAR CAMBIOS</button>
      </div>
    </div>
  );
}
