import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Plantilla from './pages/Plantilla.jsx';
import IndexUsuarios from './pages/Usuarios/index';
import CrearUsuario from './pages/Usuarios/CrearUsuario.jsx';
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
      </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
