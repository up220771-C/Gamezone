import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { registerUser, loginUser } from '../services/authService';
import { useCart } from '../contexts/CartContext';
import './Navbar.css';

export default function Navbar() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [usuario, setUsuario] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { getCartItemCount } = useCart();
  const cartCount = getCartItemCount();

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
    const role = localStorage.getItem('role');
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
      localStorage.setItem('role', res.usuario.rol);
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
          <img
            src="/logo.png"
            alt="Gamezone Logo"
            className="navbar__logo"
          />
        </div>

        <nav className="navbar__menu">
          <LinkItem to="/">Home</LinkItem>
          <LinkItem to="/categorias">Categories</LinkItem>
          <LinkItem to="/about">About</LinkItem>
          <button
            className="cart-icon-btn"
            title="Carrito"
            onClick={() => navigate('/cart')}
          >
            <svg className="cart-icon" viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M17 18a2 2 0 0 1 2 2 2 2 0 0 1-2 2 2 2 0 0 1-2-2c0-1.11.89-2 2-2M1 2h3.27l.94 2H20a1 1 0 0 1 1 1c0 .17-.05.34-.12.5l-3.58 6.47c-.34.61-1 1.03-1.8 1.03H8.1l-.9 1.63-.03.12a.25.25 0 0 0 .25.25H19v2H7a2 2 0 0 1-2-2c0-.35.09-.68.24-.96l1.36-2.45L3 4H1V2m6 16a2 2 0 0 1 2 2 2 2 0 0 1-2 2 2 2 0 0 1-2-2c0-1.11.89-2 2-2m9-7l2.78-5H6.14l2.36 5H16z" />
            </svg>
            {cartCount > 0 && <span className="cart-count-badge">{cartCount}</span>}
          </button>
        </nav>

        <div className="navbar__auth">
          {usuario ? (
            <div className="navbar__profile-container">
              <NavLink
                to="/perfil"
                title="Perfil"
                className={({ isActive }) =>
                  `navbar__profile-link${isActive ? ' active' : ''}`
                }
              >
                <img
                  src="https://www.pngmart.com/files/15/Fallout-Pip-Boy-PNG-HD.png"
                  alt="Perfil"
                  className="navbar__profile-icon"
                />
                <span className="navbar__username">{usuario}</span>
              </NavLink>
              <button className="logout-btn" onClick={handleLogout}>
                <i className="fi fi-sr-exit"></i>
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
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
            </div>
          )}
        </div>

        <button
          className={`hamburger ${mobileOpen ? 'open' : ''}`}
          onClick={() => setMobileOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <div className="hamburger-inner">
            <span className="hamburger-icon"></span>
          </div>
        </button>

        <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
          <LinkItem to="/">Home</LinkItem>
          <LinkItem to="/categorias">Categories</LinkItem>
          <LinkItem to="/about">About</LinkItem>
          <button
            className="nav-item cart-mobile-btn"
            title="Carrito"
            onClick={() => {
              navigate('/cart');
              setMobileOpen(false);
            }}
          >
            <svg className="cart-icon" viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M17 18a2 2 0 0 1 2 2 2 2 0 0 1-2 2 2 2 0 0 1-2-2c0-1.11.89-2 2-2m9-7l2.78-5H6.14l2.36 5H16z" />
            </svg>
            {cartCount > 0 && <span className="cart-count-badge">{cartCount}</span>}
            Cart
          </button>

          {usuario ? (
            <div className="mobile-profile">
              <NavLink
                to="/perfil"
                title="Perfil"
                className={({ isActive }) =>
                  `nav-item${isActive ? ' active' : ''}`
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
              <button
                className="nav-item logout-btn"
                onClick={handleLogout}
              >
                <i className="fi fi-sr-exit"></i> Logout
              </button>
            </div>
          ) : (
            <div className="mobile-auth-buttons">
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
            </div>
          )}
        </div>
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
                Don't have an account?{' '}
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
          <div className="modal register-form">
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