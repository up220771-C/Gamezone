// src/contexts/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from 'react';

type Role = 'admin' | 'cliente';

interface AuthCtx {
  token: string | null;
  role: Role | null;
  login: (token: string, role: Role) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthCtx>({
  token: null,
  role: null,
  login: () => {},
  logout: () => {}
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  );
  const [role, setRole] = useState<Role | null>(
    (localStorage.getItem('role') as Role) || null
  );

  // ✅ Manejo de login
  const login = (t: string, r: Role) => {
    localStorage.setItem('token', t);
    localStorage.setItem('role', r);
    setToken(t);
    setRole(r);
  };

  // ✅ Manejo de logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken(null);
    setRole(null);
  };

  // ✅ Sincroniza token/rol si otra pestaña cambia el localStorage
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
    <AuthContext.Provider value={{ token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
