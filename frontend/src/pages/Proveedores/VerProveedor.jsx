import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../api';

function VerProveedor() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [proveedor, setProveedor] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [mostrarMensaje, setMostrarMensaje] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    axios.get(`${API_URL}/api/proveedores/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => setProveedor(res.data))
      .catch(err => {
        console.error(err);
        setMensaje('Error al cargar proveedor');
        setTipoMensaje('error');
        setMostrarMensaje(true);
      });
  }, [navigate, id]);

  return (
    <div style={{ padding: '2rem' }}>
      <h4>DETALLES DEL PROVEEDOR</h4>
      {proveedor ? (
        <div style={{ background: '#eee', padding: '2rem', maxWidth: '400px' }}>
          <p><strong>Nombre:</strong> {proveedor.nombre}</p>
          <p><strong>Email:</strong> {proveedor.email}</p>
          <p><strong>Teléfono:</strong> {proveedor.telefono}</p>
          <p><strong>Contacto:</strong> {proveedor.contacto}</p>
          <p><strong>Dirección:</strong> {proveedor.direccion}</p>
          <p><strong>CUIT:</strong> {proveedor.cuit}</p>
          <p><strong>Rubro:</strong> {proveedor.rubro}</p>
        </div>
      ) : (
        <p>Cargando proveedor...</p>
      )}

      <div className={`alert text-center mt-3 ${tipoMensaje === 'success' ? 'alert-success' : 'alert-danger'} ${mostrarMensaje ? 'show' : ''}`}>
        {tipoMensaje === 'success' ? '✅' : '❌'} {mensaje}
      </div>

      <div className="d-flex justify-content-between mt-4" style={{ maxWidth: '400px' }}>
        <button className="btn btn-dark" onClick={() => navigate('/proveedores')}>Volver</button>
      </div>
    </div>
  );
}

export default VerProveedor;