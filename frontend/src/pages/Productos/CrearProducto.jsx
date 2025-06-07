import React, { useState } from 'react';
import { crearProducto } from '../../services/productService';
import { useNavigate } from 'react-router-dom';

export default function CrearProducto() {
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

  const navigate = useNavigate();

  const handleChange = (e) => {
    setProducto({
      ...producto,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const datosNormalizados = {
        ...producto,
        precio_costo: parseInt(producto.precio_costo) || 0,
        precio_venta: parseInt(producto.precio_venta),
        stock_minimo: parseInt(producto.stock_minimo) || 0,
        id_promocion: producto.id_promocion ? parseInt(producto.id_promocion) : null,
        codigo_barra: parseInt(producto.codigo_barra)
      };

      await crearProducto(datosNormalizados);
      alert('Producto creado exitosamente');
      navigate('/productos');
    } catch (error) {
      console.error('Error al crear producto:', error.response?.data || error);
      alert('Hubo un error al crear el producto.');
    }
  };

  return (
    <div className="container">
      <h2>Registrar nuevo producto</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Precio costo</label>
          <input
            type="number"
            className="form-control"
            name="precio_costo"
            value={producto.precio_costo || ''}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Precio venta</label>
          <input
            type="number"
            className="form-control"
            name="precio_venta"
            value={producto.precio_venta || ''}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Stock mínimo</label>
          <input
            type="number"
            className="form-control"
            name="stock_minimo"
            value={producto.stock_minimo || ''}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>ID Promoción (opcional)</label>
          <input
            type="number"
            className="form-control"
            name="id_promocion"
            value={producto.id_promocion || ''}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Código de barra</label>
          <input
            type="number"
            className="form-control"
            name="codigo_barra"
            value={producto.codigo_barra || ''}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-success">Guardar</button>
        <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/productos')}>Cancelar</button>
      </form>
    </div>
  );
}
