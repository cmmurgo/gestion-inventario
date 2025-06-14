import React, { useState, useEffect } from 'react';
import { crearProducto } from '../../services/productService';
import { getRubros } from '../../services/rubroService';
import { getPromocionesActivas } from '../../services/promocionService';
import { getProveedores } from '../../services/proveedorService';
import { useNavigate } from 'react-router-dom';

export default function CrearProducto() {
  const navigate = useNavigate();
  const [producto, setProducto] = useState({
    nombre: '',
    id_rubro: '',
    descripcion: '',
    precio_costo: '',
    precio_venta: '',
    stock_minimo: '',
    id_promocion: '',
    codigo_barra: '',
    id_proveedor: ''
  });

  const [rubros, setRubros] = useState([]);
  const [promociones, setPromociones] = useState([]);
  const [proveedores, setProveedores] = useState([]);

  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [mostrarMensaje, setMostrarMensaje] = useState(false);

  useEffect(() => {
    getRubros().then(res => setRubros(res.data)).catch(err => console.error('Error al obtener rubros', err));
    getPromocionesActivas().then(res => setPromociones(res.data)).catch(err => console.error('Error al obtener promociones activas', err));
    getProveedores().then(res => setProveedores(res.data)).catch(err => console.error('Error al obtener proveedores', err));
  }, []);

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
        id_rubro: producto.id_rubro ? parseInt(producto.id_rubro) : null,
        id_proveedor: producto.id_proveedor ? parseInt(producto.id_proveedor) : null,
        codigo_barra: parseInt(producto.codigo_barra)
      };

      await crearProducto(datos);
      setMensaje('Producto creado exitosamente');
      setTipoMensaje('success');
      setProducto({
        nombre: '',
        id_rubro: '',
        descripcion: '',
        precio_costo: '',
        precio_venta: '',
        stock_minimo: '',
        id_promocion: '',
        codigo_barra: '',
        id_proveedor: ''
      });
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
      <div style={{ background: '#eee', padding: '2rem', maxWidth: '500px' }}>
        <div className="mb-3">
          <label className="form-label">Nombre:</label>
          <input type="text" className="form-control" name="nombre" value={producto.nombre} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label">Rubro:</label>
          <select className="form-select" name="id_rubro" value={producto.id_rubro} onChange={handleChange}>
            <option value="">-- Seleccionar Rubro --</option>
            {rubros.map(r => (
              <option key={r.id} value={r.id}>{r.nombre}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Descripción:</label>
          <textarea className="form-control" name="descripcion" value={producto.descripcion} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label">Precio Costo:</label>
          <input type="number" className="form-control" name="precio_costo" value={producto.precio_costo} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label">Precio Venta:</label>
          <input type="number" className="form-control" name="precio_venta" value={producto.precio_venta} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label">Stock Mínimo:</label>
          <input type="number" className="form-control" name="stock_minimo" value={producto.stock_minimo} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label">Promoción (opcional):</label>
          <select className="form-select" name="id_promocion" value={producto.id_promocion} onChange={handleChange}>
            <option value="">-- Sin promoción --</option>
            {promociones.map(p => (
              <option key={p.id} value={p.id}>{p.nombre} ({p.porcentaje}%)</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Proveedor:</label>
          <select className="form-select" name="id_proveedor" value={producto.id_proveedor} onChange={handleChange}>
            <option value="">-- Seleccionar Proveedor --</option>
            {proveedores.map(pr => (
              <option key={pr.id} value={pr.id}>{pr.nombre}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Código de Barra:</label>
          <input type="number" className="form-control" name="codigo_barra" value={producto.codigo_barra} onChange={handleChange} />
        </div>
      </div>

      <div className={`alert text-center mt-3 ${tipoMensaje === 'success' ? 'alert-success' : 'alert-danger'} ${mostrarMensaje ? 'show' : 'd-none'}`}>
        {tipoMensaje === 'success' ? '✅' : '❌'} {mensaje}
      </div>

      <div className="d-flex justify-content-between mt-4" style={{ maxWidth: '500px' }}>
        <button className="btn btn-dark" onClick={() => navigate('/productos')}>Volver</button>
        <button className="btn btn-success" onClick={handleGuardar}>GUARDAR</button>
      </div>
    </div>
  );
}
