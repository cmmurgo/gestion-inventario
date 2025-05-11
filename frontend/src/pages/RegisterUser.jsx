import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function RegisterUser() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
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

  const handleRegister = async () => {
    try {
      const token = localStorage.getItem('token');
      //await axios.post('http://localhost:3001/api/auth/register', {       
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
            email, password, role },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow p-4">
            <h2 className="text-center mb-4">Registrar nuevo usuario</h2>
  
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
  
            <div className="mb-3">
              <select
                className="form-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="user">Usuario</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
  
            {errorMessage && (
              <p className="text-danger text-center">{errorMessage}</p>
            )}
  
            <button
              onClick={handleRegister}
              className="btn btn-primary w-100"
            >
              Registrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  
}

export default RegisterUser;