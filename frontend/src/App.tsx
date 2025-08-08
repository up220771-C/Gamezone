// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Deals from './pages/Deals';
import Categorias from './pages/Categorias';
import CategoriaDetalle from './pages/CategoriaDetalle';
import About from './pages/About';
import Perfil from './pages/Perfil';
import ComingSoon from './pages/ComingSoon';
import JuegoDetalle from './pages/JuegoDetalle';
import MasVendidos from './pages/MasVendidos';
import AdminGames from './pages/AdminGames'; 
import Cart from './pages/Cart'; 
import AdminUsers from './pages/AdminUsers';


function App() {

  
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/categoria/best" element={<MasVendidos />} />
        <Route path="/" element={<Home />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/juego/:id" element={<JuegoDetalle />} />
        <Route path="/comingsoon" element={<ComingSoon />} />
        <Route path="/about" element={<About />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/categoria/:nombre" element={<CategoriaDetalle />} />
        <Route path="/cart" element={<Cart />} />


        <Route element={<ProtectedRoute roles={['cliente', 'admin']} />}>
          <Route path="/perfil" element={<Perfil />} />
        </Route>

        <Route element={<ProtectedRoute roles={['admin']} />}>
          <Route path="/admin/games" element={<AdminGames />} />
          <Route path="/admin/users" element={<AdminUsers />} />
        </Route>

        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
