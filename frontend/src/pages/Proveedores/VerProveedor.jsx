// src/pages/Proveedores/VerProveedor.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProveedorById } from '../../services/proveedorService'; // Asegúrate de que esta ruta sea correcta
import { getToken } from '../../services/authService'; // Asegúrate de que esta ruta sea correcta
import '../../App.css';

function VerProveedor() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [proveedor, setProveedor] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate('/');
      return;
    }

    if (id) {
      getProveedorById(id)
        .then(response => {
          // Asume que response.data ahora contiene 'rubro_nombre'
          setProveedor(response.data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setErrorMessage('Error al cargar el proveedor.');
          setLoading(false);
        });
    }
  }, [navigate, id]);

  if (loading) {
    return <div className="container mt-4">Cargando datos del proveedor...</div>;
  }

  if (!proveedor) {
    return (
      <div className="container mt-4">
        <p className="text-danger">Proveedor no encontrado.</p>
        <button className="btn btn-dark" onClick={() => navigate('/proveedores')}>Volver al listado</button>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h4 className="fw-bold mb-4">DETALLES DEL PROVEEDOR</h4>
      <div className="card" style={{ maxWidth: '600px', margin: 'auto' }}>
        <div className="card-body">
          <div className="mb-3 row">
            <label className="col-sm-4 col-form-label fw-bold">ID:</label>
            <div className="col-sm-8">
              <p className="form-control-plaintext">{proveedor.id}</p>
            </div>
          </div>
          <div className="mb-3 row">
            <label className="col-sm-4 col-form-label fw-bold">Nombre:</label>
            <div className="col-sm-8">
              <p className="form-control-plaintext">{proveedor.nombre}</p>
            </div>
          </div>
          <div className="mb-3 row">
            <label className="col-sm-4 col-form-label fw-bold">Email:</label>
            <div className="col-sm-8">
              <p className="form-control-plaintext">{proveedor.email}</p>
            </div>
          </div>
          <div className="mb-3 row">
            <label className="col-sm-4 col-form-label fw-bold">Teléfono:</label>
            <div className="col-sm-8">
              <p className="form-control-plaintext">{proveedor.telefono || 'N/A'}</p>
            </div>
          </div>
          <div className="mb-3 row">
            <label className="col-sm-4 col-form-label fw-bold">Contacto:</label>
            <div className="col-sm-8">
              <p className="form-control-plaintext">{proveedor.contacto || 'N/A'}</p>
            </div>
          </div>
          <div className="mb-3 row">
            <label className="col-sm-4 col-form-label fw-bold">Dirección:</label>
            <div className="col-sm-8">
              <p className="form-control-plaintext">{proveedor.direccion || 'N/A'}</p>
            </div>
          </div>
          <div className="mb-3 row">
            <label className="col-sm-4 col-form-label fw-bold">CUIT:</label>
            <div className="col-sm-8">
              <p className="form-control-plaintext">{proveedor.cuit}</p>
            </div>
          </div>
          <div className="mb-3 row">
            <label className="col-sm-4 col-form-label fw-bold">Rubro:</label>
            <div className="col-sm-8">
              {/* <--- ¡CLAVE! Aquí se muestra directamente el rubro_nombre que viene del backend */}
              <p className="form-control-plaintext">{proveedor.rubro_nombre || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="alert alert-danger mt-3" role="alert">
          {errorMessage}
        </div>
      )}

      <div className="mt-4 text-center">
        <button className="btn btn-secondary" onClick={() => navigate('/proveedores')}>Volver</button>
      </div>
    </div>
  );
}

export default VerProveedor;