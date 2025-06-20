import React, { useState } from 'react';
import { crearPromocion } from '../../services/promocionService';
import { useNavigate } from 'react-router-dom';

export default function CrearPromocion() {
  const navigate = useNavigate();
  const [promo, setPromo] = useState({
    nombre: '',
    condiciones: '',
    porcentaje: '',
    fecha_inicio: '',
    fecha_fin: ''
  });

  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [mostrarMensaje, setMostrarMensaje] = useState(false);

  const handleChange = (e) => {
    setPromo({ ...promo, [e.target.name]: e.target.value });
  };

  const handleGuardar = async () => {
    if (!promo.nombre || !promo.porcentaje || !promo.fecha_inicio || !promo.fecha_fin) {
      setMensaje('Completa los campos obligatorios (*)');
      setTipoMensaje('error');
      setMostrarMensaje(true);
      setTimeout(() => setMostrarMensaje(false), 3000);
      return;
    }

    try {
      const datos = {
        ...promo,
        porcentaje: parseInt(promo.porcentaje) || 0
      };
      await crearPromocion(datos);
      setMensaje('Promoción creada exitosamente');
      setTipoMensaje('success');
      setPromo({ nombre: '', condiciones: '', porcentaje: '', fecha_inicio: '', fecha_fin: '' });
    } catch (error) {
      console.error(error);
      setMensaje('Error al crear promoción');
      setTipoMensaje('error');
    }

    setMostrarMensaje(true);
    setTimeout(() => setMostrarMensaje(false), 3000);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h4>CREAR PROMOCIÓN</h4>
      <div style={{ background: '#eee', padding: '2rem', maxWidth: '500px' }}>
        <div className="mb-3">
          <label className="form-label">Nombre*:</label>
          <input
            type="text"
            className="form-control"
            name="nombre"
            value={promo.nombre}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Condiciones:</label>
          <textarea
            className="form-control"
            name="condiciones"
            value={promo.condiciones}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Porcentaje de descuento*:</label>
          <input
            type="number"
            className="form-control"
            name="porcentaje"
            value={promo.porcentaje}
            onChange={handleChange}
            min="1"
            max="100"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Fecha inicio*:</label>
          <input
            type="date"
            className="form-control"
            name="fecha_inicio"
            value={promo.fecha_inicio}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Fecha fin*:</label>
          <input
            type="date"
            className="form-control"
            name="fecha_fin"
            value={promo.fecha_fin}
            onChange={handleChange}
          />
        </div>
      </div>

      <div
        className={`alert text-center mt-3 ${tipoMensaje === 'success' ? 'alert-success' : 'alert-danger'} ${mostrarMensaje ? 'show' : 'd-none'}`}
      >
        {tipoMensaje === 'success' ? '✅' : '❌'} {mensaje}
      </div>

      <div className="d-flex justify-content-between mt-4" style={{ maxWidth: '500px' }}>
        <button className="btn btn-dark" onClick={() => navigate('/promociones')}>Volver</button>
        <button className="btn btn-success" onClick={handleGuardar}>GUARDAR</button>
      </div>
    </div>
  );
}
