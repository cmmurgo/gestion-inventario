import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../api';

function EditPerdida() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [productos, setProductos] = useState([]);
  const [id_producto, setProductoId] = useState('');
  const [fecha, setFecha] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [motivo, setMotivo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [mostrarMensaje, setMostrarMensaje] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [nombre_producto, setNombreProducto] = useState('');
  const [producto, setProducto] = useState('');

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

  // Sincronizar producto y nombre cuando se cargan productos y pérdida
  useEffect(() => {
    if (id_producto && productos.length > 0) {
      setProducto(id_producto);
      const productoObj = productos.find(p => p.id === parseInt(id_producto));
      setNombreProducto(productoObj?.nombre || '');
    }
  }, [id_producto, productos]);

  const handleGuardar = async () => {
    if (!id_producto || !cantidad || !fecha || !motivo) {
      setMensaje('Todos los campos son obligatorios');
      setTipoMensaje('error');
      setMostrarMensaje(true);
      setTimeout(() => setMostrarMensaje(false), 3000);
      return;
    }

    const erroresStock = await verificarStockSuficiente();
    if (erroresStock.length > 0) {
      const mensajeError = erroresStock.map(e =>
        e.error
          ? e.error
          : `Producto: ${e.nombre} - Solicitado: ${e.solicitado}, Disponible: ${e.disponible}.`
      ).join('\n');

      setMensaje(`Stock insuficiente:\n${mensajeError}`);
      setTipoMensaje('error');
      setMostrarMensaje(true);
      setTimeout(() => setMostrarMensaje(false), 5000);
      return;
    }

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

  const verificarStockSuficiente = async () => {
    const token = localStorage.getItem('token');

    try {
      const errores = [];
      const idProducto = producto;
      const cantidadSolicitada = parseFloat(cantidad);

      const res = await axios.get(`${API_URL}/api/movimientos/saldo/${idProducto}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const stockDisponible = parseFloat(res.data.saldo);

      if (cantidadSolicitada > stockDisponible) {
        errores.push({
          nombre: nombre_producto,
          solicitado: cantidadSolicitada,
          disponible: stockDisponible
        });
      }

      return errores;

    } catch (error) {
      console.error("Error al verificar stock:", error);
      return [{ error: "Error al verificar el stock" }];
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
            onChange={(e) => {
              const id = e.target.value;
              const productoObj = productos.find((p) => p.id === parseInt(id));
              setProducto(id);
              setProductoId(id);
              setNombreProducto(productoObj?.nombre || '');
            }}
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
