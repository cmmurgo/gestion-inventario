import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/logo.png';
import { useUser } from '../context/UserContext.jsx';
import { API_URL } from '../api';
import RecuperarContrasena from './RecuperarContrasena';

function Login() {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);

  const handleLogin = async () => {
    setErrorMessage('');
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userRole', response.data.user.role);
        localStorage.setItem('userId', response.data.user.id);
        setUser(response.data.user);
        navigate('/home');
      } else {
        setErrorMessage('Usuario o contraseña incorrectos');
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setErrorMessage('Usuario o contraseña incorrectos');
      } else {
        setErrorMessage('Error al conectar con el servidor');
      }
    }
  };

  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: '#e0e0e0' }}>
      <div className="bg-white p-4 rounded-4 shadow" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="text-center mb-4">
          <div style={{ backgroundColor: '#6a0dad', padding: '20px' }} className="d-flex align-items-center justify-content-center">
            <img src={logo} alt="Logo" style={{ height: '80px', marginRight: '20px' }} />
            <div>
              <h5 className="text-white mb-0">SISTEMA DE GESTIÓN</h5>
              <h5 className="text-white">DE INVENTARIO</h5>
            </div>
          </div>
        </div>

        <div className="mb-3">
          <input
            type="text"
            className="form-control bg-light border-0"
            placeholder="usuario"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className="mb-3">
          <input
            type="password"
            className="form-control bg-light border-0"
            placeholder="contraseña"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        {errorMessage && (
          <p className="text-danger mt-2">{errorMessage}</p>
        )}

        <p className="mt-3 text-center">
          <a href="#" onClick={(e) => { e.preventDefault(); setMostrarModal(true); }}>
            ¿Olvidó su contraseña?
          </a>
        </p>

        <button
          onClick={handleLogin}
          className="btn w-100 text-white"
          style={{ backgroundColor: '#7209b7' }}
        >
          Ingresar
        </button>
      </div>

      {/* Modal */}
      {mostrarModal && (
        <>
          <div className="modal show fade d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Recuperar contraseña</h5>
                  <button type="button" className="btn-close" onClick={() => setMostrarModal(false)}></button>
                </div>
                <div className="modal-body">
                  <RecuperarContrasena />
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setMostrarModal(false)}>
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
}

export default Login;
