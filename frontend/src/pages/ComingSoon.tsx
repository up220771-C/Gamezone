// src/pages/ComingSoon.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerJuegos2 } from '../services/juegosService';
import './ComingSoon.css';

interface Juego {
  _id: string;
  nombre: string;
  descripcion: string;
  imagen: string;
  estrellas?: number;
  // no esperamos precio aquí
}

export default function ComingSoon() {
  const [juegos, setJuegos] = useState<Juego[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    obtenerJuegos2()
      .then(data => setJuegos(data))
      .catch(err => console.error('Error al obtener próximos juegos:', err));
  }, []);

  return (
    <div className="coming-container">
      <header className="coming-header">
        <i className="fi fi-rr-calendar calendar-icon" />
        <h2>Coming Soon</h2>
      </header>

      <section className="coming-grid">
        {juegos.length === 0
          ? <p className="no-games">No upcoming games found.</p>
          : juegos.map(juego => (
              <div key={juego._id} className="coming-card">
                <img src={juego.imagen} alt={juego.nombre} className="coming-img" />

                <h3 className="coming-title">{juego.nombre}</h3>

                <div className="coming-stars">
                  {Array.from({ length: juego.estrellas || 0 }).map((_, i) =>
                    <span key={i} className="star">★</span>
                  )}
                </div>

                <p className="coming-desc">{juego.descripcion}</p>

                <button
                  className="coming-btn"
                  onClick={() => navigate(`/detail/${juego._id}`)}
                >
                  Ver detalle
                </button>
              </div>
            ))
        }
      </section>
    </div>
  );
}
