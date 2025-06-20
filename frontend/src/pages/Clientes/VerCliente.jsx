import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../api';

function VerCliente() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [cuit_cuil, setCuitCuil] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');

    if (!token) {
      navigate('/');
    } else {
      setUserRole(role);
      // if (role !== 'admin') {
      //   navigate('/home');
      //   return;
      // }

      if (id) {
        axios.get(`${API_URL}/api/clientes/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then(response => {
            const { nombre, apellido, email, telefono, direccion, cuit_cuil } = response.data;
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
    }
  }, [navigate, id]);

  return (
    <div style={{ padding: '2rem' }}>
      <h4>VER CLIENTE</h4>
      <div style={{ background: '#eee', padding: '2rem', maxWidth: '400px' }}>
        <div className="mb-3">
          <label className="form-label">NOMBRE:</label>
          <div className="form-control bg-light">{nombre}</div>
        </div>

        <div className="mb-3">
          <label className="form-label">APELLIDO:</label>
          <div className="form-control bg-light">{apellido}</div>
        </div>

        <div className="mb-3">
          <label className="form-label">EMAIL:</label>
          <div className="form-control bg-light">{email}</div>
        </div>

        <div className="mb-3">
          <label className="form-label">TELÉFONO:</label>
          <div className="form-control bg-light">{telefono}</div>
        </div>

        <div className="mb-3">
          <label className="form-label">DIRECCIÓN:</label>
          <div className="form-control bg-light">{direccion}</div>
        </div>

        <div className="mb-3">
          <label className="form-label">CUIT/CUIL:</label>
          <div className="form-control bg-light">{cuit_cuil}</div>
        </div>

      </div>

      {errorMessage && (
        <p className="text-danger mt-2">{errorMessage}</p>
      )}

      <div className="mt-4" style={{ maxWidth: '400px' }}>
        <button className="btn btn-dark" onClick={() => navigate('/clientes')}>Volver</button>
      </div>
    </div>
  );
}

export default VerCliente;
