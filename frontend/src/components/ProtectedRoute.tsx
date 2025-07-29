import { Navigate, Outlet } from 'react-router-dom';

interface Props {
  roles: ('cliente' | 'admin')[];
}

export default function ProtectedRoute({ roles }: Props) {
  const token = localStorage.getItem('token');
  const role  = localStorage.getItem('role') as 'cliente' | 'admin' | null;

  // Si no hay token → redirige a Login (o Home)
  if (!token) return <Navigate to="/" replace />;

  // Si el rol no está permitido → Home
  if (!role || !roles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  // OK
  return <Outlet />;
}
