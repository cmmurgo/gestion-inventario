import React, { useState, useEffect } from 'react';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../api';

export default function Usuarios() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch(`${API_URL}/api/usuarios`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })
      .then(res => res.json())
      .then(data => {
      setUsuarios(data);
      //.then(data => setUsuarios(data)) 
      //console.log('Datos JSON:', data);  
      })
      .catch(err => console.error('Error al cargar usuarios:', err));
  }, []);

 

  const handleNuevoUsuario = () => {
    navigate('/usuarios/crear');
  };

  const handleEditarUsuario = (id) => {
    navigate(`/usuarios/editar/${id}`);
  };


  return (
    <div className="container py-4">
      <h5 className="fw-bold mb-4">LISTADO DE USUARIOS</h5>

      <div className="row g-2 mb-3">
        <div className="col-md-3">
          <input type="text" className="form-control" placeholder="🔍 Buscar por id" />
        </div>
        <div className="col-md-5">
          <input type="text" className="form-control" placeholder="🔍 Buscar por nombre" />
        </div>
        <div className="col-md-2">
          <button className="btn btn-outline-secondary w-100">🧰 Filtrar</button>
        </div>
      </div>

      <div className="table-responsive">
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
          {usuarios.length > 0 ? (
              usuarios.map(usuario => (
                <tr key={usuario.id}>
                  <td>{usuario.id}</td>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.email}</td>
                  <td>{usuario.rol}</td>
                  <td>
                    <button className="btn btn-link text-primary me-2"><FaEye /></button>
                    <button className="btn btn-link text-warning me-2"   onClick={() => handleEditarUsuario(usuario.id)}><FaEdit /></button>
                    <button className="btn btn-link text-danger"><FaTrash /></button>
                    </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5">Cargando usuarios...</td></tr>)}
          </tbody>
        </table>
      </div>

      {/* Acciones abajo */}
      <div className="d-flex justify-content-between mt-3">
        <button className="btn btn-success" onClick={handleNuevoUsuario}>NUEVO USUARIO</button>
      </div>

      {/* Paginación */}
      <div className="mt-4 d-flex justify-content-center">
        <nav>
          <ul className="pagination mb-0">
            <li className="page-item"><button className="page-link">{'<'}</button></li>
            <li className="page-item"><button className="page-link">1</button></li>
            <li className="page-item active"><button className="page-link">2</button></li>
            <li className="page-item"><button className="page-link">3</button></li>
            <li className="page-item"><button className="page-link">{'>'}</button></li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
