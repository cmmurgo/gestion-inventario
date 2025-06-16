import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductosByPromocion } from '../../services/promocionService';
import { getPromocionById } from '../../services/promocionService';

export default function VerProductosPromocion() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [productos, setProductos] = useState([]);
    const [promoNombre, setPromoNombre] = useState('');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [esActiva, setEsActiva] = useState(false);

    useEffect(() => {
        getProductosByPromocion(id)
            .then(res => setProductos(res.data))
            .catch(() => setError('Error al obtener productos'));

        getPromocionById(id)
            .then(res => {
                const promo = res.data;
                setPromoNombre(promo.nombre);
                setFechaInicio(promo.fecha_inicio?.slice(0, 10));
                setFechaFin(promo.fecha_fin?.slice(0, 10));
                // Verifica si la promocion está activa
                const hoy = new Date().toISOString().slice(0, 10);
                setEsActiva(hoy >= promo.fecha_inicio?.slice(0, 10) && hoy <= promo.fecha_fin?.slice(0, 10));
            })
            .catch(() => setPromoNombre(''));
    }, [id]);

    return (
        <div className="container py-4">
            <h5 className="fw-bold mb-3">
                PRODUCTOS CON LA PROMOCIÓN: {promoNombre || `#${id}`}
            </h5>
            <p className="mb-4">
                Vigencia: {fechaInicio} a {fechaFin}{' '}
                <span className={`badge ${esActiva ? 'bg-success' : 'bg-danger'}`}>
                    {esActiva ? 'Activa' : 'Inactiva'}
                </span>
            </p>
            <div className="table-responsive">
                <table className="table table-bordered text-center align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Rubro</th>
                            <th>Precio Venta</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.length > 0 ? (
                            productos.map(p => (
                                <tr key={p.id}>
                                    <td>{p.id}</td>
                                    <td
                                        className="text-primary"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => navigate(`/productos/ver/${p.id}`)}
                                    >
                                        {p.nombre}
                                    </td>
                                    <td>{p.rubro}</td>
                                    <td>${p.precio_venta}</td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="4">No hay productos asociados a esta promoción.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            <button className="btn btn-dark mt-3" onClick={() => navigate('/promociones')}>
                Volver
            </button>
        </div>
    );
}
