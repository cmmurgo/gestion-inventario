import React, { useState, useEffect, useRef } from 'react';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../api';
import '../../App.css';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default function Clientes() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const [clienteAEliminar, setClienteAEliminar] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [mostrarMensaje, setMostrarMensaje] = useState(false);

  const [idFiltro, setIdFiltro] = useState('');
  const [apellidoFiltro, setApellidoFiltro] = useState('');

  const modalRef = useRef(null);
  const [rol, setRol] = useState('');

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentClientes = clientesFiltrados.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(clientesFiltrados.length / itemsPerPage);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/api/clientes`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setClientes(data);
        setClientesFiltrados(data);
      })
      .catch(err => console.error('Error al cargar clientes:', err));
  }, []);

  useEffect(() => {
    const filtrados = clientes.filter(cliente => {
      const coincideId = idFiltro ? cliente.id.toString().includes(idFiltro) : true;
      const coincideApellido = apellidoFiltro
        ? cliente.apellido.toLowerCase().includes(apellidoFiltro.toLowerCase())
        : true;
      return coincideId && coincideApellido;
    });
    setClientesFiltrados(filtrados);
    setCurrentPage(1);
  }, [idFiltro, apellidoFiltro, clientes]);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole) setRol(userRole);
  }, []);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const confirmarEliminacion = () => {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/api/clientes/${clienteAEliminar}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (res.ok) {
          const nuevosClientes = clientes.filter(c => c.id !== clienteAEliminar);
          setClientes(nuevosClientes);
          setClientesFiltrados(nuevosClientes);
          setMensaje('Cliente eliminado con éxito');
          setTipoMensaje('success');
        } else {
          setMensaje('Error al eliminar el cliente');
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

  const handleNuevoCliente = () => {
    navigate('/clientes/crear');
  };

  const handleEditarCliente = (id) => {
    navigate(`/clientes/editar/${id}`);
  };

  const handleVerCliente = (id) => {
    navigate(`/clientes/ver/${id}`);
  };

  const handleEliminarClick = (id) => {
    setClienteAEliminar(id);
    const modal = new bootstrap.Modal(modalRef.current);
    modal.show();
  };

  return (
    <div className="container py-4">
      <div className={`alert text-center mt-3 ${tipoMensaje === 'success' ? 'alert-success' : 'alert-danger'} ${mostrarMensaje ? 'show' : ''}`}>
        {tipoMensaje === 'success' ? '✅' : '❌'} {mensaje}
      </div>

      <h5 className="fw-bold mb-4">LISTADO DE CLIENTES</h5>

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
            placeholder="🔍 Buscar por apellido"
            value={apellidoFiltro}
            onChange={(e) => setApellidoFiltro(e.target.value)}
          />
        </div>
      </div>

      <div className="table-responsive" style={{ maxHeight: '500px', overflowY: 'auto' }}>
        <table className="table table-bordered text-center align-middle">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>NOMBRE</th>
              <th>APELLIDO</th>
              <th>EMAIL</th>
              <th>CUIT/CUIL</th>
              <th>DIRECCIÓN</th>
              <th>TELÉFONO</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {currentClientes.length > 0 ? (
              currentClientes.map((cliente) => (
                <tr key={cliente.id}>
                  <td>{cliente.id}</td>
                  <td>{cliente.nombre}</td>
                  <td>{cliente.apellido}</td>
                  <td>{cliente.email}</td>
                  <td>{cliente.cuit_cuil}</td>
                  <td>{cliente.direccion}</td>
                  <td>{cliente.telefono}</td>
                  <td>
                    <button className="btn btn-link text-primary me-2" onClick={() => handleVerCliente(cliente.id)}>
                      <FaEye />
                    </button>
                    {rol === 'admin' && (
                      <>
                        <button className="btn btn-link text-warning me-2" onClick={() => handleEditarCliente(cliente.id)}>
                          <FaEdit />
                        </button>
                        <button className="btn btn-link text-danger" onClick={() => handleEliminarClick(cliente.id)}>
                          <FaTrash />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No se encontraron clientes.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {rol === 'admin' && (
        <div className="d-flex justify-content-between mt-3">
          <button className="btn btn-success" onClick={handleNuevoCliente}>
            NUEVO CLIENTE
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
