import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowUp } from 'react-icons/fa';
import axios from 'axios';
import { API_URL } from '../../api';

export default function VerOrdenCompra() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [orden, setOrden] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mostrarBotonScroll, setMostrarBotonScroll] = useState(false);

  useEffect(() => {
    const cargarOrden = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }
      try {
        const res = await axios.get(`${API_URL}/api/ordenes-compra/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrden(res.data);
      } catch (err) {
        setError('Error al cargar la orden.');
      } finally {
        setLoading(false);
      }
    };
    cargarOrden();
  }, [id, navigate]);

  // Control del scroll
  useEffect(() => {
    const manejarScroll = () => {
      if (window.pageYOffset > 300) {
        setMostrarBotonScroll(true);
      } else {
        setMostrarBotonScroll(false);
      }
    };

    window.addEventListener('scroll', manejarScroll);
    return () => window.removeEventListener('scroll', manejarScroll);
  }, []);

  const scrollHaciaArriba = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  const getEstadoBadge = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'recibida':
        return <span className="badge bg-success">Recibida</span>; // Verde
      case 'creada':
        return <span className="badge bg-primary">Creada</span>; // Azul
      case 'cancelada':
        return <span className="badge bg-danger">Cancelada</span>; // Rojo
      default:
        return <span className="badge bg-secondary">{estado}</span>;
    }
  };

  if (loading) return <div className="container mt-4">Cargando...</div>;
  if (error) return <div className="container mt-4 alert alert-danger">{error}</div>;
  if (!orden) return <div className="container mt-4">Orden no encontrada.</div>;

  return (
    <div className="container py-4" style={{ position: 'relative' }}>
      <h4 className="fw-bold mb-4">DETALLES DE LA ORDEN DE COMPRA</h4>

      <div className="card shadow-sm mb-4">
        <div className="card-header">Información General</div>
        <div className="card-body">
          <div className="mb-3 row">
            <label className="col-sm-4 col-form-label fw-bold">ID Orden:</label>
            <div className="col-sm-8"><p className="form-control-plaintext">{orden.id}</p></div>
          </div>
          <div className="mb-3 row">
            <label className="col-sm-4 col-form-label fw-bold">Fecha:</label>
            <div className="col-sm-8"><p className="form-control-plaintext">{new Date(orden.fecha).toLocaleDateString()}</p></div>
          </div>
          <div className="mb-3 row">
            <label className="col-sm-4 col-form-label fw-bold">Proveedor:</label>
            <div className="col-sm-8"><p className="form-control-plaintext">{orden.proveedor_nombre}</p></div>
          </div>
          <div className="mb-3 row">
            <label className="col-sm-4 col-form-label fw-bold">CUIT Proveedor:</label>
            <div className="col-sm-8"><p className="form-control-plaintext">{orden.cuit}</p></div>
          </div>
          <div className="mb-3 row">
            <label className="col-sm-4 col-form-label fw-bold">Estado:</label>
            <div className="col-sm-8">{getEstadoBadge(orden.estado)}</div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-header">Productos de la Orden</div>
        <div className="card-body">
          <table className="table table-bordered table-striped text-center">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {orden.detalles && orden.detalles.map((detalle, index) => (
                <tr key={index}>
                  <td>{detalle.nombre_producto}</td>
                  <td>{detalle.cantidad}</td>
                  <td>${parseFloat(detalle.precio_unitario_costo || 0).toFixed(2)}</td>
                  <td>${(parseFloat(detalle.cantidad || 0) * parseFloat(detalle.precio_unitario_costo || 0)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="table-info">
                <th colspan="3">Total de la Orden:</th>
                <th>${orden.detalles ? orden.detalles.reduce((acc, detalle) => acc + (parseFloat(detalle.cantidad || 0) * parseFloat(detalle.precio_unitario_costo || 0)), 0).toFixed(2) : '0.00'}</th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="mt-4 text-center">
        <button className="btn btn-secondary" onClick={() => navigate('/compras')}>Volver</button>
      </div>

      {/* Botón de scroll hacia arriba */}
      {mostrarBotonScroll && (
        <button
          onClick={scrollHaciaArriba}
          className="btn btn-primary"
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            border: 'none',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Ir arriba"
        >
          <FaArrowUp />
        </button>
      )}
    </div>
  );
}