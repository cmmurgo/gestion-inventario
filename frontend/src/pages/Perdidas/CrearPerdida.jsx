import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../api';

function CrearPerdida() {
  const navigate = useNavigate();
  const [producto, setProducto] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [fecha, setFecha] = useState('');
  const [motivo, setMotivo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [mostrarMensaje, setMostrarMensaje] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [productos, setProductos] = useState([]);
  const [nombre_producto, setNombreProducto] = useState([]);

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
    
  }, [navigate]);

  const handleGuardar = async () => {
    if (!producto || !cantidad || !fecha || !motivo) {
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

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/perdidas`,
        { id_producto: producto, cantidad, fecha, motivo },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setMensaje('Pérdida registrada con éxito');
        setTipoMensaje('success'); 
      } else {
        setMensaje('Error al registrar la pérdida');
        setTipoMensaje('error');
      }

      setMostrarMensaje(true);
      setTimeout(() => setMostrarMensaje(false), 3000);
    } catch (error) {
      console.error(error);
      const backendMessage = error?.response?.data?.message || 'Error al registrar la pérdida';
      setMensaje(backendMessage);
      setTipoMensaje('error');
      setMostrarMensaje(true);
      setTimeout(() => setMostrarMensaje(false), 3000);
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

      let stockDisponible = parseFloat(res.data.saldo);

      if (isNaN(stockDisponible)) {
        stockDisponible = 0;
      }
      
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
      <h4>REGISTRAR PÉRDIDA:</h4>
      <div style={{ background: '#eee', padding: '2rem', maxWidth: '400px' }}>
        <div className="mb-3">
          <label className="form-label">PRODUCTO:</label>
          <select
              className="form-control"
              value={producto}
              onChange={(e) => {
                const id = e.target.value;
                const productoObj = productos.find((p) => p.id === parseInt(id));
                setProducto(id);
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
          <label className="form-label">CANTIDAD:</label>
          <input
            type="number"
            className="form-control"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
          />
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
          <label className="form-label">MOTIVO:</label>
          <textarea
            className="form-control"
            rows="3"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
          ></textarea>
        </div>
      </div>

      <div
        className={`alert text-center mt-3 ${tipoMensaje === 'success' ? 'alert-success' : 'alert-danger'} ${mostrarMensaje ? 'show' : ''}`}
        role="alert"
        style={{ opacity: mostrarMensaje ? 1 : 0, transition: 'opacity 0.5s ease' }}
      >
        {tipoMensaje === 'success' ? '✅' : '❌'} {mensaje}
      </div>

      <div className="d-flex justify-content-between mt-4" style={{ maxWidth: '400px' }}>
        <button className="btn btn-dark" onClick={() => navigate('/perdidas')}>Volver</button>
        <button className="btn btn-success" onClick={handleGuardar}>GUARDAR</button>
      </div>
     
    </div>
  );
}

export default CrearPerdida;
