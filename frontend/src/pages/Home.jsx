// src/Layout.jsx
import { Link, Outlet } from 'react-router-dom';
//import './Layout.css'; // Estilos personalizados si necesitás

export default function Layout() {
  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="bg-dark text-white vh-100 p-3" style={{ width: '220px' }}>
        <h4 className="text-center mb-4">Grupo N°5</h4>
        <nav className="nav flex-column">
          <Link className="nav-link text-white" to="/home">Inicio</Link>
          <Link className="nav-link text-white" to="/usuarios">Usuarios</Link>
          <Link className="nav-link text-white" to="/clientes">Clientes</Link>
          {/* Agregá más links según necesites */}
        </nav>
      </div>

      {/* Contenido Principal */}
      <div className="flex-grow-1">
        {/* Topbar */}
        <div className="bg-primary text-white p-3 d-flex justify-content-between">
          <span>SISTEMA DE GESTIÓN DE INVENTARIO</span>
          <span className="me-2">USUARIO: María Perez</span>
        </div>

        {/* Vista principal */}
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
