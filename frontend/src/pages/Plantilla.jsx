import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { FaBars, FaHome, FaUsers, FaUserFriends } from 'react-icons/fa';
import logo from '../assets/logo.png';
import { useUser } from '../context/UserContext.jsx';
import { useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import icono_home from '../assets/home.png';
import icono_usuario from '../assets/usuario.png';
import icono_clientes from '../assets/clientes.png';
import icono_ventas from '../assets/ventas.png';
import icono_compras from '../assets/compras.png';
import icono_proveedores from '../assets/proveedores.png';
import icono_productos from '../assets/productos.png';
import icono_promociones from '../assets/promociones.png';
import icono_perdidas from '../assets/perdidas.png';
import icono_inventario from '../assets/inventario.png';
import icono_salir from '../assets/salir.png';

export default function Plantilla() {
  const { user } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');

    if (!token) {
      navigate('/');
    } else {
      setUserRole(role);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  return (
    <div className="app-container">
      {/* Topbar */}
      <div
        className="topbar d-flex justify-content-between align-items-center text-white px-3 py-2"
        style={{ backgroundColor: '#6a0dad' }}
      >
        {/* Sección izquierda: Hamburguesa + logo + título */}
        <div className="d-flex align-items-center">
          <button className="btn btn-outline-light me-3" onClick={toggleSidebar}>
            <FaBars />
          </button>
          <img src={logo} alt="Logo" style={{ height: '40px', marginRight: '15px' }} />
          <span className="fw-bold">SISTEMA DE GESTIÓN DE INVENTARIO</span>
        </div>

        {/* Sección derecha: usuario */}
        <span>USUARIO: {user?.name }</span>
      </div>


      {/* Contenido debajo del topbar */}
      <div className="main d-flex" style={{ height: 'calc(100vh - 64px)' }}>
        {/* Sidebar */}
        {sidebarOpen && (
          <div
            className="bg-light p-3 border-end"
            style={{ width: '220px' }}
          >     
            <nav className="nav flex-column">
              <Link className="nav-link custom-link" to="/home">
                <img src={icono_home} alt="icono_home" style={{ height: '35px', marginRight: '15px' }} className="me-2" />
                Inicio
              </Link>
              <Link className="nav-link custom-link" to="/usuarios">
                <img src={icono_usuario} alt="icono_usuario" style={{ height: '35px', marginRight: '15px' }} className="me-2" />
                Usuarios
              </Link>
              <Link className="nav-link custom-link" to="/clientes">
                <img src={icono_clientes} alt="icono_clientes" style={{ height: '35px', marginRight: '15px' }} className="me-2" />
                Cientes
              </Link>
              <Link className="nav-link custom-link" to="/ventas">
                <img src={icono_ventas} alt="icono_ventas" style={{ height: '35px', marginRight: '15px' }} className="me-2" />
                Ventas
              </Link>
              <Link className="nav-link custom-link" to="/compras">
                <img src={icono_compras} alt="icono_compras" style={{ height: '35px', marginRight: '15px' }} className="me-2" />
                Ordenes de Compra
              </Link>
              <Link className="nav-link custom-link" to="/proveedores">
                <img src={icono_proveedores} alt="icono_proveedores" style={{ height: '35px', marginRight: '15px' }} className="me-2" />
                Proveedores
              </Link>
              <Link className="nav-link custom-link" to="/productos">
                <img src={icono_productos} alt="icono_productos" style={{ height: '35px', marginRight: '15px' }} className="me-2" />
                Productos
              </Link>
              <Link className="nav-link custom-link" to="/promociones">
                <img src={icono_promociones} alt="icono_promociones" style={{ height: '35px', marginRight: '15px' }} className="me-2" />
                Promociones
              </Link>
              <Link className="nav-link custom-link" to="/perdidas">
                <img src={icono_perdidas} alt="icono_perdidas" style={{ height: '35px', marginRight: '15px' }} className="me-2" />
                Pérdidas
              </Link>
              <Link className="nav-link custom-link" to="/inventario">
                <img src={icono_inventario} alt="icono_inventario" style={{ height: '35px', marginRight: '15px' }} className="me-2" />
                Inventario
              </Link>
             
              <button
                  onClick={handleLogout}
                  className="nav-link custom-link text-start border-0 bg-transparent"
                  style={{ cursor: 'pointer' }}
                >
                  <img src={icono_salir} alt="icono_salir" style={{ height: '35px', marginRight: '15px' }} className="me-2" />
                  Cerrar sesión
              </button>
            </nav>
          </div>
        )}

        {/* Contenido principal */}
        <div className="flex-grow-1 p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
