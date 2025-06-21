// src/pages/OrdenCompra/EditarOrdenCompra.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaEdit, FaCalendarAlt, FaSave, FaArrowLeft, FaCheckCircle, FaExclamationTriangle, FaLock, FaToggleOn, FaToggleOff, FaArrowUp } from 'react-icons/fa';
import axios from 'axios';
import { API_URL } from '../../api';
import { getProveedores, getProductosByProveedorId } from '../../services/proveedorService';
import { getOrdenCompraById, updateOrdenCompra } from '../../services/ordenCompraService';
import DetalleProductos from './DetalleProductos';
import ComboboxProveedores from './ComboboxProveedores';

export default function EditarOrdenCompra() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proveedores, setProveedores] = useState([]);
  const [productosDisponibles, setProductosDisponibles] = useState([]);
  const [fecha, setFecha] = useState('');
  const [idProveedor, setIdProveedor] = useState('');
  const [estado, setEstado] = useState('');
  const [estadoOriginal, setEstadoOriginal] = useState('');
  const [detalles, setDetalles] = useState([]);
  const [total, setTotal] = useState(0);
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [mostrarMensaje, setMostrarMensaje] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [modalProductoVisible, setModalProductoVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [errores, setErrores] = useState({});
  const [mostrarBotonScroll, setMostrarBotonScroll] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const resProveedores = await getProveedores();
        setProveedores(resProveedores.data);

        const ordenData = await getOrdenCompraById(id);
        const orden = ordenData.data;
        setFecha(orden.fecha.split('T')[0]);
        setIdProveedor(orden.id_proveedor);
        setEstado(orden.estado);
        setEstadoOriginal(orden.estado);
        setDetalles(orden.detalles || []);

        setLoading(false);
      } catch (error) {
        console.error('Error al cargar datos para editar orden de compra:', error);
        setMensaje("Error al cargar los datos de la orden de compra");
        setTipoMensaje("error");
        setMostrarMensaje(true);
        setLoading(false);
        setTimeout(() => setMostrarMensaje(false), 3000);
      }
    };

    fetchData();
  }, [id, navigate]);

  // Control del scroll
  useEffect(() => {
    const manejarScroll = () => {
      if (window.pageYOffset > 300) {
        setMostrarBotonScroll(true);
      } else {
        setMostrarBotonScroll(false);
      }
    };

    window.addEventListener('scroll', manejarScroll);
    return () => window.removeEventListener('scroll', manejarScroll);
  }, []);

  const scrollHaciaArriba = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    calcularTotal(detalles);
  }, [detalles, productosDisponibles]);

  useEffect(() => {
    if (idProveedor) {
      const fetchProductos = async () => {
        try {
          const res = await getProductosByProveedorId(idProveedor);
          setProductosDisponibles(res.data || []);
        } catch (error) {
          console.error('Error al cargar productos por proveedor:', error);
          setMensaje("Error al cargar productos para el proveedor seleccionado");
          setTipoMensaje("error");
          setProductosDisponibles([]);
          setMostrarMensaje(true);
          setTimeout(() => setMostrarMensaje(false), 3000);
        }
      };
      fetchProductos();
    } else {
      setProductosDisponibles([]);
    }
  }, [idProveedor]);

  const calcularTotal = (detalles) => {
    const totalCalculado = detalles.reduce((acc, item) => {
      const cantidad = parseFloat(item.cantidad) || 0;
      const precio = parseFloat(item.precio_unitario_costo || 0);
      if (precio === 0) {
        const productDetail = productosDisponibles.find(p => p.id === item.id_producto);
        return acc + cantidad * parseFloat(productDetail?.precio_costo || 0);
      }
      return acc + cantidad * precio;
    }, 0);
    setTotal(totalCalculado);
  };

  // Validaciones siguiendo patrón exacto de ventas
  const validarFormulario = () => {
    if (!fecha || !idProveedor || detalles.length === 0 || detalles.some(d => !d.id_producto || !d.cantidad)) {
      return false;
    }
    return true;
  };

  const handleActualizar = async () => {
    // Mensaje exacto igual que ventas
    if (!validarFormulario()) {
      setMensaje('Todos los campos son obligatorios');
      setTipoMensaje('error');
      setMostrarMensaje(true);
      setTimeout(() => setMostrarMensaje(false), 3000);
      return;
    }

    setLoadingSubmit(true);

    try {
      const response = await updateOrdenCompra(id, { 
        fecha, 
        id_proveedor: idProveedor, 
        estado, 
        detalles 
      });
      
      if (response.status === 200) {
        // Mensaje exacto igual que ventas
        setMensaje('Orden de compra actualizada con éxito');
        setTipoMensaje('success');
        
        // Actualizar estado original después de guardar exitosamente
        setEstadoOriginal(estado);
      } else {
        // Mensaje exacto igual que ventas
        setMensaje('Error al actualizar la orden de compra');
        setTipoMensaje('error');
      }
      
      setMostrarMensaje(true);
      setTimeout(() => setMostrarMensaje(false), 3000);
    } catch (error) {
      console.error(error);
      // Manejo de errores exacto igual que ventas
      const backendMessage = error?.response?.data?.message || 'Error al actualizar la orden de compra';
      setMensaje(backendMessage);
      setTipoMensaje('error');
      setMostrarMensaje(true);
      setTimeout(() => setMostrarMensaje(false), 3000);
    } finally {
      setLoadingSubmit(false);
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
      console.error('Error al obtener datos del producto para modal:', error);
      setMensaje("Error al cargar detalles del producto");
      setTipoMensaje("error");
      setMostrarMensaje(true);
      setTimeout(() => setMostrarMensaje(false), 3000);
    }
  };

  // Colores de estado estandarizados
  const getEstadoBadge = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'recibida':
        return <span className="badge bg-success">Recibida</span>;
      case 'creada':
        return <span className="badge bg-primary">Creada</span>;
      case 'cancelada':
        return <span className="badge bg-danger">Cancelada</span>;
      default:
        return <span className="badge bg-secondary">{estado}</span>;
    }
  };

  if (loading) {
    return (
      <div className="container py-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Cargando...</span>
          </div>
          <h5>Cargando datos de la orden...</h5>
          <p className="text-muted">Por favor espere mientras se cargan los datos necesarios.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', position: 'relative' }}>
      <h4>EDITAR ORDEN DE COMPRA: #{id}</h4>
      
      <div style={{ background: '#eee', padding: '2rem' }}>
        {/* Estado de la orden - Solo informativo, no bloquea edición */}
        <div className="alert alert-light border mb-4">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <span className="fw-bold me-2">Estado actual:</span>
              {getEstadoBadge(estadoOriginal)}
            </div>
          </div>
          <hr className="my-2" />
          <small className="text-muted">
            <strong>ℹ️ Información:</strong> Puede cambiar el estado de la orden. Una vez guardada como "Recibida" o "Cancelada", 
            los botones de editar y eliminar se deshabilitarán en el listado principal.
          </small>
        </div>

        {/* Formulario siguiendo patrón exacto de ventas */}
        <div className="mb-3 d-flex justify-content-between" style={{ gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <label className="form-label">FECHA:</label>
            <input
              type="date"
              className="form-control"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              disabled={loadingSubmit}
            />
          </div>

          <ComboboxProveedores
            proveedores={proveedores}
            idProveedor={idProveedor}
            setIdProveedor={setIdProveedor}
            disabled={loadingSubmit}
          />
        </div>

        {/* Estado - Siempre editable */}
        <div className="mb-3">
          <label className="form-label">ESTADO:</label>
          <select
            className="form-control"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            disabled={loadingSubmit}
          >
            <option value="Creada">Creada</option>
            <option value="Recibida">Recibida</option>
            <option value="Cancelada">Cancelada</option>
          </select>
          <small className="text-muted">
            Seleccione el estado de la orden de compra.
          </small>
        </div>

        <hr />
        
        {/* Detalle de productos - Siempre editable */}
        <DetalleProductos
          productos={productosDisponibles}
          detalles={detalles}
          setDetalles={setDetalles}
          isCompra={true}
          esEdicion={false}
          abrirModalProducto={abrirModalProducto}
          disabled={loadingSubmit}
        />

        <div className="mt-3 text-end">
          <h5>Total: ${total.toFixed(2)}</h5>
        </div>

        {/* Modal de producto igual que ventas */}
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
                  <p><strong>Precio Costo:</strong> ${productoSeleccionado.precio_costo}</p>
                  <p><strong>Precio Venta:</strong> ${productoSeleccionado.precio_venta}</p>
                  <p><strong>Stock mínimo:</strong> {productoSeleccionado.stock_minimo}</p>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setModalProductoVisible(false)}>Cerrar</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mensaje siguiendo exacto patrón de ventas */}
      <div className={`alert text-center mt-3 ${tipoMensaje === 'success' ? 'alert-success' : 'alert-danger'} ${mostrarMensaje ? 'show' : ''}`} role="alert"
        style={{ opacity: mostrarMensaje ? 1 : 0, transition: 'opacity 0.5s ease' }}>
        {tipoMensaje === 'success' ? '✅' : '❌'} {mensaje}
      </div>

      {/* Botones siguiendo exacto patrón de ventas */}
      <div className="d-flex justify-content-between mt-4" style={{ maxWidth: '500px' }}>
        <button className="btn btn-dark" onClick={() => navigate('/compras')}>Volver</button>
        <button className="btn btn-primary" onClick={handleActualizar} disabled={loadingSubmit}>
          {loadingSubmit ? 'Actualizando...' : 'ACTUALIZAR'}
        </button>
      </div>

      {/* Botón de scroll hacia arriba */}
      {mostrarBotonScroll && (
        <button
          onClick={scrollHaciaArriba}
          className="btn btn-primary"
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            border: 'none',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Ir arriba"
        >
          <FaArrowUp />
        </button>
      )}
    </div>
  );
}