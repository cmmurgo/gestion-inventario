import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPromocionById } from '../../services/promocionService';

export default function VerPromocion() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [promo, setPromo] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    getPromocionById(id)
      .then(res => setPromo(res.data))
      .catch(err => {
        console.error(err);
        setErrorMessage('Error al cargar promoción');
      });
  }, [id]);

  if (!promo) {
    return (
      <div className="container py-4">
        {errorMessage ? (
          <p className="text-danger">{errorMessage}</p>
        ) : (
          <p>Cargando...</p>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h4>VER PROMOCIÓN</h4>
      <div style={{ background: '#eee', padding: '2rem', maxWidth: '500px' }}>
        <div className="mb-3">
          <label className="form-label">Nombre:</label>
          <div className="form-control bg-light">{promo.nombre}</div>
        </div>
        <div className="mb-3">
          <label className="form-label">Condiciones:</label>
          <div className="form-control bg-light">{promo.condiciones || 'No especificadas'}</div>
        </div>
        <div className="mb-3">
          <label className="form-label">Porcentaje de descuento:</label>
          <div className="form-control bg-light">{promo.porcentaje}%</div>
        </div>
        <div className="mb-3">
          <label className="form-label">Fecha inicio:</label>
          <div className="form-control bg-light">{new Date(promo.fecha_inicio).toLocaleDateString('es-AR')}</div>
        </div>
        <div className="mb-3">
          <label className="form-label">Fecha fin:</label>
          <div className="form-control bg-light">{new Date(promo.fecha_fin).toLocaleDateString('es-AR')}</div>
        </div>
      </div>

      <div className="mt-4" style={{ maxWidth: '500px' }}>
        <button className="btn btn-dark" onClick={() => navigate('/promociones')}>Volver</button>
      </div>
    </div>
  );
}
