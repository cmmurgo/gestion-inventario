import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../api';

function RegisterUser() {
  const navigate = useNavigate();
  const { id } = useParams(); // Si existe, es edición

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRole] = useState('user');
  const [mensaje, setMensaje] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [mostrarMensaje, setMostrarMensaje] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [userIdLogueado, setUserIdLogueado] = useState('');


  // Validar login y cargar usuario si es edición
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');
    setUserIdLogueado(userId);

    if (!token) {
      navigate('/');
    } else {
      setUserRole(role);
      // if (role !== 'admin') {
      //   navigate('/home');
      // }

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

    if (userRole !== 'admin' && userIdLogueado !== id) {
      setMensaje('No tiene permisos para editar usuarios');
      setTipoMensaje('error');
      setMostrarMensaje(true);
      setTimeout(() => setMostrarMensaje(false), 3000);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const userData = { nombre, email, password, rol };
     
        await axios.put(`${API_URL}/api/usuarios/${id}`, userData, {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });    

      setNombre('');
      setEmail('');
      setPassword('');
      setRole('user');
      setErrorMessage('');
      navigate('/usuarios');
    } catch (error) {
      console.error(error);
      setErrorMessage('Error al guardar usuario');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h4>EDITAR USUARIO</h4>
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
            disabled={userRole !== 'admin'}
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
        <button className="btn btn-success" onClick={handleGuardar}>
          {id ? 'GUARDAR CAMBIOS' : 'GUARDAR'}
        </button>
      </div>
    </div>
  );
}

export default RegisterUser;
