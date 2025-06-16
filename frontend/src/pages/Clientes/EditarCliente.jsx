import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../api';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';

function RegisterCliente() {
  const navigate = useNavigate();
  const { id } = useParams(); // Si hay ID, es edición

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [cuit_cuil, setCuitCuil] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [mostrarMensaje, setMostrarMensaje] = useState(false);
  const modalRef = useRef(null);

  // Validar token y cargar cliente si hay ID
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');

    if (!token) {
      navigate('/');
      return;
    }

    // if (role !== 'admin') {
    //   navigate('/home');
    //   return;
    // }

    if (id) {
      axios.get(`${API_URL}/api/clientes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        const { nombre, apellido, email, telefono, direccion, cuit_cuil } = res.data;
        setNombre(nombre);
        setApellido(apellido);
        setEmail(email);
        setTelefono(telefono);
        setDireccion(direccion);
        setCuitCuil(cuit_cuil);
      })
      .catch(err => {
        console.error(err);
        setErrorMessage('Error al cargar cliente');
      });
    }
  }, [navigate, id]);

  const handleGuardar = async () => {
    const token = localStorage.getItem('token');
    const clienteData = { nombre, apellido, email, telefono, direccion, cuit_cuil };

    try {
      if (id) {
        // Modo edición
        await axios.put(`${API_URL}/api/clientes/${id}`, clienteData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // Modo creación
        await axios.post(`${API_URL}/api/clientes`, clienteData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      setMostrarMensaje(true);
      setTimeout(() => setMostrarMensaje(false), 3000);
      const modal = bootstrap.Modal.getInstance(modalRef.current);
      if (modal) modal.hide();
      setMensaje('Registro exitoso');
      setTipoMensaje('success');
     
    } catch (error) {
      console.error(error);
      setErrorMessage('Error al guardar cliente');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h4>{id ? 'EDITAR CLIENTE' : 'REGISTRAR CLIENTE'}</h4>
      <div style={{ background: '#eee', padding: '2rem', maxWidth: '400px' }}>
        <div className="mb-3">
          <label className="form-label">Nombre:</label>
          <input
            type="text"
            className="form-control"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">APELLIDO:</label>
          <input
            type="apellido"
            className="form-control"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email:</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Teléfono:</label>
          <input
            type="text"
            className="form-control"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Dirección:</label>
          <input
            type="text"
            className="form-control"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">CUIT/CUIL:</label>
          <input
            type="text"
            className="form-control"
            value={cuit_cuil}
            onChange={(e) => setCuitCuil(e.target.value)}
          />
        </div>        
      </div>

      {errorMessage && (
        <p className="text-danger mt-2">{errorMessage}</p>
      )}

      <div className={`alert text-center mt-3 ${tipoMensaje === 'success' ? 'alert-success' : 'alert-danger'} ${mostrarMensaje ? 'show' : ''}`}>
        {tipoMensaje === 'success' ? '✅' : '❌'} {mensaje}
      </div>

      <div className="d-flex justify-content-between mt-4" style={{ maxWidth: '400px' }}>
        <button className="btn btn-dark" onClick={() => navigate('/clientes')}>Volver</button>
        <button className="btn btn-success" onClick={handleGuardar}>
          {id ? 'GUARDAR CAMBIOS' : 'GUARDAR'}
        </button>
      </div>
    </div>
  );
}

export default RegisterCliente;
