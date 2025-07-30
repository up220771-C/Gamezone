// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Deals from './pages/Deals';
import Categorias from './pages/Categorias';
import CategoriaDetalle from './pages/CategoriaDetalle';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import Perfil from './pages/Perfil';
import ComingSoon from './pages/ComingSoon';
import JuegoDetalle from './pages/JuegoDetalle';

<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/perfil" element={<Perfil />} />

</Routes>





function App() {
  return (
    <Router>
      <Navbar />

      <Routes>

        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/juego/:id" element={<JuegoDetalle />} />
        <Route path="/comingsoon" element={<ComingSoon />} />
        <Route path="/about" element={<About />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/categoria/:nombre" element={<CategoriaDetalle />} />
      

        {/* Rutas autenticadas para cliente y admin */}
        <Route element={<ProtectedRoute roles={['cliente', 'admin']} />}>
          <Route path="/perfil" element={<Perfil />} />
        </Route>

        {/* Rutas sólo admin */}
        <Route element={<ProtectedRoute roles={['admin']} />}>
          
          {/*<Route path="/admin/games"        element={<GameManager />} />*/}
          {/*<Route path="/admin/games/:id"    element={<GameEdit />} />*/}
          {/*<Route path="/admin/deals"        element={<DealsManager />} />*/}
          {/*<Route path="/admin/coming-soon"  element={<ComingSoonManager />} />*/}
          {/*<Route path="/admin/users"        element={<UsersManager />} />*/}
        </Route>

        {/* Ruta catch‑all opcional */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
