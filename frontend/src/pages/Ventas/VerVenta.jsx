import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '../../api';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';

const EditarVenta = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [venta, setVenta] = useState({});
  const [detalles, setDetalles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }
    cargarVenta(token);
    cargarDetalles(token);
  }, [id, navigate]);

  const cargarVenta = async (token) => {
    try {
      const res = await axios.get(`${API_URL}/api/ventas/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVenta(res.data);
    } catch (error) {
      console.error('Error al cargar la venta:', error);
      alert('Error al cargar la venta. Por favor, intente nuevamente.');
    }
  };

  const cargarDetalles = async (token) => {
    try {
      const res = await axios.get(`${API_URL}/api/ventas/detalle/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDetalles(res.data);
    } catch (error) {
      console.error('Error al cargar los detalles:', error);
      alert('Error al cargar los detalles. Por favor, intente nuevamente.');
    }
  };

  const guardarCambios = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`${API_URL}/api/ventas/${id}`, venta, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Cambios guardados');
      // Recargar datos actualizados después de guardar
      cargarVenta(token);
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
      alert('Error al guardar los cambios.');
    }
  };

  const verCliente = () => {
    if (venta.id_cliente) {
      navigate(`/clientes/ver/${venta.id_cliente}`);
    } else {
      alert('No hay cliente asignado a esta venta');
    }
  };

  const totalPages = Math.ceil(detalles.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDetallesVentas = detalles.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const normalizeFecha = (fecha) => {
    if (!fecha) return '';
    return fecha.split('T')[0]; 
  };
 
  return (
    <div style={{ maxWidth: '900px', margin: 'auto', fontFamily: 'Arial' }}>
      <h2>VENTA ID: {venta.id ?? 'Cargando...'}</h2>

      {/* CABECERA */}
      <div style={styles.cabecera}>
  {/* Inputs uno debajo del otro */}
  <div style={styles.colInputs}>
    <div style={styles.formRow}>
      <label>FECHA:</label>
      <input
        type="date"
        value={normalizeFecha(venta.fecha) || ''}
        disabled
        onChange={(e) => setVenta({ ...venta, fecha: e.target.value })}
      />
    </div>
    <div style={styles.formRow}>
      <label>CUIL/CUIT CLIENTE:</label>
      <input
        type="text"
        value={venta.cuit_cuil || ''}
        disabled
        onChange={(e) => setVenta({ ...venta, cuit_cuil: e.target.value })}
      />
    </div>
    <div style={styles.formRow}>
      <label>ID CLIENTE:</label>
      
      <input type="text" value={venta.id_cliente || ''} disabled />
    </div>
  </div>

  {/* Botones uno debajo del otro al costado */}
  <div style={styles.colBotones}>
    <button className="btn btn-primary mb-2" onClick={verCliente}>
      INFORMACIÓN COMPLETA DEL CLIENTE
    </button>
  
  </div>
</div>


      {/* DETALLES */}
      <h3>DETALLES DE VENTA:</h3>
      <div className="table-responsive" style={{ maxHeight: '500px', overflowY: 'auto' }}>

       <table className="table table-bordered text-center align-middle">   
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>PRODUCTO</th>
            <th>CANTIDAD</th>
            <th>PRECIO VENTA ($)</th>
 
          </tr>
        </thead>
        <tbody>
          {currentDetallesVentas.length > 0 ? (
            currentDetallesVentas.map((detalle, index) => (
                <tr key={detalle.id ?? `detalle-${index}`}>
                <td>{detalle.id_producto}</td>
                <td>{detalle.descripcion}</td>
                <td>{detalle.cantidad}</td>
                <td>{detalle.precio_venta}</td>

              </tr>
            ))
          ) : (
            <tr key="no-detalles">
              <td colSpan="5">No se encontraron detalles de venta.</td>
            </tr>
          )}
        </tbody>
      </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="mt-4 d-flex justify-content-center">
          <nav>
            <ul className="pagination mb-0">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  {'<'}
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => (
                <li
                  key={`pagina-${i}`}
                  className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  {'>'}
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}

      <button className="btn btn-dark" onClick={() => navigate('/ventas')}>Volver</button>

    </div>
  );
};

const styles = {
  cabecera: {
    background: '#eee',
    padding: '1em',
    marginBottom: '1em',
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1em',
  },

  colInputs: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '1em',
  },
  
  colBotones: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1em',
    justifyContent: 'flex-start',
  },
  
};

export default EditarVenta;
