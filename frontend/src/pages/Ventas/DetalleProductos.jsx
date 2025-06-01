import React from 'react';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';


function DetalleProductos({ productos, detalles, setDetalles, abrirModalProducto, esEdicion }) {
  
  const agregarDetalle = () => {
    setDetalles([...detalles, { id_producto: '', nombre: '', cantidad: '', precio_venta: '', total: '' }]);
  };  

  const actualizarDetalle = (index, campo, valor) => {
    const nuevosDetalles = [...detalles];

    if (campo === 'id_producto') {
      const productoSeleccionado = productos.find(p => p.id === parseInt(valor));
      nuevosDetalles[index].id_producto = valor;
      nuevosDetalles[index].precio_venta = productoSeleccionado ? productoSeleccionado.precio_venta : '';
      nuevosDetalles[index].nombre = productoSeleccionado ? productoSeleccionado.nombre : '';
    } else {
      nuevosDetalles[index][campo] = valor;
    }

    const cantidad = parseFloat(nuevosDetalles[index].cantidad) || 0;
    const precio = parseFloat(nuevosDetalles[index].precio_venta) || 0;
    nuevosDetalles[index].total = (cantidad * precio).toFixed(2);

    setDetalles(nuevosDetalles);
  };

  const eliminarDetalle = (index) => {
    const nuevosDetalles = detalles.filter((_, i) => i !== index);
    setDetalles(nuevosDetalles);
  };

  const verCliente = () => {
    window.open(`/clientes/${cliente.id}`, '_blank');
  };

  const verProducto = (id_producto) => {
    window.open(`/productos/${id_producto}`, '_blank');
  };

  return (
    <>

      <h5 className="mt-4">DETALLES DE PRODUCTOS</h5>

      <table className="table table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio de Venta</th>
            <th>Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {detalles.map((detalle, index) => (
            <tr key={index}>
              <td>
                <div className="d-flex align-items-center gap-1">
                  <select
                    className="form-control"
                    value={detalle.id_producto}
                    onChange={(e) => actualizarDetalle(index, 'id_producto', e.target.value)}
                    disabled={esEdicion}
                  >
                    <option value="">Seleccionar</option>
                    {productos.map(p => (
                      <option key={p.id} value={p.id}>{p.nombre}</option>
                    ))}
                  </select>
                </div>
              </td>

              <td>
                <input
                  type="number"
                  className="form-control"
                  value={detalle.cantidad}
                  onChange={(e) => actualizarDetalle(index, 'cantidad', e.target.value)}
                  disabled={esEdicion}
                />
              </td>

              <td>
                <input
                  type="number"
                  className="form-control"
                  value={detalle.precio_venta}
                  disabled
                />
              </td>

              <td>
                <input
                  type="number"
                  className="form-control"
                  value={detalle.total || ''}
                  disabled
                />
              </td>

              <td>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => eliminarDetalle(index)}
                    title="Eliminar producto"
                    disabled={esEdicion}
                  >
                    X
                  </button>
                  {detalle.id_producto && (
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
          ))}
        </tbody>
      </table>

      <button className="btn btn-secondary mb-3" onClick={agregarDetalle} disabled={esEdicion} >+ Agregar producto</button>
    </>
  );
}

export default DetalleProductos;
