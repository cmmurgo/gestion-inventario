import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProductos, eliminarProducto } from '../../services/productService';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default function Productos() {
  const navigate = useNavigate();
  const modalRef = useRef(null);

  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [mostrarMensaje, setMostrarMensaje] = useState(false);

  const [nombreFiltro, setNombreFiltro] = useState('');
  const [idFiltro, setIdFiltro] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentProductos = productosFiltrados.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(productosFiltrados.length / itemsPerPage);

  useEffect(() => {
    getProductos()
      .then(res => {
        setProductos(res.data);
        setProductosFiltrados(res.data);
      })
      .catch(err => console.error('Error al obtener productos', err));
  }, []);

  useEffect(() => {
    const filtrados = productos.filter(p =>
      (idFiltro ? p.id.toString().includes(idFiltro) : true) &&
      (nombreFiltro ? p.nombre.toLowerCase().includes(nombreFiltro.toLowerCase()) : true)
    );
    setProductosFiltrados(filtrados);
    setCurrentPage(1);
  }, [idFiltro, nombreFiltro, productos]);

  const handleNuevo = () => navigate('/productos/crear');
  const handleVer = (id) => navigate(`/productos/ver/${id}`);
  const handleEditar = (id) => navigate(`/productos/editar/${id}`);
  const handleEliminarClick = (id) => {
    setProductoAEliminar(id);
    new bootstrap.Modal(modalRef.current).show();
  };

  const confirmarEliminacion = async () => {
    try {
      await eliminarProducto(productoAEliminar);
      const nuevos = productos.filter(p => p.id !== productoAEliminar);
      setProductos(nuevos);
      setProductosFiltrados(nuevos);
      setMensaje('Producto eliminado con éxito');
      setTipoMensaje('success');
    } catch (err) {
      console.error(err);
      setMensaje('Error al eliminar producto');
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

      <h5 className="fw-bold mb-4">LISTADO DE PRODUCTOS</h5>

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
              <th>RUBRO</th>
              <th>PROVEEDOR</th>
              <th>PRECIO VENTA</th>
              <th>STOCK MÍNIMO</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {currentProductos.length > 0 ? (
              currentProductos.map((producto) => (
                <tr key={producto.id}>
                  <td>{producto.id}</td>
                  <td>{producto.nombre}</td>
                  <td>{producto.rubro_nombre || '-'}</td>
                  <td>{producto.proveedor_nombre || '-'}</td>
                  <td>${producto.precio_venta}</td>
                  <td>{producto.stock_minimo}</td>
                  <td>
                    <button className="btn btn-link text-primary me-2" onClick={() => handleVer(producto.id)}><FaEye /></button>
                    <button className="btn btn-link text-warning me-2" onClick={() => handleEditar(producto.id)}><FaEdit /></button>
                    <button className="btn btn-link text-danger" onClick={() => handleEliminarClick(producto.id)}><FaTrash /></button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6">No se encontraron productos.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between mt-3">
        <button className="btn btn-success" onClick={handleNuevo}>NUEVO PRODUCTO</button>
        <button className="btn btn-outline-secondary" onClick={() => navigate('/rubros')}>
          GESTION DE RUBROS
        </button>
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
              <h5>¿Está seguro que desea eliminar el producto?</h5>
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
