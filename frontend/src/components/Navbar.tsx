import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useState, useEffect } from 'react';
import { registerUser, loginUser } from '../services/authService';

export default function Navbar() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [usuario, setUsuario] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({ correo: '', contraseña: '' });
  const [regData, setRegData] = useState({
    nombre: '',
    apellido: '',
    username: '',
    correo: '',
    contraseña: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch('http://localhost:5000/api/auth/perfil', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('No autorizado');
        return res.json();
      })
      .then(data => setUsuario(data.usuario.username))
      .catch(() => setUsuario(null));
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await loginUser(loginData);
    if (res.token) {
      localStorage.setItem('token', res.token);
      setUsuario(res.usuario?.username || window.location.reload());
      
      setShowLogin(false);
      setLoginData({ correo: '', contraseña: '' });
      setMobileOpen(false);
    } else {
      alert(res.error || 'Error en login');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await registerUser(regData);
    if (res.mensaje) {
      alert('Registro exitoso');
      setShowRegister(false);
      setRegData({
        nombre: '',
        apellido: '',
        username: '',
        correo: '',
        contraseña: ''
      });
      setMobileOpen(false);
    } else {
      alert(res.error || 'Error en registro');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUsuario(null);
    navigate('/');
    setMobileOpen(false);
  };

  const LinkItem = ({
    to,
    children
  }: {
    to: string;
    children: React.ReactNode;
  }) => (
    <NavLink
      to={to}
      end
      onClick={() => setMobileOpen(false)}
      className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
    >
      {children}
    </NavLink>
  );

  return (
    <>
      <header className="navbar">
        <div className="navbar__left">
          <img src="/logo.png" alt="Gamezone Logo" className="navbar__logo" />
        </div>

        <nav className="navbar__menu">
          <LinkItem to="/">Home</LinkItem>
          <LinkItem to="/categorias">Categories</LinkItem>
          <LinkItem to="/about">About</LinkItem>
          <button
            className="icon-btn"
            title="Carrito"
            onClick={() => navigate('/cart')}
          >
            <i className="fi fi-sr-shopping-cart"></i>
          </button>
        </nav>

        <div className="navbar__auth">
          {usuario ? (
            <NavLink
              to="/perfil"
              title="Perfil"
              className={({ isActive }) =>
                `icon-btn navbar__profile-link${isActive ? ' active' : ''}`
              }
            >
              <img
                src="https://www.pngmart.com/files/15/Fallout-Pip-Boy-PNG-HD.png"
                alt="Perfil"
                className="navbar__profile-icon"
              />
              <span className="navbar__username">{usuario}</span>
            </NavLink>
          ) : (
            <>
              <button
                className="nav-item"
                onClick={() => {
                  setShowLogin(true);
                  setMobileOpen(false);
                }}
              >
                Log-in
              </button>
              <button
                className="nav-item"
                onClick={() => {
                  setShowRegister(true);
                  setMobileOpen(false);
                }}
              >
                Register
              </button>
            </>
          )}
        </div>

        <button
          className={`hamburger ${mobileOpen ? 'open' : ''}`}
          onClick={() => setMobileOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <i className="fi fi-sr-menu-burger"></i>
        </button>

        {mobileOpen && (
          <div className="mobile-menu open">
            <LinkItem to="/">Home</LinkItem>
            <LinkItem to="/categorias">Categories</LinkItem>
            <LinkItem to="/about">About</LinkItem>
            <button
              className="icon-btn"
              title="Carrito"
              onClick={() => setMobileOpen(false)}
            >
              <i className="fi fi-sr-shopping-cart"></i>
            </button>
            {usuario ? (
              <NavLink
                to="/perfil"
                title="Perfil"
                className={({ isActive }) =>
                  `icon-btn navbar__profile-link${isActive ? ' active' : ''}`
                }
                onClick={() => setMobileOpen(false)}
              >
                <img
                  src="https://www.pngmart.com/files/15/Fallout-Pip-Boy-PNG-HD.png"
                  alt="Perfil"
                  className="navbar__profile-icon"
                />
                <span className="navbar__username">{usuario}</span>
              </NavLink>
            ) : (
              <>
                <button
                  className="nav-item"
                  onClick={() => {
                    setShowLogin(true);
                    setMobileOpen(false);
                  }}
                >
                  Log-in
                </button>
                <button
                  className="nav-item"
                  onClick={() => {
                    setShowRegister(true);
                    setMobileOpen(false);
                  }}
                >
                  Register
                </button>
              </>
            )}
          </div>
        )}
      </header>

      {showLogin && (
        <div className="modal-overlay">
          <div className="modal">
            <form onSubmit={handleLoginSubmit} className="modal__form">
              <h2>Login</h2>
              <input
                type="email"
                placeholder="Correo"
                value={loginData.correo}
                onChange={e =>
                  setLoginData({ ...loginData, correo: e.target.value })
                }
                required
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={loginData.contraseña}
                onChange={e =>
                  setLoginData({ ...loginData, contraseña: e.target.value })
                }
                required
              />
              <button type="submit" className="btn">
                Log In
              </button>
              <p className="switch-modal">
                Don’t have an account?{' '}
                <button
                  type="button"
                  className="link"
                  onClick={() => {
                    setShowLogin(false);
                    setShowRegister(true);
                  }}
                >
                  Register
                </button>
              </p>
              <button
                type="button"
                className="modal-close"
                onClick={() => setShowLogin(false)}
              >
                ✕
              </button>
            </form>
          </div>
        </div>
      )}

      {showRegister && (
        <div className="modal-overlay">
          <div className="modal">
            <form onSubmit={handleRegisterSubmit} className="modal__form">
              <h2>Register</h2>
              <input
                type="text"
                placeholder="Nombre"
                value={regData.nombre}
                onChange={e =>
                  setRegData({ ...regData, nombre: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Apellido"
                value={regData.apellido}
                onChange={e =>
                  setRegData({ ...regData, apellido: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Username"
                value={regData.username}
                onChange={e =>
                  setRegData({ ...regData, username: e.target.value })
                }
                required
              />
              <input
                type="email"
                placeholder="Correo"
                value={regData.correo}
                onChange={e =>
                  setRegData({ ...regData, correo: e.target.value })
                }
                required
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={regData.contraseña}
                onChange={e =>
                  setRegData({ ...regData, contraseña: e.target.value })
                }
                required
              />
              <button type="submit" className="btn">
                Create Account
              </button>
              <p className="switch-modal">
                Already have an account?{' '}
                <button
                  type="button"
                  className="link"
                  onClick={() => {
                    setShowRegister(false);
                    setShowLogin(true);
                  }}
                >
                  Log-in
                </button>
              </p>
              <button
                type="button"
                className="modal-close"
                onClick={() => setShowRegister(false)}
              >
                ✕
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
