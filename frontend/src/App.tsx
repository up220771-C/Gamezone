// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Deals from './pages/Deals';
import Categorias from './pages/Categorias';
import CategoriaDetalle from './pages/CategoriaDetalle';
import About from './pages/About';
import Register from './pages/Register';
import Perfil from './pages/Perfil';
import ComingSoon from './pages/ComingSoon';
import JuegoDetalle from './pages/JuegoDetalle';
import MasVendidos from './pages/MasVendidos';
import AdminGames from './pages/AdminGames'; // ✅ nuevo
import Cart from './pages/Cart'; // asegúrate de tener el componente Cart.tsx creado


function App() {

  
  return (
    <Router>
      <Navbar />

      <Routes>
        {/* Más vendidos */}
        <Route path="/categoria/best" element={<MasVendidos />} />
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/juego/:id" element={<JuegoDetalle />} />
        <Route path="/comingsoon" element={<ComingSoon />} />
        <Route path="/about" element={<About />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/categoria/:nombre" element={<CategoriaDetalle />} />
        <Route path="/cart" element={<Cart />} />


        {/* Rutas autenticadas para cliente y admin */}
        <Route element={<ProtectedRoute roles={['cliente', 'admin']} />}>
          <Route path="/perfil" element={<Perfil />} />
        </Route>

        {/* Rutas solo para administrador */}
        <Route element={<ProtectedRoute roles={['admin']} />}>
          <Route path="/admin/games" element={<AdminGames />} />
        </Route>

        {/* Ruta catch‑all opcional */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
