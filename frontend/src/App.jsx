import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/" element={<Plantilla />}>
        <Route path="/home" element={<Home />} />
        <Route path="usuarios" element={<IndexUsuarios />} />
        <Route path="usuarios/crear" element={<CrearUsuario />} />
        <Route path="usuarios/editar/:id" element={<EditarUsuario />} />
        <Route path="usuarios/ver/:id" element={<VerUsuario />} />
        <Route path="clientes" element={<IndexClientes />} />
        <Route path="clientes/crear" element={<CrearCliente />} />
        <Route path="clientes/editar/:id" element={<EditarCliente />} />
        <Route path="clientes/ver/:id" element={<VerCliente />} />  
      </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
