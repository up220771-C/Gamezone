import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useState, useEffect } from 'react';
import { registerUser, loginUser } from '../services/authService';

export default function Navbar() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [usuario, setUsuario] = useState<string | null>(null);
  const navigate = useNavigate(); // ← para redirigir

  const [loginData, setLoginData] = useState({ correo: '', contraseña: '' });

  const [regData, setRegData] = useState({
    nombre: '',
    apellido: '',
    username: '',
    correo: '',
    contraseña: ''
  });

  useEffect(() => {
    const nombreGuardado = localStorage.getItem('usuarioUsername');
    if (nombreGuardado) setUsuario(nombreGuardado);
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await loginUser(loginData);
    console.log(result);
    if (result.token) {
      localStorage.setItem('token', result.token);
      localStorage.setItem('usuarioUsername', result.usuario?.username || 'user');
      setUsuario(result.usuario?.username || 'user');

      setShowLogin(false);
      setLoginData({ correo: '', contraseña: '' });
    } else {
      alert(result.error || 'Error en login');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Enviando datos a backend:', regData);
    const result = await registerUser(regData);
    console.log(result);
    if (result.mensaje) {
      alert('Registro exitoso');
      setShowRegister(false);
      setRegData({ nombre: '', apellido: '', username: '', correo: '', contraseña: '' });
    } else {
      alert(result.error || 'Error en registro');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioNombre');
    setUsuario(null);
    navigate('/'); // ← redirigir al Home
  };

  return (
    <>
      <header className="navbar">
        <div className="navbar__left">
          <img src="/logo.png" alt="Gamezone Logo" className="navbar__logo" />
        </div>

        <nav className="navbar__menu">
          <NavLink to="/" end className="nav-item">Home</NavLink>
          <NavLink to="/categorias" className="nav-item">Categories</NavLink>
          <NavLink to="/about" className="nav-item">About</NavLink>
          <button className="icon-btn" title="Carrito">
            <i className="fi fi-sr-shopping-cart"></i>
          </button>
        </nav>

        <div className="navbar__auth">
          {usuario ? (
            <>
              <NavLink to="/perfil" className="icon-btn" title="Perfil">
                <i className="fi fi-rr-circle-user"></i>
              </NavLink>

              <button type="button" className="nav-item logout-btn" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <button type="button" className="nav-item" onClick={() => setShowLogin(true)}>
                Log-in
              </button>
              <button type="button" className="nav-item" onClick={() => setShowRegister(true)}>
                Register
              </button>
            </>
          )}
        </div>
      </header>

      {/* ------ Login Modal ------ */}
      {showLogin && (
        <div className="modal-overlay">
          <div className="modal">
            <form onSubmit={handleLoginSubmit} className="modal__form">
              <h2>Login</h2>
              <input
                type="email"
                placeholder="Correo"
                value={loginData.correo}
                onChange={e => setLoginData({ ...loginData, correo: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={loginData.contraseña}
                onChange={e => setLoginData({ ...loginData, contraseña: e.target.value })}
                required
              />
              <button type="submit" className="btn">Log In</button>
              <p className="switch-modal">
                Don’t have an account?{' '}
                <button type="button" className="link" onClick={() => { setShowLogin(false); setShowRegister(true); }}>
                  Register
                </button>
              </p>
              <button type="button" className="modal-close" onClick={() => setShowLogin(false)}>✕</button>
            </form>
          </div>
        </div>
      )}

      {/* ---- Register Modal ---- */}
      {showRegister && (
        <div className="modal-overlay">
          <div className="modal">
            <form onSubmit={handleRegisterSubmit} className="modal__form">
              <h2>Register</h2>
              <input type="text" placeholder="Nombre" value={regData.nombre}
                onChange={e => setRegData({ ...regData, nombre: e.target.value })} required />
              <input type="text" placeholder="Apellido" value={regData.apellido}
                onChange={e => setRegData({ ...regData, apellido: e.target.value })} required />
              <input type="text" placeholder="Username" value={regData.username}
                onChange={e => setRegData({ ...regData, username: e.target.value })} required />
              <input type="email" placeholder="Correo" value={regData.correo}
                onChange={e => setRegData({ ...regData, correo: e.target.value })} required />
              <input type="password" placeholder="Contraseña" value={regData.contraseña}
                onChange={e => setRegData({ ...regData, contraseña: e.target.value })} required />
              <button type="submit" className="btn">Create Account</button>
              <p className="switch-modal">
                Already have an account?{' '}
                <button type="button" className="link" onClick={() => { setShowRegister(false); setShowLogin(true); }}>
                  Log-in
                </button>
              </p>
              <button type="button" className="modal-close" onClick={() => setShowRegister(false)}>✕</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
