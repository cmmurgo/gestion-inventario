import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    setErrorMessage('');
    try {
      const response = await axios.post('http://192.168.100.9:3000/api/auth/login', {
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userRole', response.data.user.role);
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
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Iniciar sesión</h2>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Contraseña"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
              </div>
              {errorMessage && (
                <div className="alert alert-danger py-2 text-center">
                  {errorMessage}
                </div>
              )}
              <button onClick={handleLogin} className="btn btn-primary w-100">
                Entrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
