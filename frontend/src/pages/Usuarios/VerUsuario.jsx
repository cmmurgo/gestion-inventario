import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../api';

function VerUsuario() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [rol, setRole] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');

    if (!token) {
      navigate('/');
    } else {
      setUserRole(role);
      if (role !== 'admin') {
        navigate('/home');
      }

      if (id) {
        axios.get(`${API_URL}/api/usuarios/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).then(response => {
          const { nombre, email, rol } = response.data;
          setNombre(nombre);
          setEmail(email);
          setRole(rol);
        }).catch(err => {
          console.error(err);
          setErrorMessage('Error al cargar usuario');
        });
      }
    }
  }, [navigate, id]);

  return (
    <div style={{ padding: '2rem' }}>
      <h4>VER USUARIO</h4>
      <div style={{ background: '#eee', padding: '2rem', maxWidth: '400px' }}>
        <div className="mb-3">
          <label className="form-label">NOMBRE DE USUARIO:</label>
          <div className="form-control bg-light">{nombre}</div>
        </div>

        <div className="mb-3">
          <label className="form-label">EMAIL:</label>
          <div className="form-control bg-light">{email}</div>
        </div>

        <div className="mb-3">
          <label className="form-label">ROL:</label>
          <div className="form-control bg-light">{rol}</div>
        </div>
      </div>

      {errorMessage && (
        <p className="text-danger mt-2">{errorMessage}</p>
      )}

      <div className="mt-4" style={{ maxWidth: '400px' }}>
        <button className="btn btn-dark" onClick={() => navigate('/usuarios')}>Volver</button>
      </div>
    </div>
  );
}

export default VerUsuario;
