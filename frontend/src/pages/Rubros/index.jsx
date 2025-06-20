import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRubros, crearRubro, actualizarRubro, eliminarRubro } from '../../services/rubroService';
import { FaEdit, FaTrash } from 'react-icons/fa';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default function Rubros() {
    const navigate = useNavigate();
    const [rubros, setRubros] = useState([]);
    const [nuevoRubro, setNuevoRubro] = useState('');
    const [editandoId, setEditandoId] = useState(null);
    const [nombreEditado, setNombreEditado] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [tipoMensaje, setTipoMensaje] = useState('');

    const fetchRubros = async () => {
        try {
            const res = await getRubros();
            setRubros(res.data);
        } catch (err) {
            console.error(err);
            mostrarMensaje('Error al obtener rubros', 'error');
        }
    };

    useEffect(() => {
        fetchRubros();
    }, []);

    const [filtroNombre, setFiltroNombre] = useState('');
    const [filtroCantidad, setFiltroCantidad] = useState('');

    const rubrosFiltrados = rubros.filter(r =>
        r.nombre.toLowerCase().includes(filtroNombre.toLowerCase()) &&
        (filtroCantidad ? r.cantidad_productos >= parseInt(filtroCantidad) : true)
    );

    const mostrarMensaje = (texto, tipo) => {
        setMensaje(texto);
        setTipoMensaje(tipo);
        setTimeout(() => setMensaje(''), 3000);
    };

    const handleCrear = async () => {
        if (!nuevoRubro.trim()) return;

        try {
            await crearRubro({ nombre: nuevoRubro.trim() });
            mostrarMensaje('Rubro creado con éxito', 'success');
            setNuevoRubro('');
            fetchRubros();
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                mostrarMensaje(err.response.data.message, 'error');
            } else {
                mostrarMensaje('Error al crear rubro', 'error');
            }
        }
    };

    const handleEditar = (id, nombre) => {
        setEditandoId(id);
        setNombreEditado(nombre);
    };

    const guardarEdicion = async (id) => {
        try {
            await actualizarRubro(id, { nombre: nombreEditado });
            mostrarMensaje('Rubro actualizado', 'success');
            setEditandoId(null);
            fetchRubros();
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                mostrarMensaje(err.response.data.message, 'error');
            } else {
                mostrarMensaje('Error al editar rubro', 'error');
            }
        }
    };

    const handleEliminar = async (id) => {
        if (!window.confirm('¿Eliminar este rubro?')) return;

        try {
            await eliminarRubro(id);
            mostrarMensaje('Rubro eliminado', 'success');
            fetchRubros();
        } catch (err) {
            console.error(err);

            if (err.response && err.response.data && err.response.data.message) {
                mostrarMensaje(err.response.data.message, 'error');
            } else {
                mostrarMensaje('Error al eliminar rubro', 'error');
            }
        }
    };

    return (
        <div className="container py-4">
            <h5 className="fw-bold mb-4">GESTIÓN DE RUBROS</h5>

            {mensaje && (
                <div
                    className={`alert text-center mt-3 ${tipoMensaje === 'success' ? 'alert-success' : 'alert-danger'} show`}
                    role="alert"
                >
                    {tipoMensaje === 'success' ? '✅' : '❌'} {mensaje}
                </div>
            )}

            <div className="row mb-3" style={{ maxWidth: '500px' }}>
                <div className="col">
                    <input className="form-control" placeholder="🔍 Filtrar por nombre" value={filtroNombre} onChange={e => setFiltroNombre(e.target.value)} />
                </div>
                <div className="col">
                    <input className="form-control" type="number" placeholder="🔍 Mínimo productos" value={filtroCantidad} onChange={e => setFiltroCantidad(e.target.value)} />
                </div>
            </div>

            <div className="table-responsive" style={{ maxWidth: '500px' }}>
                <table className="table table-bordered align-middle text-center">
                    <thead className="table-light">
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rubrosFiltrados.map((rubro) => (
                            <tr key={rubro.id}>
                                <td>{rubro.id}</td>
                                <td>
                                    {editandoId === rubro.id ? (
                                        <input
                                            className="form-control"
                                            value={nombreEditado}
                                            onChange={(e) => setNombreEditado(e.target.value)}
                                            onBlur={() => guardarEdicion(rubro.id)}
                                            onKeyDown={(e) => e.key === 'Enter' && guardarEdicion(rubro.id)}
                                            autoFocus
                                        />
                                    ) : (
                                        <span onClick={() => handleEditar(rubro.id, rubro.nombre)} style={{ cursor: 'pointer' }}>
                                            {rubro.nombre} ({rubro.cantidad_productos} productos)
                                        </span>
                                    )}
                                </td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-secondary me-2"
                                        onClick={() => navigate(`/rubros/${rubro.id}/productos`)}
                                    >
                                        Ver productos
                                    </button>

                                    <span
                                        title={rubro.tiene_productos ? 'No se puede eliminar: rubro con productos' : 'Eliminar rubro'}
                                    >
                                        <button
                                            className="btn btn-sm btn-danger"
                                            disabled={rubro.tiene_productos}
                                            onClick={() => handleEliminar(rubro.id)}
                                            style={{ opacity: rubro.tiene_productos ? 0.4 : 1 }}
                                        >
                                            <FaTrash />
                                        </button>
                                    </span>
                                </td>
                            </tr>
                        ))}
                        <tr>
                            <td>#</td>
                            <td>
                                <input
                                    className="form-control"
                                    value={nuevoRubro}
                                    placeholder="Nuevo rubro"
                                    onChange={(e) => setNuevoRubro(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleCrear()}
                                />
                            </td>
                            <td>
                                <button className="btn btn-sm btn-success" onClick={handleCrear}>Agregar</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="mt-4 d-flex justify-content-end" style={{ maxWidth: '500px' }}>
                <button className="btn btn-dark" onClick={() => navigate('/productos')}>
                    Volver
                </button>
            </div>
        </div>
    );
}
