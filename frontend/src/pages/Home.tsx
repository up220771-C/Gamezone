// src/pages/Home.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import { obtenerJuegos } from '../services/juegosService';

export default function Home() {
  const navigate = useNavigate();
  interface Juego {
    _id: string;
    nombre: string;
    descripcion: string;
    imagen: string;
    precio: number;
    descuento?: number;
  }

  const [juegos, setJuegos] = useState<Juego[]>([]);

  useEffect(() => {
    obtenerJuegos()
      .then((data: Juego[]) => {
        // Filtramos solo los juegos sin descuento (descuento === 0 o undefined)
        const normales = data.filter((j: Juego) => !j.descuento || j.descuento === 0);
        setJuegos(normales);
      })
      .catch(err => console.error('Error al obtener juegos:', err));
  }, []);

  return (
    <div className="homepage">
      <div className="destacados">
        <button
          className="deal btn-icon"
          onClick={() => navigate('/deals')}
        >
          <i className="fi fi-rr-badge-percent"></i>
          <span>Deals</span>
        </button>

        <button
          className="coming btn-icon"
          onClick={() => navigate('/coming-soon')}
        >
          <i className="fi fi-rr-calendar"></i>
          <span>Coming Soon</span>
        </button>
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
