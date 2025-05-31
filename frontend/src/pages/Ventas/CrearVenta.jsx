import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../api';

function CrearVenta() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [fecha, setFecha] = useState('');
  const [idCliente, setIdCliente] = useState('');
  const [detalles, setDetalles] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [mostrarMensaje, setMostrarMensaje] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const [resClientes, resProductos] = await Promise.all([
          axios.get(`${API_URL}/api/clientes`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/api/inventario/productos`, { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setClientes(resClientes.data);
        setProductos(resProductos.data);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };

    fetchData();
  }, [navigate]);

  const agregarDetalle = () => {
    setDetalles([...detalles, { id_producto: '', cantidad: '' }]);
  };

  const actualizarDetalle = (index, campo, valor) => {
    const nuevosDetalles = [...detalles];
    nuevosDetalles[index][campo] = valor;
    setDetalles(nuevosDetalles);
  };

  const eliminarDetalle = (index) => {
    const nuevosDetalles = detalles.filter((_, i) => i !== index);
    setDetalles(nuevosDetalles);
  };

  const handleGuardar = async () => {
    if (!fecha || !idCliente || detalles.length === 0 || detalles.some(d => !d.id_producto || !d.cantidad)) {
      console.log(fecha);
      console.log(idCliente);
      console.log(detalles.length);
      console.log(d.id_producto);
      console.log(d.cantidad);
   
      setMensaje('Todos los campos son obligatorios');
      setTipoMensaje('error');
      setMostrarMensaje(true);
      setTimeout(() => setMostrarMensaje(false), 3000);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/ventas`,
        { fecha, id_cliente: idCliente, detalles },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        setMensaje('Venta registrada con éxito');
        setTipoMensaje('success');
        setFecha('');
        setIdCliente('');
        setDetalles([]);
      } else {
        setMensaje('Error al registrar la venta');
        setTipoMensaje('error');
      }

      setMostrarMensaje(true);
      setTimeout(() => setMostrarMensaje(false), 3000);
    } catch (error) {
      console.error(error);
      const backendMessage = error?.response?.data?.message || 'Error al registrar la venta';
      setMensaje(backendMessage);
      setTipoMensaje('error');
      setMostrarMensaje(true);
      setTimeout(() => setMostrarMensaje(false), 3000);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h4>REGISTRAR VENTA:</h4>
      <div style={{ background: '#eee', padding: '2rem', maxWidth: '500px' }}>
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
          <label className="form-label">CLIENTE:</label>
          <select className="form-control" value={idCliente} onChange={(e) => setIdCliente(e.target.value)}>
            <option value="">Seleccionar cliente</option>
            {clientes.map(c => (
              <option key={c.id} value={c.id}>{c.cliente_nombre_completo}</option>
            ))}
          </select>
        </div>

        <hr />
        <h5>DETALLES DE PRODUCTOS</h5>
        {detalles.map((detalle, index) => (
          <div key={index} className="mb-3">
            <div className="d-flex gap-2">
              <select
                className="form-control"
                value={detalle.id_producto}
                onChange={(e) => actualizarDetalle(index, 'id_producto', e.target.value)}
              >
                <option value="">Producto</option>
                {productos.map(p => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Cantidad"
                className="form-control"
                value={detalle.cantidad}
                onChange={(e) => actualizarDetalle(index, 'cantidad', e.target.value)}
              />
              <button className="btn btn-danger" onClick={() => eliminarDetalle(index)}>X</button>
            </div>
          </div>
        ))}
        <button className="btn btn-secondary mb-3" onClick={agregarDetalle}>+ Agregar producto</button>
      </div>

      <div
        className={`alert text-center mt-3 ${tipoMensaje === 'success' ? 'alert-success' : 'alert-danger'} ${mostrarMensaje ? 'show' : ''}`}
        role="alert"
        style={{ opacity: mostrarMensaje ? 1 : 0, transition: 'opacity 0.5s ease' }}
      >
        {tipoMensaje === 'success' ? '✅' : '❌'} {mensaje}
      </div>

      <div className="d-flex justify-content-between mt-4" style={{ maxWidth: '500px' }}>
        <button className="btn btn-dark" onClick={() => navigate('/ventas')}>Volver</button>
        <button className="btn btn-success" onClick={handleGuardar}>GUARDAR</button>
      </div>
    </div>
  );
}

export default CrearVenta;
