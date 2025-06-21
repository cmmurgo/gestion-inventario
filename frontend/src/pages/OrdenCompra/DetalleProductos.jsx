// src/pages/OrdenCompra/DetalleProductos.jsx
import React from 'react';
import { FaTrashAlt, FaEye, FaPlus, FaBox, FaExclamationCircle } from 'react-icons/fa';

export default function DetalleProductos({
  productos,
  detalles,
  setDetalles,
  isCompra = false,
  esEdicion = false,
  abrirModalProducto,
  errores = {},
  disabled = false,
  loadingProductos = false
}) {

  const agregarDetalle = () => {
    if (disabled) return;
    setDetalles([...detalles, { id_producto: '', cantidad: 1 }]);
  };

  const eliminarDetalle = (index) => {
    if (disabled) return;
    const nuevosDetalles = detalles.filter((_, i) => i !== index);
    setDetalles(nuevosDetalles);
  };

  const actualizarDetalle = (index, campo, valor) => {
    if (disabled) return;
    const nuevosDetalles = [...detalles];
    
    if (campo === 'id_producto') {
      const productoSeleccionado = productos.find(p => p.id === parseInt(valor));
      nuevosDetalles[index].id_producto = valor;
      if (productoSeleccionado) {
        nuevosDetalles[index].precio_unitario_costo = productoSeleccionado.precio_costo;
        nuevosDetalles[index].nombre_producto = productoSeleccionado.nombre;
      }
    } else {
      nuevosDetalles[index][campo] = valor;
    }
    
    setDetalles(nuevosDetalles);
  };

  const getPrecioUnitario = (detalle) => {
    if (esEdicion && detalle.precio_unitario_costo) {
        return parseFloat(detalle.precio_unitario_costo).toFixed(2);
    }
    const product = productos.find(p => p.id === detalle.id_producto);
    if (product) {
        return isCompra ? parseFloat(product.precio_costo).toFixed(2) : parseFloat(product.precio_venta).toFixed(2);
    }
    return '0.00';
  };

  const getSubtotal = (detalle) => {
    const cantidad = parseFloat(detalle.cantidad) || 0;
    const precio = parseFloat(getPrecioUnitario(detalle)) || 0;
    return (cantidad * precio).toFixed(2);
  };

  return (
    <>
      <h5 className="mt-4">DETALLES DE PRODUCTOS</h5>

      {loadingProductos ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Cargando productos...</span>
          </div>
          <p className="text-muted">Cargando productos del proveedor...</p>
        </div>
      ) : productos.length === 0 ? (
        <div className="alert alert-info d-flex align-items-center" role="alert">
          <FaExclamationCircle className="me-2" />
          <div>
            <strong>Sin productos disponibles</strong>
            <br />
            <small>Seleccione primero un proveedor para ver los productos disponibles.</small>
          </div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio Unit.</th>
                <th>Total</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {detalles.map((detalle, index) => {
                const currentProduct = productos.find(p => p.id === detalle.id_producto);
                const isValidProduct = !!currentProduct || (esEdicion && detalle.id_producto && detalle.nombre_producto);

                return (
                  <tr key={index} className={errores[`detalleProducto_${index}`] || errores[`detalleCantidad_${index}`] ? 'table-danger' : ''}>
                    <td>
                      <div className="d-flex align-items-center gap-1">
                        <select
                          className={`form-control ${errores[`detalleProducto_${index}`] ? 'is-invalid' : detalle.id_producto ? 'is-valid' : ''}`}
                          value={detalle.id_producto || ''}
                          onChange={(e) => actualizarDetalle(index, 'id_producto', parseInt(e.target.value))}
                          disabled={disabled}
                        >
                          <option value="">Seleccionar</option>
                          {productos.map((prod) => (
                            <option key={prod.id} value={prod.id}>
                              {prod.nombre} - ${parseFloat(prod.precio_costo || 0).toFixed(2)}
                            </option>
                          ))}
                        </select>
                      </div>
                      {errores[`detalleProducto_${index}`] && (
                        <small className="text-danger d-flex align-items-center mt-1">
                          <FaExclamationCircle className="me-1" />
                          {errores[`detalleProducto_${index}`]}
                        </small>
                      )}
                    </td>
                    
                    <td>
                      <input
                        type="number"
                        className={`form-control text-center ${errores[`detalleCantidad_${index}`] ? 'is-invalid' : detalle.cantidad > 0 ? 'is-valid' : ''}`}
                        value={detalle.cantidad || ''}
                        onChange={(e) => actualizarDetalle(index, 'cantidad', e.target.value)}
                        disabled={disabled}
                        min="1"
                        step="1"
                      />
                      {errores[`detalleCantidad_${index}`] && (
                        <small className="text-danger d-flex align-items-center mt-1">
                          <FaExclamationCircle className="me-1" />
                          {errores[`detalleCantidad_${index}`]}
                        </small>
                      )}
                    </td>

                    <td className="text-center">
                      <span className="fw-bold text-success">
                        ${getPrecioUnitario(detalle)}
                      </span>
                    </td>

                    <td className="text-center">
                      <span className="fw-bold text-primary">
                        ${getSubtotal(detalle)}
                      </span>
                    </td>

                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => eliminarDetalle(index)}
                          title="Eliminar producto"
                          disabled={disabled}
                        >
                          X
                        </button>
                        {isValidProduct && abrirModalProducto && (
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => abrirModalProducto(detalle.id_producto)}
                            title="Ver detalles del producto"
                          >
                            <FaEye />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <button 
            className="btn btn-secondary mb-3" 
            onClick={agregarDetalle} 
            disabled={disabled || productos.length === 0}
          >
            + Agregar producto
          </button>
        </div>
      )}
    </>
  );
}