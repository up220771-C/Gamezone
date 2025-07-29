
const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export interface RegisterData {
  nombre: string;
  apellido: string;
  username: string;
  correo: string;
  contraseña: string;
}

export interface LoginData {
  correo: string;
  contraseña: string;
}

export const registerUser = async (data: RegisterData) => {
  const res = await fetch(`${API}/api/auth/registro`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const loginUser = async (data: LoginData) => {
  const res = await fetch(`${API}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const payload = await res.json();
  console.log('🔥 loginUser payload:', payload);
  return payload;
};

