import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Categorias from './pages/Categorias';
import CategoriaDetalle from './pages/CategoriaDetalle';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import Perfil from './pages/Perfil';
// otros imports...

<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/perfil" element={<Perfil />} />

</Routes>


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/categoria/:nombre" element={<CategoriaDetalle />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/perfil" element={<Perfil />} />
        
      </Routes>
    </Router>
  );
}

export default App;
