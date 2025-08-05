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
    disponible: boolean;
  }

  const [juegos, setJuegos] = useState<Juego[]>([]);
  const [rol, setRol] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    obtenerJuegos()
      .then((data: Juego[]) => {
        const normales = data.filter(j => !j.descuento || j.descuento === 0);
        setJuegos(normales);
      })
      .catch(err => console.error('Error al obtener juegos:', err));

    setRol(localStorage.getItem('role'));
  }, []);

  const filtered = juegos.filter(j =>
    j.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="homepage">
      <div className="destacados">
        <button className="deal btn-icon" onClick={() => navigate('/deals')}>
          <i className="fi fi-rr-badge-percent"></i>
          <span>Deals</span>
        </button>
        <button className="coming btn-icon" onClick={() => navigate('/comingsoon')}>
          <i className="fi fi-rr-calendar"></i>
          <span>Coming Soon</span>
        </button>
        {rol === 'admin' && (
          <>
            <button className="deal btn-icon" onClick={() => navigate('/admin/games')}>
              <i className="fi fi-rr-gamepad"></i>
              <span>Manage games</span>
            </button>
            <button className="coming btn-icon" onClick={() => navigate('/admin/users')}>
              <i className="fi fi-rr-users"></i>
              <span>Manage users</span>
            </button>
          </>
        )}
      </div>

      <div className="search-container">
        <i className="fi fi-rr-search search-icon"></i>
        <input
          type="text"
          placeholder="Buscar juegos…"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <main className="juegos">
        {filtered.map(juego => (
          <div className={`card ${!juego.disponible ? 'sold-out-card' : ''}`} key={juego._id}>
            {!juego.disponible && <div className="sold-out">Agotado</div>}
            <img src={juego.imagen} alt={juego.nombre} />
            <div className="card-content">
              <h3>{juego.nombre}</h3>
              <p>{juego.descripcion}</p>
              <span className="precio">${juego.precio.toFixed(2)}</span>
              <button
                className={`detalle${!juego.disponible ? ' disabled' : ''}`}
                onClick={() => juego.disponible && navigate(`/juego/${juego._id}`)}
                disabled={!juego.disponible}
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
