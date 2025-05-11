import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../api';

function RegisterUser() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRole] = useState('user');
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
    }
  }, [navigate]);

  const handleGuardar = async () => {
    try {
      const token = localStorage.getItem('token');       
      await axios.post(`${API_URL}/api/usuarios`, {
            nombre, email, password, rol },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNombre('');
      setEmail('');
      setPassword('');
      setRole('user');
      setErrorMessage('');
    } catch (error) {
      console.error(error);
      setErrorMessage('Error al registrar usuario');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h4>CREAR USUARIO:</h4>
      <div style={{ background: '#eee', padding: '2rem', maxWidth: '400px' }}>
        <div className="mb-3">
          <label className="form-label">NOMBRE DE USUARIO:</label>
          <input
            type="text"
            className="form-control"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">EMAIL:</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">CLAVE:</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">ROL:</label>
          <input
            type="text"
            className="form-control"
            value={rol}
            readOnly
          />
        </div>
      </div>

      {errorMessage && (
        <p className="text-danger mt-2">{errorMessage}</p>
      )}

      <div className="d-flex justify-content-between mt-4" style={{ maxWidth: '400px' }}>
        <button className="btn btn-dark" onClick={() => navigate('/home')}>Volver</button>
        <button className="btn btn-success" onClick={handleGuardar}>GUARDAR</button>
      </div>
    </div>
  );
}

export default RegisterUser;
