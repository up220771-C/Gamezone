import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerJuegos2 } from '../services/juegosService';

interface Juego {
  _id: string;
  nombre: string;
  descripcion: string;
  imagen: string;
  estrellas?: number;
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
    <div className="page-container">
      <header className="page-header">
        <i className="fi fi-rr-calendar calendar-icon" />
        <h2>Coming Soon</h2>
      </header>

      <section className="juegos">
        {juegos.length === 0
          ? <p className="no-games">No upcoming games found.</p>
          : juegos.map(juego => (
              <div key={juego._id} className="card">
                <img 
                  src={juego.imagen} 
                  alt={juego.nombre} 
                  className="card-image" 
                />

                <div className="card-content">
                  <h3>{juego.nombre}</h3>

                  <div className="stars">
                    {Array.from({ length: juego.estrellas || 0 }).map((_, i) =>
                      <span key={i} className="star">★</span>
                    )}
                  </div>

                  <p>{juego.descripcion}</p>

                  <button
                    className="detalle"
                    onClick={() => navigate(`/detail/${juego._id}`)}
                  >
                    Ver detalle
                  </button>
                </div>
              </div>
            ))
        }
      </section>
    </div>
  );
}