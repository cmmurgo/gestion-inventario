// src/pages/OrdenCompra/ComboboxProveedores.jsx
import React, { useState } from 'react';
import { FaBuilding, FaExclamationCircle } from 'react-icons/fa';
import { API_URL } from '../../api';
import axios from 'axios';

function ComboboxProveedores({ proveedores, idProveedor, setIdProveedor, error, disabled = false, loading = false }) {
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const abrirModalProveedor = async () => {
    if (!idProveedor) return;

    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/api/proveedores/${idProveedor}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProveedorSeleccionado(res.data);
      setModalVisible(true);
    } catch (error) {
      console.error('Error al obtener datos del proveedor:', error);
    }
  };

  return (
    <>
      <div className="mb-3 d-flex justify-content-between" style={{ gap: '1rem' }}>
        <div style={{ flex: 2 }}>
          <label className="form-label">PROVEEDOR:</label>

          {loading ? (
            <div className="d-flex align-items-center">
              <div className="spinner-border spinner-border-sm me-2" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <span className="text-muted">Cargando proveedores...</span>
            </div>
          ) : (
            <div className="d-flex align-items-center gap-2">
              <select
                className={`form-control ${error ? 'is-invalid' : idProveedor ? 'is-valid' : ''}`}
                value={idProveedor}
                onChange={(e) => setIdProveedor(e.target.value)}
                disabled={disabled}
              >
                <option value="">Seleccionar proveedor</option>
                {proveedores && proveedores.length > 0 ? (
                  proveedores.map(proveedor => (
                    <option key={proveedor.id} value={proveedor.id}>
                      {proveedor.nombre}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>No hay proveedores disponibles</option>
                )}
              </select>

              {idProveedor && (
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={abrirModalProveedor}
                  title="Ver datos del proveedor"
                >
                  <FaBuilding />
                </button>
              )}
            </div>
          )}

          {error && (
            <div className="invalid-feedback d-flex align-items-center">
              <FaExclamationCircle className="me-1" />
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Modal Bootstrap para mostrar los datos del proveedor */}
      {modalVisible && proveedorSeleccionado && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Datos del Proveedor</h5>
                <button type="button" className="btn-close" onClick={() => setModalVisible(false)}></button>
              </div>
              <div className="modal-body">
                <p><strong>Nombre:</strong> {proveedorSeleccionado.nombre}</p>
                <p><strong>Email:</strong> {proveedorSeleccionado.email}</p>
                <p><strong>Teléfono:</strong> {proveedorSeleccionado.telefono}</p>
                <p><strong>Contacto:</strong> {proveedorSeleccionado.contacto}</p>
                <p><strong>Dirección:</strong> {proveedorSeleccionado.direccion}</p>
                <p><strong>CUIT:</strong> {proveedorSeleccionado.cuit}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModalVisible(false)}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ComboboxProveedores;
