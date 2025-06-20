// src/pages/OrdenCompra/ComboboxProveedores.jsx
import React from 'react';
import { FaBuilding, FaExclamationCircle } from 'react-icons/fa';

function ComboboxProveedores({ proveedores, idProveedor, setIdProveedor, error, disabled = false, loading = false }) {
  return (
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
                onClick={() => {/* Función para ver proveedor si es necesaria */}}
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
  );
}

export default ComboboxProveedores;