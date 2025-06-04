import React, { useState, useEffect, useRef } from 'react';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../api';
import '../../App.css';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default function Perdidas() {
  const navigate = useNavigate();
  const [perdidas, setPerdidas] = useState([]);
  const [perdidasFiltradas, setPerdidasFiltradas] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const [perdidaAEliminar, setPerdidaAEliminar] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [mostrarMensaje, setMostrarMensaje] = useState(false);

  const [idFiltro, setIdFiltro] = useState('');
  const [descripcionFiltro, setDescripcionFiltro] = useState('');

  const modalRef = useRef(null);
  const [rol, setRol] = useState('');

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPerdidas = perdidasFiltradas.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(perdidasFiltradas.length / itemsPerPage);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/api/perdidas`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setPerdidas(data);
        setPerdidasFiltradas(data);
      })
      .catch(err => console.error('Error al cargar pérdidas:', err));
  }, []);

  useEffect(() => {
    const filtradas = perdidas.filter(p => {
      const coincideId = idFiltro ? p.id.toString().includes(idFiltro) : true;
      const coincideDescripcion = descripcionFiltro
        ? p.descripcion.toLowerCase().includes(descripcionFiltro.toLowerCase())
        : true;
      return coincideId && coincideDescripcion;
    });
    setPerdidasFiltradas(filtradas);
    setCurrentPage(1);
  }, [idFiltro, descripcionFiltro, perdidas]);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole) setRol(userRole);
  }, []);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const confirmarEliminacion = () => {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/api/perdidas/${perdidaAEliminar}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (res.ok) {
          const nuevasPerdidas = perdidas.filter(p => p.id !== perdidaAEliminar);
          setPerdidas(nuevasPerdidas);
          setPerdidasFiltradas(nuevasPerdidas);
          setMensaje('Pérdida eliminada con éxito');
          setTipoMensaje('success');
        } else {
          setMensaje('Error al eliminar la pérdida');
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

  const handleNuevaPerdida = () => {
    navigate('/perdidas/crear');
  };

  const handleEditarPerdida = (id) => {
    navigate(`/perdidas/editar/${id}`);
  };

  const handleVerPerdida = (id) => {
    navigate(`/perdidas/ver/${id}`);
  };

  const handleEliminarClick = (id) => {
    setPerdidaAEliminar(id);
    const modal = new bootstrap.Modal(modalRef.current);
    modal.show();
  };

  return (
    <div className="container py-4">
      <div className={`alert text-center mt-3 ${tipoMensaje === 'success' ? 'alert-success' : 'alert-danger'} ${mostrarMensaje ? 'show' : ''}`}>
        {tipoMensaje === 'success' ? '✅' : '❌'} {mensaje}
      </div>

      <h5 className="fw-bold mb-4">LISTADO DE PÉRDIDAS</h5>

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
        <div className="col-md-5">
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Buscar por descripción"
            value={descripcionFiltro}
            onChange={(e) => setDescripcionFiltro(e.target.value)}
          />
        </div>
      </div>

      <div className="table-responsive" style={{ maxHeight: '500px', overflowY: 'auto' }}>
        <table className="table table-bordered text-center align-middle">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>DESCRIPCIÓN</th>
              <th>FECHA</th>
              <th>CANTIDAD</th>
              <th>MOTIVO DE PÉRDIDA</th>
              <th>MONTO TOTAL PERDIDO</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {currentPerdidas.length > 0 ? (
              currentPerdidas.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.descripcion}</td>
                  <td>{new Date(p.fecha).toLocaleDateString('es-AR')}</td>  
                  <td>{p.cantidad}</td>             
                  <td>{p.motivo}</td>             
                  <td>${p.cantidad * p.precio_costo}</td>
                  <td>
                    <button className="btn btn-link text-primary me-2" onClick={() => handleVerPerdida(p.id)}>
                      <FaEye />
                    </button>
                    <button className="btn btn-link text-warning me-2" onClick={() => handleEditarPerdida(p.id)}>
                      <FaEdit />
                    </button>
                    <button className="btn btn-link text-danger" onClick={() => handleEliminarClick(p.id)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No se encontraron pérdidas.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {rol === 'admin' && (
        <div className="d-flex justify-content-between mt-3">
          <button className="btn btn-success" onClick={handleNuevaPerdida}>
            NUEVA PÉRDIDA
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
              <h5>¿ESTÁ SEGURO QUE DESEA ELIMINAR EL REGISTRO?</h5>
              <div className="d-flex justify-content-around mt-4">
                <button type="button" className="btn btn-danger" data-bs-dismiss="modal">
                  CANCELAR
                </button>
                <button type="button" className="btn btn-success" onClick={confirmarEliminacion}>
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
