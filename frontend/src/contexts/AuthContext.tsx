import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  Dispatch,
  SetStateAction
} from 'react';

type Role = 'admin' | 'cliente';

interface Usuario {
  nombre: string;
  apellido: string;
  username: string;
  correo: string;
}

interface AuthCtx {
  token: string | null;
  role: Role | null;
  usuario: Usuario | null;
  login: (token: string, role: Role) => void;
  logout: () => void;
  setUsuario: Dispatch<SetStateAction<Usuario | null>>; // ✅ permite función o valor directo
}

const AuthContext = createContext<AuthCtx>({
  token: null,
  role: null,
  usuario: null,
  login: () => {},
  logout: () => {},
  setUsuario: () => {}
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  );
  const [role, setRole] = useState<Role | null>(
    (localStorage.getItem('role') as Role) || null
  );
  const [usuario, setUsuario] = useState<Usuario | null>(null); // ✅ manejado como estado global

  useEffect(() => {
    if (!token) return;

    fetch('http://localhost:5000/api/auth/perfil', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => data.usuario && setUsuario(data.usuario))
      .catch(() => setUsuario(null));
  }, [token]);

  const login = (t: string, r: Role) => {
    localStorage.setItem('token', t);
    localStorage.setItem('role', r);
    setToken(t);
    setRole(r);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken(null);
    setRole(null);
    setUsuario(null); // ✅ limpiamos también el usuario
  };

  useEffect(() => {
    const syncAuth = (e: StorageEvent) => {
      if (e.key === 'token' || e.key === 'role') {
        setToken(localStorage.getItem('token'));
        const r = localStorage.getItem('role') as Role;
        setRole(r || null);
      }
    };
    window.addEventListener('storage', syncAuth);
    return () => window.removeEventListener('storage', syncAuth);
  }, []);

  return (
    <AuthContext.Provider
      value={{ token, role, usuario, login, logout, setUsuario }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
