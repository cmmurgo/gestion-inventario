// src/pages/OrdenCompra/index.jsx
import React, { useState, useEffect, useRef } from 'react';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_URL } from '../../api';
import '../../App.css';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default function IndexOrdenCompra() {
  const navigate = useNavigate();
  const location = useLocation();
  const [ordenes, setOrdenes] = useState([]);
  const [ordenesFiltradas, setOrdenesFiltradas] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const [ordenAEliminar, setOrdenAEliminar] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [mostrarMensaje, setMostrarMensaje] = useState(false);

  const [idFiltro, setIdFiltro] = useState('');
  const [proveedorFiltro, setProveedorFiltro] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('');

  const modalRef = useRef(null);
  const [rol, setRol] = useState('');

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrdenes = ordenesFiltradas.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(ordenesFiltradas.length / itemsPerPage);

  const cargarOrdenes = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}/api/ordenes-compra`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setOrdenes(data || []);
      setOrdenesFiltradas(data || []);
    } catch (err) {
      console.error('Error al cargar órdenes de compra:', err);
    }
  };

  // Cargar datos inicialmente
  useEffect(() => {
    cargarOrdenes();
  }, []);

  // Detectar navegación desde crear orden
  useEffect(() => {
    if (location.state?.fromCreate) {
      cargarOrdenes();
      // Limpiar el estado para evitar recargas innecesarias
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Detectores de enfoque y visibilidad mejorados
  useEffect(() => {
    const handleFocus = () => {
      cargarOrdenes();
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        cargarOrdenes();
      }
    };

    // También detectar cuando la página se vuelve a cargar
    const handlePageShow = (event) => {
      if (event.persisted) {
        cargarOrdenes();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pageshow', handlePageShow);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);

  useEffect(() => {
    const filtradas = ordenes.filter(orden => {
      const coincideId = idFiltro ? String(orden?.id || '').includes(idFiltro) : true;
      const coincideProveedor = proveedorFiltro ? (orden?.proveedor_nombre || '').toLowerCase().includes(proveedorFiltro.toLowerCase()) : true;
      const coincideEstado = estadoFiltro ? (orden?.estado || '').toLowerCase().includes(estadoFiltro.toLowerCase()) : true;
      return coincideId && coincideProveedor && coincideEstado;
    });
    setOrdenesFiltradas(filtradas);
    setCurrentPage(1);
  }, [idFiltro, proveedorFiltro, estadoFiltro, ordenes]);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole) setRol(userRole);
  }, []);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

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

  const confirmarCancelacion = async () => {
    if (!ordenAEliminar) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/ordenes-compra/${ordenAEliminar}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const ordenCompleta = await res.json();
      
      if (!ordenCompleta) {
        throw new Error('Orden no encontrada para cancelar.');
      }

      const datosParaActualizar = {
        fecha: ordenCompleta.fecha,
        id_proveedor: ordenCompleta.id_proveedor,
        estado: 'Cancelada',
        detalles: ordenCompleta.detalles || []
      };

      await fetch(`${API_URL}/api/ordenes-compra/${ordenAEliminar}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosParaActualizar)
      });

      // Recargar la lista después de cancelar
      await cargarOrdenes();
      setMensaje('Orden de compra cancelada con éxito');
      setTipoMensaje('success');
    } catch (error) {
      console.error('Error al cancelar orden:', error);
      setMensaje('Error al cancelar la orden');
      setTipoMensaje('error');
    }
    setMostrarMensaje(true);
    setTimeout(() => setMostrarMensaje(false), 3000);
    const modal = bootstrap.Modal.getInstance(modalRef.current);
    if (modal) modal.hide();
  };

  const handleNuevaOrden = () => {
    navigate('/compras/crear');
  };

  const handleEditarOrden = (id, estado) => {
    const estadoLower = estado?.toLowerCase();
    if (estadoLower === 'cancelada' || estadoLower === 'recibida') {
      setMensaje(`No se puede editar una orden de compra ${estadoLower}`);
      setTipoMensaje('error');
      setMostrarMensaje(true);
      setTimeout(() => setMostrarMensaje(false), 3000);
      return;
    }
    navigate(`/compras/editar/${id}`);
  };

  const handleVerOrden = (id) => {
    navigate(`/compras/ver/${id}`);
  };

  const handleEliminarClick = (id, estado) => {
    const estadoLower = estado?.toLowerCase();
    if (estadoLower === 'cancelada' || estadoLower === 'recibida') {
      setMensaje(`No se puede cancelar una orden de compra ${estadoLower}`);
      setTipoMensaje('error');
      setMostrarMensaje(true);
      setTimeout(() => setMostrarMensaje(false), 3000);
      return;
    }
    setOrdenAEliminar(id);
    const modal = new bootstrap.Modal(modalRef.current);
    modal.show();
  };

  return (
    <div className="container py-4">
      {mostrarMensaje && (
        <div className={`alert text-center mt-3 ${tipoMensaje === 'success' ? 'alert-success' : 'alert-danger'}`}>
          {tipoMensaje === 'success' ? '✅' : '❌'} {mensaje}
        </div>
      )}

      <h5 className="fw-bold mb-4">LISTADO DE ÓRDENES DE COMPRA</h5>

      <div className="row g-2 mb-3">
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Buscar por ID"
            value={idFiltro}
            onChange={(e) => setIdFiltro(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Buscar por proveedor"
            value={proveedorFiltro}
            onChange={(e) => setProveedorFiltro(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value)}
          >
            <option value="">🔍 Todos los estados</option>
            <option value="creada">Creada</option>
            <option value="recibida">Recibida</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>
      </div>

      <div className="table-responsive" style={{ maxHeight: '500px', overflowY: 'auto' }}>
        <table className="table table-bordered text-center align-middle">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>PROVEEDOR</th>
              <th>FECHA</th>
              <th>ESTADO</th>
              <th>TOTAL</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {currentOrdenes.length > 0 ? (
              currentOrdenes.map((orden) => {
                const estadoLower = orden?.estado?.toLowerCase();
                const isDisabled = estadoLower === 'cancelada' || estadoLower === 'recibida';
                
                return (
                  <tr key={orden.id}>
                    <td>{orden.id}</td>
                    <td>{orden.proveedor_nombre || 'N/A'}</td>
                    <td>{new Date(orden.fecha).toLocaleDateString('es-AR')}</td>
                    <td>{getEstadoBadge(orden.estado)}</td>
                    <td>${orden.total}</td>
                    <td>
                      <button 
                        className="btn btn-link text-primary me-2" 
                        onClick={() => handleVerOrden(orden.id)}
                      >
                        <FaEye />
                      </button>
                      <button 
                        className={`btn btn-link me-2 ${isDisabled ? 'text-muted' : 'text-warning'}`}
                        onClick={() => handleEditarOrden(orden.id, orden.estado)}
                        disabled={isDisabled}
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className={`btn btn-link ${isDisabled ? 'text-muted' : 'text-danger'}`}
                        onClick={() => handleEliminarClick(orden.id, orden.estado)}
                        disabled={isDisabled}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6">No se encontraron órdenes de compra.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {rol === 'admin' && (
        <div className="d-flex justify-content-between mt-3">
          <button className="btn btn-success" onClick={handleNuevaOrden}>
            NUEVA ORDEN DE COMPRA
          </button>
        </div>
      )}

      <div className="mt-4 d-flex justify-content-center">
        <nav>
          <ul className="pagination mb-0">
            <li className={`page-item ${currentPage === 1 && 'disabled'}`}>
              <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>{'<'}</button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => (
              <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => handlePageChange(i + 1)}>{i + 1}</button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages && 'disabled'}`}>
              <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>{'>'}</button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Modal de confirmación */}
      <div className="modal fade" id="confirmarCancelacion" tabIndex="-1" ref={modalRef}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-center">
              <h5>¿ESTÁ SEGURO QUE DESEA CANCELAR LA ORDEN DE COMPRA?</h5>
              <div className="d-flex justify-content-around mt-4">
                <button type="button" className="btn btn-danger" data-bs-dismiss="modal">CANCELAR</button>
                <button type="button" className="btn btn-success" onClick={confirmarCancelacion}>OK</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}