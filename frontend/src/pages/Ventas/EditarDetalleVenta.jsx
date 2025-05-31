import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../api';

function EditarDetalleVenta() {
  const navigate = useNavigate();
  const { ventaId, detalleId } = useParams();
  const [productos, setProductos] = useState([]);
  const [detalleVenta, setDetalleVenta] = useState({
    id: '',
    id_producto: '',
    descripcion: '',
    cantidad: '',
    precio_venta: ''
  });
  const [mostrarInfoProducto, setMostrarInfoProducto] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [mostrarMensaje, setMostrarMensaje] = useState(false);
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
        setDetalleVenta({
            id: response.data[0].id || '',
            id_producto: response.data[0].id_producto || '',
            descripcion: response.data[0].descripcion || '',
            cantidad: response.data[0].cantidad || '',
            precio_venta: response.data[0].precio_venta || ''
          });
      })
      .catch(err => {
        console.error(err);
        setErrorMessage('Error al cargar los datos de la venta');
      });

      const fetchData = async () => {
        try {
          const resProductos = await axios.get(`${API_URL}/api/inventario/productos`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setProductos(resProductos.data);     
        } catch (error) {
          console.error('Error al cargar productos:', error);
        }
      };

      fetchData();
    }
  }, [navigate, detalleId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetalleVenta(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProductoChange = (e) => {
    const productoId = e.target.value;
    const productoSeleccionado = productos.find(p => p.id.toString() === productoId);
    setDetalleVenta(prev => ({
      ...prev,
      id_producto: productoId,
      descripcion: productoSeleccionado ? productoSeleccionado.descripcion : ''
    }));
  };

  if (!detalleVenta) {
    return <div style={{ padding: '2rem' }}>Cargando venta...</div>;
  }

  const toggleInfoProducto = () => {
    setMostrarInfoProducto(prev => !prev);
  };

  const handleGuardar = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const data = {
        id_producto: detalleVenta.id_producto,
        cantidad: detalleVenta.cantidad
      };

    try {
      await axios.put(`${API_URL}/api/ventas/detalle/${detalleId}`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMensaje('Detalle de venta actualizado exitosamente');
      setTipoMensaje('success');
      setMostrarMensaje(true);
      setTimeout(() => {
        setMostrarMensaje(false);
      }, 2000);
    } catch (err) {
      console.error(err);
      setMensaje('Error al actualizar el detalle de la venta');
      setTipoMensaje('error');
      setMostrarMensaje(true);
      setErrorMessage('Error al guardar el detalle de la venta');
    }
  };
  

  return (
    <div style={{ display: 'flex', gap: '2rem', padding: '2rem' }}>
  {/* Detalle de la venta */}
  <div style={{ background: '#eee', padding: '2rem', maxWidth: '500px', flex: 1 }}>
    <h4>DETALLE DE LA VENTA</h4>
    <div className="mb-3">
      <label className="form-label">ID:</label>
      <input
        type="text"
        className="form-control"
        value={detalleVenta.id}
        name="id"
        disabled
      />
    </div>

    <div className="mb-3">
      <label className="form-label">PRODUCTO:</label>
      <select
        className="form-control"
        value={detalleVenta.id_producto}
        onChange={handleProductoChange}
      >
        <option value="">Seleccione un producto</option>
        {productos.map(p => (
          <option key={p.id} value={p.id}>{p.nombre}</option>
        ))}
      </select>
    </div>

    <div className="mb-3">
      <label className="form-label">DESCRIPCIÓN:</label>
      <input
        type="text"
        className="form-control"
        name="descripcion"
        value={detalleVenta.descripcion}
        disabled
      />
    </div>

    <div className="mb-3">
      <label className="form-label">CANTIDAD:</label>
      <input
        type="number"
        className="form-control"
        name="cantidad"
        value={detalleVenta.cantidad}
        onChange={handleChange}
      />
    </div>

    <div className="mb-3">
      <label className="form-label">PRECIO VENTA:</label>
      <input
        type="number"
        className="form-control"
        name="precio_venta"
        value={detalleVenta.precio_venta}
        disabled
        onChange={handleChange}
      />
    </div>

    <div className="mb-3">
      <button className="btn btn-primary" onClick={toggleInfoProducto}>
        Información completa del producto
      </button>
    </div>
      <div className="mt-4">
        <button className="btn btn-dark me-2" onClick={() => navigate(`/ventas/editar/${detalleId}`)}>Volver</button>
        <button className="btn btn-success" onClick={handleGuardar}>{'GUARDAR CAMBIOS'}</button>
      </div>

    {errorMessage && (
        <p className="text-danger mt-2">{errorMessage}</p>
      )}

      <div className={`alert text-center mt-3 ${tipoMensaje === 'success' ? 'alert-success' : 'alert-danger'} ${mostrarMensaje ? 'show' : ''}`}>
        {tipoMensaje === 'success' ? '✅' : '❌'} {mensaje}
      </div>

  </div>


  {/* Info del producto */}
  {mostrarInfoProducto && (
    <div style={{ background: '#f5f5f5', padding: '2rem', maxWidth: '400px', border: '1px solid #ccc', flex: 1 }}>
      <h5>INFORMACIÓN DEL PRODUCTO</h5>
      {(() => {
        const producto = productos.find(p => p.id.toString() === detalleVenta.id_producto?.toString());
        if (!producto) return <p>Producto no encontrado.</p>;
        return (
          <ul>
            <li><strong>Nombre:</strong> {producto.nombre}</li>
            <li><strong>Categoría:</strong> {producto.categoria}</li>
            <li><strong>Descripción:</strong> {producto.descripcion}</li>
            <li><strong>Precio de Costo:</strong> ${producto.precio_costo}</li>
            <li><strong>Precio de Venta:</strong> ${producto.precio_venta}</li> 
            <li><strong>Stock Mínimo:</strong> {producto.stock_minimo}</li>
          </ul>
        );
      })()}
    </div>
  )}
    
      
</div>


  );
  
}

export default EditarDetalleVenta;
