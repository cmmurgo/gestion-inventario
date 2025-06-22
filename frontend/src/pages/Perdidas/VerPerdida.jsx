import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../api';

function VerPerdida() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [productos, setProductos] = useState([]);
  const [id_producto, setProductoId] = useState('');
  const [fecha, setFecha] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [motivo, setMotivo] = useState('');
  const [nombreProducto, setNombreProducto] = useState('');

  const normalizeFecha = (fecha) => {
    if (!fecha) return '';
    return fecha.split('T')[0];
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const [perdidaRes, productosRes] = await Promise.all([
          axios.get(`${API_URL}/api/perdidas/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/api/inventario/productos`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setProductos(productosRes.data);

        const { id_producto, fecha, cantidad, motivo } = perdidaRes.data;
        setProductoId(id_producto);
        setFecha(normalizeFecha(fecha));
        setCantidad(cantidad);
        setMotivo(motivo);

        const producto = productosRes.data.find((p) => p.id === id_producto);
        setNombreProducto(producto ? producto.nombre : '');
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    };

    fetchData();
  }, [id, navigate]);

  return (
    <div style={{ padding: '2rem' }}>
      <h4>DETALLE DE PÉRDIDA</h4>
      <div style={{ background: '#eee', padding: '2rem', maxWidth: '400px' }}>
        <div className="mb-3">
          <label className="form-label">Producto:</label>
          <input
            type="text"
            className="form-control"
            value={nombreProducto}
            disabled
          />
        </div>

        <div className="mb-3">
          <label className="form-label">FECHA:</label>
          <input
            type="date"
            className="form-control"
            value={fecha}
            disabled
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Cantidad:</label>
          <input
            type="number"
            className="form-control"
            value={cantidad}
            disabled
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Motivo:</label>
          <input
            type="text"
            className="form-control"
            value={motivo}
            disabled
          />
        </div>
      </div>

      <div className="d-flex justify-content-end mt-4" style={{ maxWidth: '400px' }}>
        <button className="btn btn-dark" onClick={() => navigate('/perdidas')}>Volver</button>
      </div>
    </div>
  );
}

export default VerPerdida;
