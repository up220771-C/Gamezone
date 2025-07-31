// src/pages/Home.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import { obtenerJuegos } from '../services/juegosService';

export default function Home() {
  const navigate = useNavigate();

  // Estado para los juegos
  interface Juego {
    _id: string;
    nombre: string;
    descripcion: string;
    imagen: string;
    precio: number;
    descuento?: number;
  }
  const [juegos, setJuegos] = useState<Juego[]>([]);

  // Estado para el rol
  const [rol, setRol] = useState<string | null>(null);

  useEffect(() => {
    // obtenemos los juegos
    obtenerJuegos()
      .then((data: Juego[]) => {
        const normales = data.filter(j => !j.descuento || j.descuento === 0);
        setJuegos(normales);
      })
      .catch(err => console.error('Error al obtener juegos:', err));

    // leemos el rol del usuario (lo guardaste así en el login)
    const storedRole = localStorage.getItem('role');
    setRol(storedRole);
  }, []);

  return (
    <div className="homepage">
      <div className="destacados">
        {/* Botones siempre visibles */}
        <button
          className="deal btn-icon"
          onClick={() => navigate('/deals')}
        >
          <i className="fi fi-rr-badge-percent"></i>
          <span>Deals</span>
        </button>

        <button
          className="coming btn-icon"
          onClick={() => navigate('/comingsoon')}
        >
          <i className="fi fi-rr-calendar"></i>
          <span>Coming Soon</span>
        </button>

        {/*  Sólo si el usuario es admin  */}
        {rol === 'admin' && (
          <>
            <button
              className="deal btn-icon"
              onClick={() => navigate('/admin/games')}
            >
              <i className="fi fi-rr-badge-percent"></i>
              <span>Manage games</span>
            </button>

            <button
              className="deal btn-icon"
              onClick={() => navigate('/admin/users')}
            >
              <i className="fi fi-rr-badge-percent"></i>
              <span>Manage users</span>
            </button>
          </>
        )}
      </div>

      <main className="juegos">
        {juegos.map(juego => (
          <div className="card" key={juego._id}>
            <img src={juego.imagen} alt={juego.nombre} />
            <div className="card-content">
              <h3>{juego.nombre}</h3>
              <p>{juego.descripcion}</p>
              <span className="precio">${juego.precio.toFixed(2)}</span>
              <button
                className="detalle"
                onClick={() => navigate(`/juego/${juego._id}`)}
              >
                Detail
              </button>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
