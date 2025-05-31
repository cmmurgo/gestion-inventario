import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../api';

function VerDetalleVenta() {
  const navigate = useNavigate();
  const { ventaId, detalleId } = useParams();

  const [detalleVenta, setDetalleVenta] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/');
    } else if (detalleId) {
      axios.get(`${API_URL}/api/ventas/detalle/${detalleId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        setDetalleVenta(response.data);    
      })
      .catch(err => {
        console.error(err);
        setErrorMessage('Error al cargar los datos de la venta');
      });
    }
  }, [navigate, detalleId]);

  if (!detalleVenta) {
    return <div style={{ padding: '2rem' }}>Cargando venta...</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h4>DETALLE DE LA VENTA</h4>
      <div style={{ background: '#eee', padding: '2rem', maxWidth: '500px' }}>
        <div className="mb-3">
          <label className="form-label">ID:</label>
          <div className="form-control bg-light">{detalleVenta[0].id}</div>
        </div>

        <div className="mb-3">
          <label className="form-label">PRODUCTO:</label>
          <div className="form-control bg-light">{detalleVenta[0].id_producto}</div>
        </div>

        <div className="mb-3">
          <label className="form-label">DESCRIPCIÓN:</label>
          <div className="form-control bg-light">{detalleVenta[0].descripcion}</div>
        </div>

        <div className="mb-3">
          <label className="form-label">CANTIDAD:</label>
          <div className="form-control bg-light">{detalleVenta[0].cantidad}</div>
        </div>

        <div className="mb-3">
          <label className="form-label">PRECIO VENTA:</label>
          <div className="form-control bg-light">{detalleVenta[0].precio_venta}</div>
        </div>
     
      </div>

      {errorMessage && (
        <p className="text-danger mt-2">{errorMessage}</p>
      )}

      <div className="mt-4" style={{ maxWidth: '500px' }}>
        <button
          className="btn btn-dark"
          onClick={() => navigate(`/ventas/editar/${ventaId}`)}
        >
          Volver
        </button>
      </div>
    </div>
  );
}

export default VerDetalleVenta;
