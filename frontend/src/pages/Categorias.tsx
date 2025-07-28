// src/pages/Categorias.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Categorias.css';

export default function Categorias() {
  const cards = [
    { id: 'xbox',     img: '/assets/xbox.png',        label: 'Juegos Xbox' },
    { id: 'PS4',      img: '/assets/playstation.png', label: 'Juegos PlayStation' },
    { id: 'Nintendo', img: '/assets/nintendo.png',    label: 'Juegos Nintendo' },
    { id: 'best',     icon: 'fi fi-rr-chat-arrow-grow', label: 'Juegos Más Vendidos' },
    { id: 'gift',     icon: 'fi fi-sr-gift',           label: 'Tarjetas de regalo' },
  ];

  return (
    <div className="categorias-container">

      {/* Primera fila: tres categorías principales */}
      <div className="cat-row">
        {cards.slice(0, 3).map(c => (
          <Link to={`/categoria/${c.id}`} key={c.id} className="cat-card-link">
            <div className="cat-card">
              {c.img
                ? <img src={c.img} alt={c.label} className="cat-img" />
                : <i className={`${c.icon} cat-icon`} />}
              <span className="cat-label">{c.label}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Segunda fila: categorías adicionales */}
      <div className="cat-row second-row">
        {cards.slice(3).map(c => (
          <Link to={`/categoria/${c.id}`} key={c.id} className="cat-card-link">
            <div className="cat-card">
              {c.img
                ? <img src={c.img} alt={c.label} className="cat-img" />
                : <i className={`${c.icon} cat-icon`} />}
              <span className="cat-label">{c.label}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
);
}
