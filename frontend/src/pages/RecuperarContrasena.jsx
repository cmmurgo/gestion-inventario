import { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../api';

export default function RecuperarContrasena() {
    const [email, setEmail] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
  
    const handleSubmit = async () => {
      setMensaje('');
      setError('');
      try {
        const response = await axios.post(`${API_URL}/api/auth/recuperar`, { email });
        setMensaje(response.data.message);
      } catch (err) {
        setError(err.response?.data?.error || 'No se pudo procesar la solicitud');
      }
    };
  
    return (
      <>
        <h4>Ingrese email para recuperar contraseña:</h4>
        <input
          type="email"
          className="form-control mt-3"
          placeholder="Ingrese su email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="btn btn-primary mt-3 w-100" onClick={handleSubmit}>
          Enviar contraseña nueva
        </button>
  
        {mensaje && <div className="text-success mt-2">{mensaje}</div>}
        {error && <div className="text-danger mt-2">{error}</div>}
     
      </>
    );
  }
