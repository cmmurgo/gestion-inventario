import React, { useState, useEffect, useRef } from 'react';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../api';
import '../../App.css';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default function Ventas() {
  const navigate = useNavigate();
  const [ventas, setVentas] = useState([]);
  const [ventasFiltradas, setVentasFiltradas] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const [ventaAEliminar, setVentaAEliminar] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [mostrarMensaje, setMostrarMensaje] = useState(false);

  const [clienteFiltro, setClienteFiltro] = useState('');
  const [fechaFiltro, setFechaFiltro] = useState('');

  const modalRef = useRef(null);
  const [rol, setRol] = useState('');

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVentas = ventasFiltradas.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(ventasFiltradas.length / itemsPerPage);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/api/ventas`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setVentas(data);
        setVentasFiltradas(data);
      })
      .catch(err => console.error('Error al cargar ventas:', err));
  }, []);

  useEffect(() => {
    const filtradas = ventas.filter(v => {
      const coincideCliente = clienteFiltro ? v.cliente.toLowerCase().includes(clienteFiltro.toLowerCase()) : true;
      const coincideFecha = fechaFiltro ? v.fecha.includes(fechaFiltro) : true;
      return coincideCliente && coincideFecha;
    });
    setVentasFiltradas(filtradas);
    setCurrentPage(1);
  }, [clienteFiltro, fechaFiltro, ventas]);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole) setRol(userRole);
  }, []);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const confirmarEliminacion = () => {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/api/ventas/${ventaAEliminar}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (res.ok) {
          const nuevasVentas = ventas.filter(v => v.id !== ventaAEliminar);
          setVentas(nuevasVentas);
          setVentasFiltradas(nuevasVentas);
          setMensaje('Venta eliminada con éxito');
          setTipoMensaje('success');
        } else {
          setMensaje('Error al eliminar la venta');
          setTipoMensaje('error');
        }
        setMostrarMensaje(true);
        setTimeout(() => setMostrarMensaje(false), 3000);
        const modal = bootstrap.Modal.getInstance(modalRef.current);
        if (modal) modal.hide();
      })
      .catch(err => {
        console.error('Error al eliminar:', err);
        setMensaje('Error de conexión');
        setTipoMensaje('error');
        setMostrarMensaje(true);
        setTimeout(() => setMostrarMensaje(false), 3000);
        const modal = bootstrap.Modal.getInstance(modalRef.current);
        if (modal) modal.hide();
      });
  };

  const handleNuevaVenta = () => {
    navigate('/ventas/crear');
  };

  const handleEditarVenta = (id) => {
    navigate(`/ventas/editar/${id}`);
  };

  const handleVerVenta = (id) => {
    navigate(`/ventas/ver/${id}`);
  };

  const handleEliminarClick = (id) => {
    setVentaAEliminar(id);
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

      <h5 className="fw-bold mb-4">LISTADO DE VENTAS</h5>

      <div className="row g-2 mb-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Buscar por cliente"
            value={clienteFiltro}
            onChange={(e) => setClienteFiltro(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <input
            type="date"
            className="form-control"
            value={fechaFiltro}
            onChange={(e) => setFechaFiltro(e.target.value)}
          />
        </div>
      </div>

      <div className="table-responsive" style={{ maxHeight: '500px', overflowY: 'auto' }}>
        <table className="table table-bordered text-center align-middle">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>CLIENTE</th>
              <th>FECHA</th>
              <th>TOTAL</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {currentVentas.length > 0 ? (
              currentVentas.map((v) => (
                <tr key={v.id}>
                  <td>{v.id}</td>
                  <td>{v.cliente_nombre_completo}</td>
                  <td>{new Date(v.fecha).toLocaleDateString('es-AR')}</td>
                  <td>${v.total_venta}</td>
                  <td>
                    <button className="btn btn-link text-primary me-2" onClick={() => handleVerVenta(v.id)}><FaEye /></button>
                    <button className="btn btn-link text-warning me-2" onClick={() => handleEditarVenta(v.id)}><FaEdit /></button>
                    <button className="btn btn-link text-danger" onClick={() => handleEliminarClick(v.id)}><FaTrash /></button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No se encontraron ventas.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {rol === 'admin' && (
        <div className="d-flex justify-content-between mt-3">
          <button className="btn btn-success" onClick={handleNuevaVenta}>
            NUEVA VENTA
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
              <h5>¿ESTÁ SEGURO QUE DESEA ELIMINAR LA VENTA?</h5>
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
