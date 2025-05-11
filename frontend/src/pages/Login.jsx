import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/logo.png';
import { useUser } from '../context/UserContext.jsx';

function Login() {
  const { setUser } = useUser()
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    setErrorMessage('');
    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', {
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userRole', response.data.user.role);
        setUser(response.data.user)  
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

        <div className="mb-3 text-center text-muted" style={{ fontSize: '0.9rem' }}>
          ¿Olvidó su contraseña?
        </div>

        {errorMessage && (
          <div className="alert alert-danger py-2 text-center">
            {errorMessage}
          </div>
        )}

        <button
          onClick={handleLogin}
          className="btn w-100 text-white"
          style={{ backgroundColor: '#7209b7' }}
        >
          Ingresar
        </button>
      </div>
    </div>
  );
}

export default Login;
