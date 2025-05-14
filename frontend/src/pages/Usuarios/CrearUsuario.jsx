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
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [mostrarMensaje, setMostrarMensaje] = useState(false);

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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setMensaje('Ingrese un email válido');
        setTipoMensaje('error');
        setMostrarMensaje(true);
        setTimeout(() => setMostrarMensaje(false), 3000);
        return;
      }
    
      if (password.length < 8) {
        setMensaje('La contraseña debe tener al menos 8 caracteres');
        setTipoMensaje('error');
        setMostrarMensaje(true);
        setTimeout(() => setMostrarMensaje(false), 3000);
        return;
      }
      
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/usuarios`,
        { nombre, email, password, rol },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );    
            
      if (response.status === 201) {
        setMensaje('Usuario creado con éxito');
        setTipoMensaje('success');
      } else {
        setMensaje('Error al crear el usuario');
        setTipoMensaje('error');
      }

      setMostrarMensaje(true);
      setTimeout(() => setMostrarMensaje(false), 3000);

      setNombre('');
      setEmail('');
      setPassword('');
      setRole('user');
      setErrorMessage('');
    } catch (error) {
      console.error(error);
      const backendMessage = error?.response?.data?.message;   
      setMensaje(backendMessage);
      setTipoMensaje('error');
      setMostrarMensaje(true);
      setTimeout(() => setMostrarMensaje(false), 3000);
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
          <select
            className="form-control"
            value={rol}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">Usuario</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
      </div>
    
      <div
        className={`alert text-center mt-3 ${tipoMensaje === 'success' ? 'alert-success' : 'alert-danger'} ${mostrarMensaje ? 'show' : ''}`}
        role="alert"
        style={{ opacity: mostrarMensaje ? 1 : 0, transition: 'opacity 0.5s ease' }} // Añadir transición de opacidad
      >
        {tipoMensaje === 'success' ? '✅' : '❌'} {mensaje}
      </div>


      <div className="d-flex justify-content-between mt-4" style={{ maxWidth: '400px' }}>
        <button className="btn btn-dark" onClick={() => navigate('/usuarios')}>Volver</button>
        <button className="btn btn-success" onClick={handleGuardar}>GUARDAR</button>
      </div>
    </div>
  );
}

export default RegisterUser;
