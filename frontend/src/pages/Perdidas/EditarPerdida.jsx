import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../api';

function EditPerdida() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [productos, setProductos] = useState([]); // Estado para productos
  const [id_producto, setProductoId] = useState('');
  const [fecha, setFecha] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [motivo, setMotivo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [mostrarMensaje, setMostrarMensaje] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

    const normalizeFecha = (fecha) => {
      if (!fecha) return '';
      return fecha.split('T')[0]; // Esto devuelve "2025-05-25"
    };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    if (id) {
      axios.get(`${API_URL}/api/perdidas/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        const { id_producto, fecha, cantidad, motivo } = res.data;
        setProductoId(id_producto);
        setFecha(normalizeFecha(fecha));
        setCantidad(cantidad);
        setMotivo(motivo);
      })
      .catch(err => {
        console.error(err);
        setMensaje('Error al cargar la pérdida');
        setTipoMensaje('error');
        setMostrarMensaje(true);
      });
    }

    const fetchProductos = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/api/inventario/productos`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProductos(response.data);   
      } catch (error) {
        console.error('Error al cargar productos:', error);
      }
    };
    
    fetchProductos();
    
  }, [id, navigate]);

  const handleGuardar = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const data = { id_producto, fecha, cantidad, motivo };

    try {
      await axios.put(`${API_URL}/api/perdidas/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMensaje('Pérdida actualizada exitosamente');
      setTipoMensaje('success');
      setMostrarMensaje(true);
      setTimeout(() => {
        setMostrarMensaje(false);
      }, 2000);
    } catch (err) {
      console.error(err);
      setMensaje('Error al actualizar la pérdida');
      setTipoMensaje('error');
      setMostrarMensaje(true);
      setErrorMessage('Error al guardar pérdida');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h4>EDITAR PÉRDIDA</h4>
      <div style={{ background: '#eee', padding: '2rem', maxWidth: '400px' }}>
        <div className="mb-3">
          <label className="form-label">Producto:</label>
          <select
            className="form-control"
            value={id_producto}                    
            onChange={(e) => setProductoId(e.target.value)} 
          >
            <option value="">Seleccionar producto</option>
            {productos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">FECHA:</label>
          <input
            type="date"
            className="form-control"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Cantidad:</label>
          <input
            type="number"
            className="form-control"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Motivo:</label>
          <input
            type="text"
            className="form-control"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
          />
        </div>
      </div>

      {errorMessage && (
        <p className="text-danger mt-2">{errorMessage}</p>
      )}

      <div className={`alert text-center mt-3 ${tipoMensaje === 'success' ? 'alert-success' : 'alert-danger'} ${mostrarMensaje ? 'show' : ''}`}>
        {tipoMensaje === 'success' ? '✅' : '❌'} {mensaje}
      </div>

      <div className="d-flex justify-content-between mt-4" style={{ maxWidth: '400px' }}>
        <button className="btn btn-dark" onClick={() => navigate('/perdidas')}>Volver</button>
        <button className="btn btn-success" onClick={handleGuardar}>
          {id ? 'GUARDAR CAMBIOS' : 'GUARDAR'}
        </button>
      </div>
    </div>
  );
}

export default EditPerdida;
