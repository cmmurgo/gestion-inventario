// src/pages/OrdenCompra/CrearOrdenCompra.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaCalendarAlt, FaSave, FaArrowLeft, FaCheckCircle, FaExclamationTriangle, FaArrowUp } from 'react-icons/fa';
import { getProveedores, getProductosByProveedorId } from '../../services/proveedorService';
import { createOrdenCompra } from '../../services/ordenCompraService';
import DetalleProductos from './DetalleProductos';
import ComboboxProveedores from './ComboboxProveedores';

export default function CrearOrdenCompra() {
  const navigate = useNavigate();
  const [proveedores, setProveedores] = useState([]);
  const [productosDisponibles, setProductosDisponibles] = useState([]);
  const [fecha, setFecha] = useState('');
  const [idProveedor, setIdProveedor] = useState('');
  const [detalles, setDetalles] = useState([]);
  const [total, setTotal] = useState(0);
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [mostrarMensaje, setMostrarMensaje] = useState(false);
  const [errores, setErrores] = useState({});
  const [loadingProveedores, setLoadingProveedores] = useState(true);
  const [loadingProductos, setLoadingProductos] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [mostrarBotonScroll, setMostrarBotonScroll] = useState(false);

  useEffect(() => {
    // Establecer fecha actual por defecto
    const hoy = new Date();
    const fechaFormateada = hoy.getFullYear() + '-' + 
      String(hoy.getMonth() + 1).padStart(2, '0') + '-' + 
      String(hoy.getDate()).padStart(2, '0');
    setFecha(fechaFormateada);

    const fetchProveedores = async () => {
      try {
        const resProveedores = await getProveedores();
        setProveedores(resProveedores.data || []);
      } catch (error) {
        console.error('Error al cargar proveedores:', error);
        setMensaje("Error al cargar proveedores. Verifique su conexión.");
        setTipoMensaje("error");
        setMostrarMensaje(true);
        setTimeout(() => setMostrarMensaje(false), 5000);
      } finally {
        setLoadingProveedores(false);
      }
    };

    fetchProveedores();
  }, []);

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
        setLoadingProductos(true);
        try {
          const res = await getProductosByProveedorId(idProveedor);
          setProductosDisponibles(res.data || []);
          setDetalles([]); // Limpia los detalles al cambiar de proveedor
          
          if (!res.data || res.data.length === 0) {
            setMensaje("No hay productos disponibles para este proveedor.");
            setTipoMensaje("warning");
            setMostrarMensaje(true);
            setTimeout(() => setMostrarMensaje(false), 3000);
          }
        } catch (error) {
          console.error('Error al cargar productos por proveedor:', error);
          setMensaje("Error al cargar productos para el proveedor seleccionado.");
          setTipoMensaje("error");
          setProductosDisponibles([]);
          setMostrarMensaje(true);
          setTimeout(() => setMostrarMensaje(false), 5000);
        } finally {
          setLoadingProductos(false);
        }
      };
      fetchProductos();
    } else {
      setProductosDisponibles([]);
      setDetalles([]);
      setLoadingProductos(false);
    }
  }, [idProveedor]);

  const calcularTotal = (detalles) => {
    const totalCalculado = detalles.reduce((acc, item) => {
      const cantidad = parseFloat(item.cantidad) || 0;
      const productDetail = productosDisponibles.find(p => p.id === item.id_producto);
      const precio = parseFloat(productDetail?.precio_costo || 0);
      return acc + (cantidad * precio);
    }, 0);
    setTotal(totalCalculado);
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    
    // Validación siguiendo lógica estricta de ventas
    if (!fecha) {
      nuevosErrores.fecha = "La fecha es obligatoria.";
    }
    
    if (!idProveedor) {
      nuevosErrores.idProveedor = "El proveedor es obligatorio.";
    }
    
    if (detalles.length === 0) {
      nuevosErrores.detalles = "Debe agregar al menos un producto al detalle.";
    } else {
      // Validaciones estrictas por producto
      detalles.forEach((detalle, index) => {
        if (!detalle.id_producto) {
          nuevosErrores[`detalleProducto_${index}`] = `Seleccione un producto para la fila ${index + 1}.`;
        }
        if (!detalle.cantidad || parseFloat(detalle.cantidad) <= 0) {
          nuevosErrores[`detalleCantidad_${index}`] = `La cantidad para la fila ${index + 1} debe ser mayor a 0.`;
        }
        
        // Validar que el producto tenga precio válido
        const productInAvailableProducts = productosDisponibles.find(p => p.id === detalle.id_producto);
        if (!productInAvailableProducts || parseFloat(productInAvailableProducts.precio_costo || 0) <= 0) {
          nuevosErrores[`detallePrecio_${index}`] = `El producto en la fila ${index + 1} no tiene un precio de costo válido.`;
        }
      });
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const limpiarFormulario = () => {
    const hoy = new Date();
    const fechaFormateada = hoy.getFullYear() + '-' + 
      String(hoy.getMonth() + 1).padStart(2, '0') + '-' + 
      String(hoy.getDate()).padStart(2, '0');
    setFecha(fechaFormateada);
    setIdProveedor('');
    setDetalles([]);
    setTotal(0);
    setErrores({});
    setProductosDisponibles([]);
    setMensaje('');
  };

  const handleCrearOrden = async () => {
    // Mensaje exacto de ventas
    if (!validarFormulario()) {
      setMensaje('Todos los campos son obligatorios');
      setTipoMensaje('error');
      setMostrarMensaje(true);
      setTimeout(() => setMostrarMensaje(false), 3000);
      return;
    }

    setLoadingSubmit(true);

    try {
      const response = await createOrdenCompra({ 
        fecha, 
        id_proveedor: idProveedor, 
        detalles 
      });
      
      if (response.status === 201) {
        // Mensaje exacto de ventas
        setMensaje('Orden de compra registrada con éxito');
        setTipoMensaje('success');
        setMostrarMensaje(true);
        
        // Navegar al index después de 2 segundos con estado para forzar recarga
        setTimeout(() => {
          navigate('/compras', { state: { fromCreate: true, timestamp: Date.now() } });
        }, 2000);
        
      } else {
        // Mensaje exacto de ventas
        setMensaje('Error al registrar la orden de compra');
        setTipoMensaje('error');
        setMostrarMensaje(true);
        setTimeout(() => setMostrarMensaje(false), 3000);
      }
      
    } catch (error) {
      console.error("Error al crear orden:", error);
      // Mensaje siguiendo patrón de ventas
      const backendMessage = error?.response?.data?.message || 'Error al registrar la orden de compra';
      setMensaje(backendMessage);
      setTipoMensaje('error');
      setMostrarMensaje(true);
      setTimeout(() => setMostrarMensaje(false), 3000);
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div style={{ padding: '2rem', position: 'relative' }}>
      <h4>REGISTRAR ORDEN DE COMPRA:</h4>
      
      <div style={{ background: '#eee', padding: '2rem' }}>
        <div className="mb-3 d-flex justify-content-between" style={{ gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <label className="form-label">FECHA:</label>
            <input
              type="date"
              className={`form-control ${errores.fecha ? 'is-invalid' : fecha ? 'is-valid' : ''}`}
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
            {errores.fecha && <div className="invalid-feedback">{errores.fecha}</div>}
          </div>

          <ComboboxProveedores
            proveedores={proveedores}
            idProveedor={idProveedor}
            setIdProveedor={setIdProveedor}
            error={errores.idProveedor}
            loading={loadingProveedores}
          />
        </div>

        <hr />
        
        <DetalleProductos
          productos={productosDisponibles}
          detalles={detalles}
          setDetalles={setDetalles}
          isCompra={true}
          errores={errores}
          loadingProductos={loadingProductos}
        />

        <div className="mt-3 text-end">
          <h5>Total: ${total.toFixed(2)}</h5>
        </div>

        {/* Línea divisoria vertical */}
        <hr style={{ border: '1px solid #ccc', margin: '2rem 0' }} />

        {/* Botones dentro del formulario */}
        <div className="d-flex justify-content-between" style={{ maxWidth: '500px' }}>
          <button 
            className="btn btn-dark" 
            onClick={() => navigate('/compras')}
            type="button"
          >
            Volver
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleCrearOrden} 
            disabled={loadingSubmit}
            type="button"
          >
            {loadingSubmit ? 'Guardando...' : 'GUARDAR'}
          </button>
        </div>
      </div>

      {/* Mensaje siguiendo exacto patrón de ventas */}
      <div className={`alert text-center mt-3 ${tipoMensaje === 'success' ? 'alert-success' : 'alert-danger'} ${mostrarMensaje ? 'show' : ''}`} role="alert"
        style={{ opacity: mostrarMensaje ? 1 : 0, transition: 'opacity 0.5s ease' }}>
        {tipoMensaje === 'success' ? '✅' : '❌'} {mensaje}
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