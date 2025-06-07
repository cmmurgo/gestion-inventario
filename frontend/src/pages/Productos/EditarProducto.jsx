import React, { useState, useEffect } from 'react';
import { getProductoById, actualizarProducto } from '../../services/productService';
import { useParams, useNavigate } from 'react-router-dom';

export default function EditarProducto() {
  const { id } = useParams();
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

  useEffect(() => {
    const cargarProducto = async () => {
      try {
        const res = await getProductoById(id);
        setProducto(res.data);
      } catch (error) {
        console.error('Error al cargar producto:', error);
        alert('Error al obtener el producto');
      }
    };
    cargarProducto();
  }, [id]);

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

      await actualizarProducto(id, datosNormalizados);
      alert('Producto actualizado correctamente');
      navigate('/productos');
    } catch (error) {
      console.error('Error al actualizar producto:', error.response?.data || error);
      alert('Hubo un error al actualizar el producto.');
    }
  };

  return (
    <div className="container">
      <h2>Editar Producto</h2>
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
          <label>ID Promoción</label>
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

        <button type="submit" className="btn btn-primary">Actualizar</button>
        <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/productos')}>Cancelar</button>
      </form>
    </div>
  );
}
