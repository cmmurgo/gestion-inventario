import React, { useState, useEffect, useRef } from 'react';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../api';
import '../../App.css';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default function Proveedores() {
  const navigate = useNavigate();
  const [proveedores, setProveedores] = useState([]);
  const [proveedoresFiltrados, setProveedoresFiltrados] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const [proveedorAEliminar, setProveedorAEliminar] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [mostrarMensaje, setMostrarMensaje] = useState(false);

  const [idFiltro, setIdFiltro] = useState('');
  const [nombreFiltro, setNombreFiltro] = useState('');
  const [rubroFiltro, setRubroFiltro] = useState('');

  const modalRef = useRef(null);
  const [rol, setRol] = useState('');

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProveedores = proveedoresFiltrados.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(proveedoresFiltrados.length / itemsPerPage);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/api/proveedores`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setProveedores(data);
        setProveedoresFiltrados(data);
      })
      .catch(err => console.error('Error al cargar proveedores:', err));
  }, []);

  useEffect(() => {
    const filtrados = proveedores.filter(proveedor => {
      const coincideId = idFiltro ? proveedor.id.toString().includes(idFiltro) : true;
      const coincideNombre = nombreFiltro ? proveedor.nombre.toLowerCase().includes(nombreFiltro.toLowerCase()) : true;
      const coincideRubro = rubroFiltro ? proveedor.rubro.toLowerCase().includes(rubroFiltro.toLowerCase()) : true;
      return coincideId && coincideNombre && coincideRubro;
    });
    setProveedoresFiltrados(filtrados);
    setCurrentPage(1);
  }, [idFiltro, nombreFiltro, rubroFiltro, proveedores]);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole) setRol(userRole);
  }, []);

  const handlePageChange = page => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const confirmarEliminacion = () => {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/api/proveedores/${proveedorAEliminar}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (res.ok) {
          const nuevosProveedores = proveedores.filter(p => p.id !== proveedorAEliminar);
          setProveedores(nuevosProveedores);
          setProveedoresFiltrados(nuevosProveedores);
          setMensaje('Proveedor eliminado con éxito');
          setTipoMensaje('success');
        } else {
          setMensaje('Error al eliminar el proveedor');
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

  const handleNuevoProveedor = () => {
    navigate('/proveedores/crear');
  };

  const handleEditarProveedor = id => {
    navigate(`/proveedores/editar/${id}`);
  };

  const handleVerProveedor = id => {
    navigate(`/proveedores/ver/${id}`);
  };

  const handleEliminarClick = id => {
    setProveedorAEliminar(id);
    const modal = new bootstrap.Modal(modalRef.current);
    modal.show();
  };

  return (
    <div className="container py-4">
      <h5 className="fw-bold mb-4">LISTADO DE PROVEEDORES</h5>

      <div className="row g-2 mb-3">
        <div className="col-md-3">
          <input type="text" className="form-control" placeholder="🔍 Buscar por ID" value={idFiltro} onChange={e => setIdFiltro(e.target.value)} />
        </div>
        <div className="col-md-5">
          <input type="text" className="form-control" placeholder="🔍 Buscar por nombre" value={nombreFiltro} onChange={e => setNombreFiltro(e.target.value)} />
        </div>
        <div className="col-md-4">
          <input type="text" className="form-control" placeholder="🔍 Buscar por rubro" value={rubroFiltro} onChange={e => setRubroFiltro(e.target.value)} />
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered text-center align-middle">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>NOMBRE</th>
              <th>EMAIL</th>
              <th>TELÉFONO</th>
              <th>CONTACTO</th>
              <th>DIRECCIÓN</th>
              <th>CUIT</th>
              <th>RUBRO</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {currentProveedores.length > 0 ? (
              currentProveedores.map(proveedor => (
                <tr key={proveedor.id}>
                  <td>{proveedor.id}</td>
                  <td>{proveedor.nombre}</td>
                  <td>{proveedor.email}</td>
                  <td>{proveedor.telefono}</td>
                  <td>{proveedor.contacto}</td>
                  <td>{proveedor.direccion}</td>
                  <td>{proveedor.cuit}</td>
                  <td>{proveedor.rubro}</td>
                  <td>
                    <button className="btn btn-link text-primary me-2" onClick={() => handleVerProveedor(proveedor.id)}>
                      <FaEye />
                    </button>
                    <button className="btn btn-link text-warning me-2" onClick={() => handleEditarProveedor(proveedor.id)}>
                      <FaEdit />
                    </button>
                    <button className="btn btn-link text-danger" onClick={() => handleEliminarClick(proveedor.id)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9">No se encontraron proveedores.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {rol === 'admin' && (
        <button className="btn btn-success mt-3" onClick={handleNuevoProveedor}>
          NUEVO PROVEEDOR
        </button>
      )}
    </div>
  );
}