import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProductosEliminados, restaurarProducto } from '../../services/productService';
import { FaEye, FaUndo } from 'react-icons/fa';

export default function ProductosEliminados() {
    const navigate = useNavigate();
    const [productos, setProductos] = useState([]);
    const [mensaje, setMensaje] = useState('');
    const [tipoMensaje, setTipoMensaje] = useState('');

    useEffect(() => {
        getProductosEliminados()
            .then(res => setProductos(res.data))
            .catch(err => {
                console.error('Error al obtener productos eliminados', err);
                setMensaje('Error al obtener productos eliminados');
                setTipoMensaje('error');
            });
    }, []);

    const handleRestaurar = async (id) => {
        try {
            await restaurarProducto(id);
            setProductos(productos.filter(p => p.id !== id));
            setMensaje('Producto restaurado con éxito');
            setTipoMensaje('success');
        } catch (err) {
            console.error('Error al restaurar producto', err);
            setMensaje('Error al restaurar producto');
            setTipoMensaje('error');
        }
        setTimeout(() => setMensaje(''), 3000);
    };

    return (
        <div className="container py-4">
            <h5 className="fw-bold mb-4">PRODUCTOS ELIMINADOS</h5>

            {mensaje && (
                <div className={`alert ${tipoMensaje === 'success' ? 'alert-success' : 'alert-danger'}`}>
                    {tipoMensaje === 'success' ? '✅' : '❌'} {mensaje}
                </div>
            )}

            <div className="table-responsive">
                <table className="table table-bordered text-center align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>ID</th>
                            <th>NOMBRE</th>
                            <th>RUBRO</th>
                            <th>PROVEEDOR</th>
                            <th>PRECIO VENTA</th>
                            <th>ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.length > 0 ? (
                            productos.map(p => (
                                <tr key={p.id}>
                                    <td>{p.id}</td>
                                    <td>
                                        <button
                                            className="btn btn-link text-primary p-0"
                                            onClick={() => navigate(`/productos/ver/${p.id}`)}
                                        >
                                            {p.nombre}
                                        </button>
                                    </td>
                                    <td>{p.rubro_nombre || '-'}</td>
                                    <td>{p.proveedor_nombre || '-'}</td>
                                    <td>${p.precio_venta}</td>
                                    <td>
                                        <button
                                            className="btn btn-link text-success"
                                            onClick={() => handleRestaurar(p.id)}
                                            title="Restaurar"
                                        >
                                            <FaUndo />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6">No hay productos eliminados.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <button className="btn btn-secondary mt-3" onClick={() => navigate('/productos')}>Volver</button>
        </div>
    );
}