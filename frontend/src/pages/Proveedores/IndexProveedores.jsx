// src/pages/Proveedores/IndexProveedores.jsx
import React, { useState, useEffect, useRef } from 'react';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_URL } from '../../api';
import { getProveedores, softDeleteProveedor } from '../../services/proveedorService';
import { getToken } from '../../services/authService';
import '../../App.css';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default function IndexProveedores() {
  const navigate = useNavigate();
  const location = useLocation();
  const [proveedores, setProveedores] = useState([]);
  const [proveedoresFiltrados, setProveedoresFiltrados] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const [proveedorAEliminar, setProveedorAEliminar] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [mostrarMensaje, setMostrarMensaje] = useState(false);

  const [nombreFiltro, setNombreFiltro] = useState('');
  const [rubroFiltro, setRubroFiltro] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('');

  const modalRef = useRef(null);
  const [rol, setRol] = useState('');

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProveedores = proveedoresFiltrados.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(proveedoresFiltrados.length / itemsPerPage);

  const cargarProveedores = async () => {
    const token = getToken();
    const userRole = localStorage.getItem('userRole');
    if (!token) {
      navigate('/');
      return;
    }
    setRol(userRole);

    try {
      const response = await getProveedores();
      setProveedores(response.data || []); 
      setProveedoresFiltrados(response.data || []);
    } catch (err) {
      console.error('Error al cargar proveedores:', err);
      setMensaje('Error al cargar proveedores. Inténtalo de nuevo más tarde.');
      setTipoMensaje('error');
      setMostrarMensaje(true);
      setTimeout(() => setMostrarMensaje(false), 3000);
    }
  };

  // Cargar datos inicialmente
  useEffect(() => {
    cargarProveedores();
  }, [navigate]);

  // Detectar navegación desde crear proveedor
  useEffect(() => {
    if (location.state?.fromCreate) {
      cargarProveedores();
      // Limpiar el estado para evitar recargas innecesarias
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Detectores de enfoque y visibilidad mejorados
  useEffect(() => {
    const handleFocus = () => {
      cargarProveedores();
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        cargarProveedores();
      }
    };

    // También detectar cuando la página se vuelve a cargar
    const handlePageShow = (event) => {
      if (event.persisted) {
        cargarProveedores();
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
    const filtrados = proveedores.filter(proveedor => {
      const coincideNombre = nombreFiltro
        ? (proveedor?.nombre || '').toLowerCase().includes(nombreFiltro.toLowerCase())
        : true;
      const coincideRubro = rubroFiltro
        ? (proveedor?.rubro_nombre ? proveedor.rubro_nombre.toLowerCase().includes(rubroFiltro.toLowerCase()) : false)
        : true;
      const coincideEstado = estadoFiltro
        ? (proveedor?.estado || '').toLowerCase().includes(estadoFiltro.toLowerCase())
        : true;

      return coincideNombre && coincideRubro && coincideEstado;
    });
    setProveedoresFiltrados(filtrados);
    setCurrentPage(1);
  }, [nombreFiltro, rubroFiltro, estadoFiltro, proveedores]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const confirmarEliminacion = async () => {
    try {
      await softDeleteProveedor(proveedorAEliminar);
      // Recargar la lista después de eliminar
      await cargarProveedores();
      setMensaje('Proveedor eliminado con éxito');
      setTipoMensaje('success');
    } catch (err) {
      console.error('Error al eliminar:', err);
      setMensaje('Error al eliminar el proveedor');
      setTipoMensaje('error');
    }
    setMostrarMensaje(true);
    setTimeout(() => setMostrarMensaje(false), 3000);
    const modal = bootstrap.Modal.getInstance(modalRef.current);
    if (modal) modal.hide();
  };

  const handleNuevoProveedor = () => {
    navigate('/proveedores/crear');
  };

  const handleEditarProveedor = (id, estado) => {
    if (estado?.toLowerCase() === 'inactivo') {
      setMensaje('No se puede editar un proveedor inactivo');
      setTipoMensaje('error');
      setMostrarMensaje(true);
      setTimeout(() => setMostrarMensaje(false), 3000);
      return;
    }
    navigate(`/proveedores/editar/${id}`);
  };

  const handleVerProveedor = (id) => {
    navigate(`/proveedores/ver/${id}`);
  };

  const handleEliminarClick = (id, estado) => {
    if (estado?.toLowerCase() === 'inactivo') {
      setMensaje('No se puede eliminar un proveedor inactivo');
      setTipoMensaje('error');
      setMostrarMensaje(true);
      setTimeout(() => setMostrarMensaje(false), 3000);
      return;
    }
    setProveedorAEliminar(id);
    const modal = new bootstrap.Modal(modalRef.current);
    modal.show();
  };

  const isProveedorInactivo = (proveedor) => {
    return proveedor.fecha_baja !== null || proveedor.estado?.toLowerCase() === 'inactivo';
  };

  return (
    <div className="container py-4">
      {mostrarMensaje && (
        <div className={`alert text-center mt-3 ${tipoMensaje === 'success' ? 'alert-success' : 'alert-danger'}`}>
          {tipoMensaje === 'success' ? '✅' : '❌'} {mensaje}
        </div>
      )}

      <h5 className="fw-bold mb-4">LISTADO DE PROVEEDORES</h5>

      <div className="row g-2 mb-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Buscar por nombre"
            value={nombreFiltro}
            onChange={(e) => setNombreFiltro(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Buscar por rubro"
            value={rubroFiltro}
            onChange={(e) => setRubroFiltro(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value)}
          >
            <option value="">🔍 Todos los estados</option>
            <option value="activo">Activos</option>
            <option value="inactivo">Inactivos</option>
          </select>
        </div>
      </div>

      <div className="table-responsive" style={{ maxHeight: '500px', overflowY: 'auto' }}>
        <table className="table table-bordered text-center align-middle">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>NOMBRE</th>
              <th>EMAIL</th>
              <th>TELÉFONO</th>
              <th>CUIT</th>
              <th>RUBRO</th>
              <th>ESTADO</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {currentProveedores.length > 0 ? (
              currentProveedores.map(proveedor => {
                const esInactivo = isProveedorInactivo(proveedor);
                return (
                  <tr key={proveedor.id}>
                    <td>{proveedor.id}</td>
                    <td>{proveedor.nombre || 'N/A'}</td>
                    <td>{proveedor.email || 'N/A'}</td>
                    <td>{proveedor.telefono || 'N/A'}</td>
                    <td>{proveedor.cuit || 'N/A'}</td>
                    <td>{proveedor.rubro_nombre || 'N/A'}</td>
                    <td>
                      <span className={`badge ${esInactivo ? 'bg-danger' : 'bg-success'}`}>
                        {proveedor.estado}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn btn-link text-primary me-2" 
                        onClick={() => handleVerProveedor(proveedor.id)}
                      >
                        <FaEye />
                      </button>
                      <button 
                        className={`btn btn-link me-2 ${esInactivo ? 'text-muted' : 'text-warning'}`}
                        onClick={() => handleEditarProveedor(proveedor.id, proveedor.estado)}
                        disabled={esInactivo}
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className={`btn btn-link ${esInactivo ? 'text-muted' : 'text-danger'}`}
                        onClick={() => handleEliminarClick(proveedor.id, proveedor.estado)}
                        disabled={esInactivo}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8">No se encontraron proveedores.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {rol === 'admin' && (
        <div className="d-flex justify-content-between mt-3">
          <button className="btn btn-success" onClick={handleNuevoProveedor}>
            NUEVO PROVEEDOR
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
      <div className="modal fade" id="confirmarEliminacion" tabIndex="-1" ref={modalRef}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-center">
              <h5>¿ESTÁ SEGURO QUE DESEA ELIMINAR EL PROVEEDOR?</h5>
              <div className="d-flex justify-content-around mt-4">
                <button type="button" className="btn btn-danger" data-bs-dismiss="modal">CANCELAR</button>
                <button type="button" className="btn btn-success" onClick={confirmarEliminacion}>OK</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}