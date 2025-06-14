import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductosByRubro } from '../../services/productService';
import { getRubroById } from '../../services/rubroService';

export default function VerProductosRubro() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [productos, setProductos] = useState([]);
    const [nombreRubro, setNombreRubro] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const productosRes = await getProductosByRubro(id);
                setProductos(productosRes.data);

                const rubroRes = await getRubroById(id);
                setNombreRubro(rubroRes.data.nombre);
            } catch (err) {
                console.error('Error al obtener datos:', err);
            }
        };

        fetchData();
    }, [id]);

    return (
        <div className="container py-4">
            <h5 className="fw-bold mb-4">Productos del Rubro: {nombreRubro}</h5>

            <div className="table-responsive">
                <table className="table table-bordered text-center">
                    <thead className="table-light">
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Precio Venta</th>
                            <th>Stock Mínimo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.length > 0 ? (
                            productos.map(p => (
                                <tr key={p.id}>
                                    <td>{p.id}</td>
                                    <td>{p.nombre}</td>
                                    <td>${p.precio_venta}</td>
                                    <td>{p.stock_minimo}</td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="4">Este rubro no tiene productos cargados.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-4">
                <button className="btn btn-dark" onClick={() => navigate('/rubros')}>
                    Volver a Rubros
                </button>
            </div>
        </div>
    );
}
