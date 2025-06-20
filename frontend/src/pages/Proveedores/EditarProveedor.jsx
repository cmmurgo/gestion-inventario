// src/pages/Proveedores/EditarProveedor.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProveedorById, actualizarProveedor } from '../../services/proveedorService';
import { getRubros } from '../../services/rubroService';
import { getToken } from '../../services/authService';
import '../../App.css';

function EditarProveedor() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [contacto, setContacto] = useState('');
  const [direccion, setDireccion] = useState('');
  const [cuit, setCuit] = useState('');
  const [idRubro, setIdRubro] = useState('');
  const [rubros, setRubros] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingData, setLoadingData] = useState(true);
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

    const fetchData = async () => {
      try {
        const rubrosResponse = await getRubros();
        setRubros(rubrosResponse.data);

        if (id) {
          const proveedorResponse = await getProveedorById(id);
          const { nombre, email, telefono, contacto, direccion, cuit, id_rubro, fecha_baja } = proveedorResponse.data;

          // Check if supplier is inactive
          if (fecha_baja) {
            setErrorMessage('No se puede editar un proveedor inactivo.');
            setLoadingData(false);
            return;
          }

          setNombre(nombre);
          setEmail(email);
          setTelefono(telefono);
          setContacto(contacto);
          setDireccion(direccion);
          setCuit(cuit);
          setIdRubro(id_rubro);
        }
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setErrorMessage('Error al cargar los datos del proveedor o rubros.');
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [navigate, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await actualizarProveedor(id, {
        nombre,
        email,
        telefono,
        contacto,
        direccion,
        cuit,
        id_rubro: idRubro,
      });
      navigate('/proveedores');
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage('Error al actualizar proveedor.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCuit = (value) => {
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 10) {
      return `${numbers.slice(0, 2)}-${numbers.slice(2)}`;
    } else {
      return `${numbers.slice(0, 2)}-${numbers.slice(2, 10)}-${numbers.slice(10, 11)}`;
    }
  };

  const handleCuitChange = (e) => {
    const formatted = formatCuit(e.target.value);
    setCuit(formatted);
  };

  if (loadingData) {
    return <div className="container mt-4">Cargando datos del proveedor...</div>;
  }

  if (errorMessage && errorMessage.includes('inactivo')) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning" role="alert">
          {errorMessage}
        </div>
        <button className="btn btn-secondary" onClick={() => navigate('/proveedores')}>
          Volver al listado
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h4 className="mb-4">EDITAR PROVEEDOR</h4>
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
          {rubros.length > 0 ? (
            <select
              className="form-select"
              id="rubro"
              value={idRubro}
              onChange={(e) => setIdRubro(e.target.value)}
              required
              disabled={isSubmitting}
            >
              <option value="">Seleccione un rubro</option>
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

        {errorMessage && (
          <div className="alert alert-danger mt-3" role="alert">
            {errorMessage}
          </div>
        )}

        <div className="d-flex justify-content-between mt-4">
          <button 
            type="submit" 
            className="btn btn-warning"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Actualizando...' : 'Actualizar Proveedor'}
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

export default EditarProveedor;