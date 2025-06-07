import React, { useEffect, useState } from 'react';
import { getProductos, eliminarProducto } from '../../services/productService';
import { useNavigate } from 'react-router-dom';

export default function IndexProductos() {
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();

  const cargarProductos = async () => {
    try {
      const res = await getProductos();
      setProductos(res.data);
    } catch (err) {
      console.error('Error al obtener productos', err);
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de que querés eliminar este producto?')) {
      await eliminarProducto(id);
      cargarProductos();
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  return (
    <div className="container">
      <h2>Listado de Productos</h2>
      <button className="btn btn-primary mb-3" onClick={() => navigate('/productos/crear')}>
        Crear nuevo producto
      </button>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Precio Venta</th>
            <th>Stock Mínimo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id}>
              <td>{p.nombre}</td>
              <td>{p.categoria}</td>
              <td>${p.precio_venta}</td>
              <td>{p.stock_minimo}</td>
              <td>
                <button className="btn btn-warning me-2" onClick={() => navigate(`/productos/editar/${p.id}`)}>Editar</button>
                <button className="btn btn-danger" onClick={() => handleEliminar(p.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
