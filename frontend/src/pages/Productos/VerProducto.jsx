import React, { useEffect, useState } from 'react';
import { getProductoById } from '../../services/productService';
import { useParams, useNavigate } from 'react-router-dom';

export default function VerProducto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);

  useEffect(() => {
    const cargarProducto = async () => {
      try {
        const res = await getProductoById(id);
        setProducto(res.data);
      } catch (error) {
        console.error('Error al obtener el producto', error);
        alert('No se pudo cargar el producto');
      }
    };
    cargarProducto();
  }, [id]);

  if (!producto) return <div>Cargando producto...</div>;

  return (
    <div className="container mt-4">
      <h2>Detalle del Producto</h2>
      <div className="card shadow p-4 mt-3">
        <div className="row mb-3">
          <div className="col-md-6"><strong>Nombre:</strong> {producto.nombre}</div>
          <div className="col-md-6"><strong>Categoría:</strong> {producto.categoria}</div>
        </div>
        <div className="row mb-3">
          <div className="col-md-12"><strong>Descripción:</strong><br />{producto.descripcion}</div>
        </div>
        <div className="row mb-3">
          <div className="col-md-4"><strong>Precio costo:</strong> ${producto.precio_costo}</div>
          <div className="col-md-4"><strong>Precio venta:</strong> ${producto.precio_venta}</div>
          <div className="col-md-4"><strong>Stock mínimo:</strong> {producto.stock_minimo}</div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6"><strong>Código de barra:</strong> {producto.codigo_barra}</div>
          <div className="col-md-6"><strong>ID Promoción:</strong> {producto.id_promocion || '—'}</div>
        </div>
        <div className="text-end">
          <button className="btn btn-secondary" onClick={() => navigate('/productos')}>Volver</button>
        </div>
      </div>
    </div>
  );
}
