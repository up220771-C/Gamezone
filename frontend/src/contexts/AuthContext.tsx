// src/contexts/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode
} from 'react';

type Role = 'admin' | 'cliente';

interface AuthCtx {
  token: string | null;
  role: Role | null;
  login: (token: string, role: Role) => void;
  logout: () => void;
}

// 1️⃣ Creamos el contexto con valores por defecto
const AuthContext = createContext<AuthCtx>({
  token: null,
  role: null,
  login: () => {},
  logout: () => {}
});

// 2️⃣ Provider que envuelve tu App
export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  );
  const [role, setRole] = useState<Role | null>(
    (localStorage.getItem('role') as Role) || null
  );

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
  };

  return (
    <AuthContext.Provider value={{ token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 3️⃣ Hook de conveniencia para consumir el contexto
export function useAuth() {
  return useContext(AuthContext);
}
