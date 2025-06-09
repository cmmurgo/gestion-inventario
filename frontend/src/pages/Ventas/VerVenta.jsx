import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../api';
import DetalleProductos from './DetalleProductos';
import { FaEye } from 'react-icons/fa';

function VerVenta() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [fecha, setFecha] = useState('');
  const [idCliente, setIdCliente] = useState('');
  const [detalles, setDetalles] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [mostrarMensaje, setMostrarMensaje] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [modalProductoVisible, setModalProductoVisible] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    const cargarDatos = async () => {
      try {
        const [resVenta, resClientes, resProductos] = await Promise.all([
          axios.get(`${API_URL}/api/ventas/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/api/clientes`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/api/inventario/productos`, { headers: { Authorization: `Bearer ${token}` } })
       
        ]);
      
        setClientes(resClientes.data);
        setProductos(resProductos.data);
        setFecha(resVenta.data.fecha.split('T')[0]);
        setIdCliente(resVenta.data.id_cliente);
        setDetalles(resVenta.data.detalles);  
      
      } catch (error) {
        console.error('Error al cargar los datos:', error);
        alert('Error al cargar los datos de la venta.');
      }
    };

    cargarDatos();
  }, [id, navigate]);

  useEffect(() => {
    calcularTotal(detalles);
  }, [detalles]);

  const calcularTotal = (detalles) => {
    const totalCalculado = detalles.reduce((acc, item) => {
      const cantidad = parseFloat(item.cantidad) || 0;
      const precio = parseFloat(item.precio_unitario || item.precio_venta || 0); // ajustá según tu modelo
      return acc + cantidad * precio;
    }, 0);
    setTotal(totalCalculado);
  };

  const abrirModalCliente = async () => {
    if (!idCliente) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/api/clientes/${idCliente}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClienteSeleccionado(res.data);
      setModalVisible(true);
    } catch (error) {
      console.error('Error al obtener datos del cliente:', error);
    }
  };

  const abrirModalProducto = async (idProducto) => {
    if (!idProducto) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/api/inventario/productos/${idProducto}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProductoSeleccionado(res.data);
      setModalProductoVisible(true);
    } catch (error) {
      console.error('Error al obtener datos del producto:', error);
    }
  };


  return (
    <div style={{ padding: '2rem' }}>
      <h4>VER VENTA: #{id} </h4>
      <div style={{ background: '#eee', padding: '2rem' }}>
        <div className="mb-3 d-flex justify-content-between" style={{ gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <label className="form-label">FECHA:</label>
            <input
              type="date"
              className="form-control"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              disabled
            />
          </div>

          <div style={{ flex: 2 }}>
            <label className="form-label">CLIENTE:</label>
            <div className="d-flex align-items-center gap-2">
              <select
                className="form-control"
                value={idCliente}
                onChange={(e) => setIdCliente(e.target.value)}
                disabled
              >
                <option value="">Seleccionar cliente</option>
                {clientes.map(c => (
                  <option key={c.id} value={c.id}>{c.cliente_nombre_completo}</option>
                ))}
              </select>
              {idCliente && (
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={abrirModalCliente}
                  title="Ver datos del cliente"
                >
                  <FaEye />
                </button>
              )}
            </div>
          </div>
        </div>

        <hr />
        <DetalleProductos
          productos={productos}
          detalles={detalles}
          setDetalles={setDetalles}
          abrirModalProducto={abrirModalProducto}
          esEdicion={true}
        />

      <div className="mt-3 text-end">
        <h5>Total: ${total.toFixed(2)}</h5>
      </div>

        {/* Modales iguales a CrearVenta */}
        {modalVisible && clienteSeleccionado && (
          <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Datos del cliente</h5>
                  <button type="button" className="btn-close" onClick={() => setModalVisible(false)}></button>
                </div>
                <div className="modal-body">
                  <p><strong>Nombre:</strong> {clienteSeleccionado.cliente_nombre_completo}</p>
                  <p><strong>Email:</strong> {clienteSeleccionado.email}</p>
                  <p><strong>Teléfono:</strong> {clienteSeleccionado.telefono}</p>
                  <p><strong>Dirección:</strong> {clienteSeleccionado.direccion}</p>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setModalVisible(false)}>Cerrar</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {modalProductoVisible && productoSeleccionado && (
          <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Datos del producto</h5>
                  <button type="button" className="btn-close" onClick={() => setModalProductoVisible(false)}></button>
                </div>
                <div className="modal-body">
                  <p><strong>Nombre:</strong> {productoSeleccionado.nombre}</p>
                  <p><strong>Categoría:</strong> {productoSeleccionado.categoria}</p>
                  <p><strong>Descripcion:</strong> {productoSeleccionado.descripcion}</p>
                  <p><strong>Precio Compra:</strong> ${productoSeleccionado.precio_costo}</p>
                  <p><strong>Precio Venta:</strong> ${productoSeleccionado.precio_venta}</p>
                  <p><strong>Stock disponible:</strong> {productoSeleccionado.stock_minimo}</p>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setModalProductoVisible(false)}>Cerrar</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={`alert text-center mt-3 ${tipoMensaje === 'success' ? 'alert-success' : 'alert-danger'} ${mostrarMensaje ? 'show' : ''}`} role="alert"
        style={{ opacity: mostrarMensaje ? 1 : 0, transition: 'opacity 0.5s ease' }}>
        {tipoMensaje === 'success' ? '✅' : '❌'} {mensaje}
      </div>

      <div className="d-flex justify-content-between mt-4" style={{ maxWidth: '500px' }}>
        <button className="btn btn-dark" onClick={() => navigate('/ventas')}>Volver</button>    
      </div>
    </div>
  );
}

export default VerVenta;
