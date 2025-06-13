import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductoById, actualizarProducto } from '../../services/productService';
import { getRubros } from '../../services/rubroService';
import { getProveedores } from '../../services/proveedorService';

export default function EditarProducto() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [producto, setProducto] = useState({
    nombre: '',
    id_rubro: '',
    id_proveedor: '',
    descripcion: '',
    precio_costo: '',
    precio_venta: '',
    stock_minimo: '',
    id_promocion: '',
    codigo_barra: ''
  });

  const [rubros, setRubros] = useState([]);
  const [proveedores, setProveedores] = useState([]);

  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [mostrarMensaje, setMostrarMensaje] = useState(false);

  useEffect(() => {
    getRubros().then(res => setRubros(res.data)).catch(console.error);
    getProveedores().then(res => setProveedores(res.data)).catch(console.error);

    getProductoById(id)
      .then(res => {
        const prod = res.data;
        setProducto({
          nombre: prod.nombre || '',
          id_rubro: prod.id_rubro?.toString() || '',
          id_proveedor: prod.id_proveedor?.toString() || '',
          descripcion: prod.descripcion || '',
          precio_costo: prod.precio_costo || '',
          precio_venta: prod.precio_venta || '',
          stock_minimo: prod.stock_minimo || '',
          id_promocion: prod.id_promocion || '',
          codigo_barra: prod.codigo_barra || ''
        });
      })
      .catch(err => {
        console.error('Error al cargar producto', err);
        setMensaje('Error al cargar los datos');
        setTipoMensaje('error');
        setMostrarMensaje(true);
      });
  }, [id]);

  const handleChange = (e) => {
    setProducto({ ...producto, [e.target.name]: e.target.value });
  };

  const handleGuardar = async () => {
    try {
      const datos = {
        ...producto,
        id_rubro: parseInt(producto.id_rubro),
        id_proveedor: parseInt(producto.id_proveedor),
        precio_costo: parseInt(producto.precio_costo) || 0,
        precio_venta: parseInt(producto.precio_venta),
        stock_minimo: parseInt(producto.stock_minimo) || 0,
        id_promocion: producto.id_promocion ? parseInt(producto.id_promocion) : null,
        codigo_barra: parseInt(producto.codigo_barra)
      };

      await actualizarProducto(id, datos);
      setMensaje('Producto actualizado con éxito');
      setTipoMensaje('success');
    } catch (err) {
      console.error('Error al guardar cambios', err);
      setMensaje('Error al guardar cambios');
      setTipoMensaje('error');
    }

    setMostrarMensaje(true);
    setTimeout(() => setMostrarMensaje(false), 3000);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h4>EDITAR PRODUCTO</h4>
      <div style={{ background: '#eee', padding: '2rem', maxWidth: '500px' }}>
        {[
          ['nombre', 'Nombre'],
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

        {/* Rubro */}
        <div className="mb-3">
          <label className="form-label">Rubro:</label>
          <select className="form-select" name="id_rubro" value={producto.id_rubro} onChange={handleChange}>
            <option value="">-- Seleccionar rubro --</option>
            {rubros.map(r => (
              <option key={r.id} value={r.id}>{r.nombre}</option>
            ))}
          </select>
        </div>

        {/* Proveedor */}
        <div className="mb-3">
          <label className="form-label">Proveedor:</label>
          <select className="form-select" name="id_proveedor" value={producto.id_proveedor} onChange={handleChange}>
            <option value="">-- Seleccionar proveedor --</option>
            {proveedores.map(p => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>
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
