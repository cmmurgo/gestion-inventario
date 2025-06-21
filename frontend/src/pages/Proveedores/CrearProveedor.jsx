// src/pages/Proveedores/CrearProveedor.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearProveedor } from '../../services/proveedorService';
import { getRubros } from '../../services/rubroService';
import { getToken } from '../../services/authService';
import '../../App.css';

function CrearProveedor() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [contacto, setContacto] = useState('');
  const [direccion, setDireccion] = useState('');
  const [cuit, setCuit] = useState('');
  const [idRubro, setIdRubro] = useState('');
  const [rubros, setRubros] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [mostrarMensaje, setMostrarMensaje] = useState(false);
  const [loadingRubros, setLoadingRubros] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const token = getToken();
    const userRole = localStorage.getItem('userRole');

    if (!token) {
      navigate('/');
      return;
    }

    if (userRole !== 'admin') {
      navigate('/home');
      return;
    }

    getRubros()
      .then(response => {
        setRubros(response.data);
        if (response.data.length > 0) {
          setIdRubro(response.data[0].id);
        }
        setLoadingRubros(false);
      })
      .catch(err => {
        console.error('Error al cargar rubros:', err);
        setMensaje('Error al cargar la lista de rubros.');
        setTipoMensaje('error');
        setMostrarMensaje(true);
        setTimeout(() => setMostrarMensaje(false), 3000);
        setLoadingRubros(false);
      });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMostrarMensaje(false);

    try {
      const proveedor = {
        nombre,
        email,
        telefono,
        contacto,
        direccion,
        cuit,
        id_rubro: parseInt(idRubro),
      };

      await crearProveedor(proveedor);

      setMensaje('Proveedor creado con éxito');
      setTipoMensaje('success');
      setMostrarMensaje(true);
      setTimeout(() => {
        setMostrarMensaje(false);
        navigate('/proveedores');
      }, 2000);
    } catch (err) {
      console.error('Error al crear proveedor:', err);
      const backendMessage =
        err?.response?.data?.message ||
        (err?.response?.data?.errors && Object.values(err.response.data.errors).flat().join(' ')) ||
        'Error al crear el proveedor';

      setMensaje(backendMessage);
      setTipoMensaje('error');
      setMostrarMensaje(true);
      setTimeout(() => setMostrarMensaje(false), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCuit = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 10) return `${numbers.slice(0, 2)}-${numbers.slice(2)}`;
    return `${numbers.slice(0, 2)}-${numbers.slice(2, 10)}-${numbers.slice(10, 11)}`;
  };

  const handleCuitChange = (e) => {
    const formatted = formatCuit(e.target.value);
    setCuit(formatted);
  };

  return (
    <div className="container mt-4">
      <h4 className="mb-4">CREAR NUEVO PROVEEDOR</h4>
    
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">Nombre *</label>
          <input
            type="text"
            className="form-control"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email *</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="telefono" className="form-label">Teléfono</label>
          <input
            type="text"
            className="form-control"
            id="telefono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="contacto" className="form-label">Contacto</label>
          <input
            type="text"
            className="form-control"
            id="contacto"
            value={contacto}
            onChange={(e) => setContacto(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="direccion" className="form-label">Dirección</label>
          <input
            type="text"
            className="form-control"
            id="direccion"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="cuit" className="form-label">CUIT *</label>
          <input
            type="text"
            className="form-control"
            id="cuit"
            value={cuit}
            onChange={handleCuitChange}
            placeholder="XX-XXXXXXXX-X"
            maxLength="13"
            required
            disabled={isSubmitting}
          />
          <div className="form-text">Formato: XX-XXXXXXXX-X</div>
        </div>
        <div className="mb-3">
          <label htmlFor="rubro" className="form-label">Rubro *</label>
          {loadingRubros ? (
            <p>Cargando rubros...</p>
          ) : rubros.length > 0 ? (
            <select
              className="form-select"
              id="rubro"
              value={idRubro}
              onChange={(e) => setIdRubro(parseInt(e.target.value))}
              required
              disabled={isSubmitting}
            >
              {rubros.map(rubro => (
                <option key={rubro.id} value={rubro.id}>
                  {rubro.nombre}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-danger">No se encontraron rubros. Por favor, agregue rubros primero.</p>
          )}
        </div>
        
        {mostrarMensaje && (
        <div
          className={`alert text-center mt-3 ${tipoMensaje === 'success' ? 'alert-success' : 'alert-danger'} show`}
          role="alert"
          style={{ opacity: mostrarMensaje ? 1 : 0, transition: 'opacity 0.5s ease' }}
        >
          {tipoMensaje === 'success' ? '✅' : '❌'} {mensaje}
        </div>
      )}

        <div className="d-flex justify-content-between mt-4">
          <button
            type="submit"
            className="btn btn-success"
            disabled={isSubmitting || loadingRubros}
          >
            {isSubmitting ? 'Creando...' : 'Crear Proveedor'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/proveedores')}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default CrearProveedor;
