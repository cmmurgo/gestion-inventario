import React, { useState } from 'react';
import { crearProducto } from '../../services/productService';
import { useNavigate } from 'react-router-dom';

export default function CrearProducto() {
  const navigate = useNavigate();
  const [producto, setProducto] = useState({
    nombre: '',
    categoria: '',
    descripcion: '',
    precio_costo: '',
    precio_venta: '',
    stock_minimo: '',
    id_promocion: '',
    codigo_barra: ''
  });

  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [mostrarMensaje, setMostrarMensaje] = useState(false);

  const handleChange = (e) => {
    setProducto({ ...producto, [e.target.name]: e.target.value });
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

      await crearProducto(datos);
      setMensaje('Producto creado exitosamente');
      setTipoMensaje('success');
      setProducto({ nombre: '', categoria: '', descripcion: '', precio_costo: '', precio_venta: '', stock_minimo: '', id_promocion: '', codigo_barra: '' });
    } catch (err) {
      console.error(err);
      setMensaje('Error al crear producto');
      setTipoMensaje('error');
    }

    setMostrarMensaje(true);
    setTimeout(() => setMostrarMensaje(false), 3000);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h4>CREAR PRODUCTO</h4>
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
        <button className="btn btn-success" onClick={handleGuardar}>GUARDAR</button>
      </div>
    </div>
  );
}
