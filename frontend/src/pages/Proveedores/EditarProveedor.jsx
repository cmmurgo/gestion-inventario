import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../api';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';

function EditarProveedor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const modalRef = useRef(null);

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [contacto, setContacto] = useState('');
  const [direccion, setDireccion] = useState('');
  const [cuit, setCuit] = useState('');
  const [rubro, setRubro] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [mostrarMensaje, setMostrarMensaje] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    axios.get(`${API_URL}/api/proveedores/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        const { nombre, email, telefono, contacto, direccion, cuit, rubro } = res.data;
        setNombre(nombre);
        setEmail(email);
        setTelefono(telefono);
        setContacto(contacto);
        setDireccion(direccion);
        setCuit(cuit);
        setRubro(rubro);
      })
      .catch(err => {
        console.error(err);
        setMensaje('Error al cargar proveedor');
        setTipoMensaje('error');
        setMostrarMensaje(true);
      });
  }, [navigate, id]);

  const handleGuardar = async () => {
    const token = localStorage.getItem('token');
    const proveedorData = { nombre, email, telefono, contacto, direccion, cuit, rubro };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMensaje('Ingrese un email válido');
      setTipoMensaje('error');
      setMostrarMensaje(true);
      setTimeout(() => setMostrarMensaje(false), 3000);
      return;
    }

    try {
      await axios.put(`${API_URL}/api/proveedores/${id}`, proveedorData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMensaje('Proveedor actualizado correctamente');
      setTipoMensaje('success');
      setMostrarMensaje(true);
      setTimeout(() => {
        setMostrarMensaje(false);
        navigate('/proveedores');
      }, 3000);
      const modal = bootstrap.Modal.getInstance(modalRef.current);
      if (modal) modal.hide();
    } catch (error) {
      console.error(error);
      setMensaje('Error al actualizar proveedor');
      setTipoMensaje('error');
      setMostrarMensaje(true);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h4>EDITAR PROVEEDOR</h4>
      <div style={{ background: '#eee', padding: '2rem', maxWidth: '400px' }}>
        <div className="mb-3">
          <label className="form-label">Nombre:</label>
          <input type="text" className="form-control" value={nombre} onChange={e => setNombre(e.target.value)} />
        </div>

        <div className="mb-3">
          <label className="form-label">Email:</label>
          <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} />
        </div>

        <div className="mb-3">
          <label className="form-label">Teléfono:</label>
          <input type="text" className="form-control" value={telefono} onChange={e => setTelefono(e.target.value)} />
        </div>

        <div className="mb-3">
          <label className="form-label">Contacto:</label>
          <input type="text" className="form-control" value={contacto} onChange={e => setContacto(e.target.value)} />
        </div>

        <div className="mb-3">
          <label className="form-label">Dirección:</label>
          <input type="text" className="form-control" value={direccion} onChange={e => setDireccion(e.target.value)} />
        </div>

        <div className="mb-3">
          <label className="form-label">CUIT:</label>
          <input type="text" className="form-control" value={cuit} onChange={e => setCuit(e.target.value)} />
        </div>

        <div className="mb-3">
          <label className="form-label">Rubro:</label>
          <input type="text" className="form-control" value={rubro} onChange={e => setRubro(e.target.value)} />
        </div>
      </div>

      <div className={`alert text-center mt-3 ${tipoMensaje === 'success' ? 'alert-success' : 'alert-danger'} ${mostrarMensaje ? 'show' : ''}`}>
        {tipoMensaje === 'success' ? '✅' : '❌'} {mensaje}
      </div>

      <div className="d-flex justify-content-between mt-4" style={{ maxWidth: '400px' }}>
        <button className="btn btn-dark" onClick={() => navigate('/proveedores')}>Volver</button>
        <button className="btn btn-success" onClick={handleGuardar}>GUARDAR CAMBIOS</button>
      </div>
    </div>
  );
}

export default EditarProveedor;