// src/pages/Deals.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Deals.css';
import { obtenerJuegosEnOferta } from '../services/juegosService';

interface JuegoOferta {
  _id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  descuento: number; 
  imagen: string;
}

export default function Deals() {
  const navigate = useNavigate();
  const [juegos, setJuegos] = useState<JuegoOferta[]>([]);

  useEffect(() => {
    obtenerJuegosEnOferta()
      .then(data => setJuegos(data))
      .catch(err => console.error('Error al obtener ofertas:', err));
  }, []);

  return (
    <div className="page-container">
      <header className="page-header">
        <i className="fi fi-rr-badge-percent" />
        <h2>Deals</h2>
      </header>

      <main className="juegos">
        {juegos.map(juego => {
          const precioOriginal = juego.precio;
          const precioOferta = parseFloat(
            (precioOriginal * (1 - juego.descuento / 100)).toFixed(2)
          );
          return (
            <div className="card" key={juego._id}>
              <img src={juego.imagen} alt={juego.nombre} />
              <div className="card-content">
                <h3>{juego.nombre}</h3>
                <p>{juego.descripcion}</p>

                <div className="precio-container">
                  <span className="precio-original">
                    ${precioOriginal.toFixed(2)}
                  </span>
                  <span className="precio-oferta">
                    ${precioOferta.toFixed(2)}
                  </span>
                  <span className="badge-descuento">
                    -{juego.descuento}%
                  </span>
                </div>

                <button
                  className="detalle"
                  onClick={() => navigate(`/juego/${juego._id}`)}
                >
                  Detail
                </button>
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}
