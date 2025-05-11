import React, { useState, useEffect, useRef } from 'react';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../api';
import '../../App.css';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default function Usuarios() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [mostrarMensaje, setMostrarMensaje] = useState(false);

  const [idFiltro, setIdFiltro] = useState('');
  const [nombreFiltro, setNombreFiltro] = useState('');

  const modalRef = useRef(null);

  // Cálculo de paginación sobre los usuarios filtrados
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsuarios = usuariosFiltrados.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(usuariosFiltrados.length / itemsPerPage);

  // Cargar usuarios
  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/api/usuarios`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsuarios(data);
        setUsuariosFiltrados(data);
      })
      .catch((err) => console.error('Error al cargar usuarios:', err));
  }, []);

  // Filtrado en tiempo real (cada vez que cambian idFiltro, nombreFiltro o usuarios)
  useEffect(() => {
    const filtrados = usuarios.filter((usuario) => {
      const coincideId = idFiltro ? usuario.id.toString().includes(idFiltro) : true;
      const coincideNombre = nombreFiltro
        ? usuario.nombre.toLowerCase().includes(nombreFiltro.toLowerCase())
        : true;
      return coincideId && coincideNombre;
    });
    setUsuariosFiltrados(filtrados);
    setCurrentPage(1); // Reinicia la página actual al aplicar nuevo filtro
  }, [idFiltro, nombreFiltro, usuarios]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const confirmarEliminacion = () => {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/api/usuarios/${usuarioAEliminar}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          const nuevosUsuarios = usuarios.filter((u) => u.id !== usuarioAEliminar);
          setUsuarios(nuevosUsuarios);
          const nuevosFiltrados = usuariosFiltrados.filter((u) => u.id !== usuarioAEliminar);
          setUsuariosFiltrados(nuevosFiltrados);
  
          setMensaje('Usuario eliminado con éxito');
          setTipoMensaje('success');
        } else {
          setMensaje('Error al eliminar el usuario');
          setTipoMensaje('error');
        }
  
        // Mostrar el cartel
        setMostrarMensaje(true);
        setTimeout(() => setMostrarMensaje(false), 3000);
  
        // Cerrar modal manualmente
        const modal = bootstrap.Modal.getInstance(modalRef.current);
        if (modal) modal.hide();
      })
      .catch((err) => {
        console.error('Error en el fetch DELETE:', err);
        setMensaje('Error de conexión con el servidor');
        setTipoMensaje('error');
        setMostrarMensaje(true);
        setTimeout(() => setMostrarMensaje(false), 3000);
  
        const modal = bootstrap.Modal.getInstance(modalRef.current);
        if (modal) modal.hide();
      });
  };
  
  const handleNuevoUsuario = () => {
    navigate('/usuarios/crear');
  };

  const handleEditarUsuario = (id) => {
    navigate(`/usuarios/editar/${id}`);
  };

  const handleEliminarClick = (id) => {
    setUsuarioAEliminar(id);
    const modal = new bootstrap.Modal(modalRef.current);
    modal.show();
  };

  return (
    <div className="container py-4">
      {/* Mensaje de alerta */}
      <div
        className={`alert text-center mt-3 ${tipoMensaje === 'success' ? 'alert-success' : 'alert-danger'} ${mostrarMensaje ? 'show' : ''}`}
        role="alert"
        >
        {tipoMensaje === 'success' ? '✅' : '❌'} {mensaje}
      </div>


      <h5 className="fw-bold mb-4">LISTADO DE USUARIOS</h5>

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
            placeholder="🔍 Buscar por nombre"
            value={nombreFiltro}
            onChange={(e) => setNombreFiltro(e.target.value)}
          />
        </div>
      </div>

      <div className="table-responsive" style={{ maxHeight: '500px', overflowY: 'auto' }}>
        <table className="table table-bordered text-center align-middle">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>NOMBRE DE USUARIO</th>
              <th>EMAIL</th>
              <th>ROL</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {currentUsuarios.length > 0 ? (
              currentUsuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.id}</td>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.email}</td>
                  <td>{usuario.rol}</td>
                  <td>
                    <button className="btn btn-link text-primary me-2">
                      <FaEye />
                    </button>
                    <button
                      className="btn btn-link text-warning me-2"
                      onClick={() => handleEditarUsuario(usuario.id)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn btn-link text-danger"
                      onClick={() => handleEliminarClick(usuario.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No se encontraron usuarios.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between mt-3">
        <button className="btn btn-success" onClick={handleNuevoUsuario}>
          NUEVO USUARIO
        </button>
      </div>

      <div className="mt-4 d-flex justify-content-center">
        <nav>
          <ul className="pagination mb-0">
            <li className={`page-item ${currentPage === 1 && 'disabled'}`}>
              <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                {'<'}
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => (
              <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => handlePageChange(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages && 'disabled'}`}>
              <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                {'>'}
              </button>
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
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={confirmarEliminacion}           
                >
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
