import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPromociones, eliminarPromocion } from '../../services/promocionService';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default function Promociones() {
  const navigate = useNavigate();
  const modalRef = useRef(null);

  const [promos, setPromos] = useState([]);
  const [filtrados, setFiltrados] = useState([]);
  const [promoAEliminar, setPromoAEliminar] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [mostrarMensaje, setMostrarMensaje] = useState(false);

  const [nombreFiltro, setNombreFiltro] = useState('');
  const [idFiltro, setIdFiltro] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentPromos = filtrados.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtrados.length / itemsPerPage);

  useEffect(() => {
    getPromociones()
      .then(res => {
        setPromos(res.data);
        setFiltrados(res.data);
      })
      .catch(err => console.error('Error al obtener promociones', err));
  }, []);

  useEffect(() => {
    const filtrados = promos.filter(p =>
      (idFiltro ? p.id.toString().includes(idFiltro) : true) &&
      (nombreFiltro ? p.nombre.toLowerCase().includes(nombreFiltro.toLowerCase()) : true)
    );
    setFiltrados(filtrados);
    setCurrentPage(1);
  }, [idFiltro, nombreFiltro, promos]);

  const handleNuevo = () => navigate('/promociones/crear');
  const handleVer = (id) => navigate(`/promociones/ver/${id}`);
  const handleEditar = (id) => navigate(`/promociones/editar/${id}`);
  const handleEliminarClick = (id) => {
    setPromoAEliminar(id);
    new bootstrap.Modal(modalRef.current).show();
  };

  const confirmarEliminacion = async () => {
    try {
      await eliminarPromocion(promoAEliminar);
      const nuevos = promos.filter(p => p.id !== promoAEliminar);
      setPromos(nuevos);
      setFiltrados(nuevos);
      setMensaje('Promoción eliminada con éxito');
      setTipoMensaje('success');
    } catch (err) {
      console.error(err);
      setMensaje('Error al eliminar promoción');
      setTipoMensaje('error');
    }

    setMostrarMensaje(true);
    setTimeout(() => setMostrarMensaje(false), 3000);
    const modal = bootstrap.Modal.getInstance(modalRef.current);
    if (modal) modal.hide();
  };

  return (
    <div className="container py-4">
      <div className={`alert text-center ${tipoMensaje === 'success' ? 'alert-success' : 'alert-danger'} ${mostrarMensaje ? 'show' : 'd-none'}`}>
        {tipoMensaje === 'success' ? '✅' : '❌'} {mensaje}
      </div>

      <h5 className="fw-bold mb-4">LISTADO DE PROMOCIONES</h5>

      <div className="row g-2 mb-3">
        <div className="col-md-3">
          <input type="text" className="form-control" placeholder="🔍 Buscar por ID" value={idFiltro} onChange={(e) => setIdFiltro(e.target.value)} />
        </div>
        <div className="col-md-5">
          <input type="text" className="form-control" placeholder="🔍 Buscar por nombre" value={nombreFiltro} onChange={(e) => setNombreFiltro(e.target.value)} />
        </div>
      </div>

      <div className="table-responsive" style={{ maxHeight: '500px', overflowY: 'auto' }}>
        <table className="table table-bordered text-center align-middle">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>NOMBRE</th>
              <th>PORCENTAJE</th>
              <th>FECHA INICIO</th>
              <th>FECHA FIN</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {currentPromos.length > 0 ? (
              currentPromos.map(promo => (
                <tr key={promo.id}>
                  <td>{promo.id}</td>
                  <td>{promo.nombre}</td>
                  <td>{promo.porcentaje}%</td>
                  <td>{promo.fecha_inicio}</td>
                  <td>{promo.fecha_fin}</td>
                  <td>
                    <button className="btn btn-link text-primary me-2" onClick={() => handleVer(promo.id)}><FaEye /></button>
                    <button className="btn btn-link text-warning me-2" onClick={() => handleEditar(promo.id)}><FaEdit /></button>
                    <button className="btn btn-link text-danger" onClick={() => handleEliminarClick(promo.id)}><FaTrash /></button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6">No se encontraron promociones.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between mt-3">
        <button className="btn btn-success" onClick={handleNuevo}>NUEVA PROMOCIÓN</button>
      </div>

      <div className="mt-4 d-flex justify-content-center">
        <nav>
          <ul className="pagination mb-0">
            <li className={`page-item ${currentPage === 1 && 'disabled'}`}>
              <button className="page-link" onClick={() => setCurrentPage(prev => prev - 1)}>{'<'}</button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => (
              <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages && 'disabled'}`}>
              <button className="page-link" onClick={() => setCurrentPage(prev => prev + 1)}>{'>'}</button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Modal de confirmación */}
      <div className="modal fade" id="confirmarEliminacion" tabIndex="-1" ref={modalRef}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-center">
              <h5>¿Está seguro que desea eliminar la promoción?</h5>
              <div className="d-flex justify-content-around mt-4">
                <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
                <button type="button" className="btn btn-success" onClick={confirmarEliminacion}>Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
