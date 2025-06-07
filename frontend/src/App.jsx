import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Plantilla from './pages/Plantilla.jsx';
import IndexUsuarios from './pages/Usuarios/index';
import CrearUsuario from './pages/Usuarios/CrearUsuario.jsx';
import EditarUsuario from './pages/Usuarios/EditarUsuario.jsx';
import VerUsuario from './pages/Usuarios/VerUsuario.jsx';
import IndexClientes from './pages/Clientes/index';
import CrearCliente from './pages/Clientes/CrearCliente.jsx';
import EditarCliente from './pages/Clientes/EditarCliente.jsx';
import VerCliente from './pages/Clientes/VerCliente.jsx';
import IndexPerdidas from './pages/Perdidas/index';
import CrearPerdida from './pages/Perdidas/CrearPerdida.jsx';
import EditarPerdida from './pages/Perdidas/EditarPerdida.jsx';
import VerPerdida from './pages/Perdidas/VerPerdida.jsx';
import IndexVentas from './pages/Ventas/index';
import CrearVenta from './pages/Ventas/CrearVenta.jsx';
import EditarVenta from './pages/Ventas/EditarVenta.jsx';
import VerVenta from './pages/Ventas/VerVenta.jsx';
import RecuperarContrasena from './pages/RecuperarContrasena';
import CodigoBarra from './pages/Inventario/CodigoBarra.jsx';
import MenuInventario from './pages/Inventario/MenuInventario.jsx';
import StockBajo from "./pages/Inventario/StockBajo";
import TasaRotacion from "./pages/Inventario/TasaRotacion";
import IndexProductos from './pages/Productos/index';
import CrearProducto from './pages/Productos/CrearProducto.jsx';
import EditarProducto from './pages/Productos/EditarProducto.jsx';
import VerProducto from './pages/Productos/VerProducto.jsx';
import ProductosMayorIngreso from "./pages/Inventario/ProductosMayorIngreso";
import ProductosMenosVendidos from "./pages/Inventario/ProductosMenosVendidos";
import IndexPromociones from './pages/Promociones/index';
import CrearPromocion from './pages/Promociones/CrearPromocion';
import EditarPromocion from './pages/Promociones/EditarPromocion';
import VerPromocion from './pages/Promociones/VerPromocion';
import './App.css';

function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Login />} />
      <Route path="/recuperar" element={<RecuperarContrasena />} />

      {/* Rutas privadas con plantilla */}
      <Route path="/" element={<Plantilla />}>
        <Route path="home" element={<Home />} />
        <Route path="usuarios" element={<IndexUsuarios />} />
        <Route path="usuarios/crear" element={<CrearUsuario />} />
        <Route path="usuarios/editar/:id" element={<EditarUsuario />} />
        <Route path="usuarios/ver/:id" element={<VerUsuario />} />
        <Route path="clientes" element={<IndexClientes />} />
        <Route path="clientes/crear" element={<CrearCliente />} />
        <Route path="clientes/editar/:id" element={<EditarCliente />} />
        <Route path="clientes/ver/:id" element={<VerCliente />} />
        <Route path="perdidas" element={<IndexPerdidas />} />
        <Route path="perdidas/crear" element={<CrearPerdida />} />
        <Route path="perdidas/editar/:id" element={<EditarPerdida />} />
        <Route path="perdidas/ver/:id" element={<VerPerdida />} />
        <Route path="ventas" element={<IndexVentas />} />
        <Route path="ventas/crear" element={<CrearVenta />} />
        <Route path="ventas/editar/:id" element={<EditarVenta />} />
        <Route path="ventas/ver/:id" element={<VerVenta />} />
        <Route path="inventario/codigo-barra" element={<CodigoBarra />} />
        <Route path="inventario/" element={<MenuInventario />} />
        <Route path="/stock-bajo" element={<StockBajo />} />
        <Route path="/tasa-rotacion" element={<TasaRotacion />} />
        <Route path="productos" element={<IndexProductos />} />
        <Route path="productos/crear" element={<CrearProducto />} />
        <Route path="productos/editar/:id" element={<EditarProducto />} />
        <Route path="productos/ver/:id" element={<VerProducto />} />
        <Route path="/productos-mayor-ingreso" element={<ProductosMayorIngreso />} />
        <Route path="/productos-menos-vendidos" element={<ProductosMenosVendidos />} />
        <Route path="promociones" element={<IndexPromociones />} />
        <Route path="promociones/crear" element={<CrearPromocion />} />
        <Route path="promociones/editar/:id" element={<EditarPromocion />} />
        <Route path="promociones/ver/:id" element={<VerPromocion />} />
      </Route>
    </Routes>


  );
}

export default App;
