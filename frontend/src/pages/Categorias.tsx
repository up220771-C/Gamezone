// src/pages/Categorias.tsx
import React from 'react';
import './Categorias.css';
import { Link } from 'react-router-dom';

export default function Categorias() {
  const cards = [
    { id: 'xbox',     img: '/assets/xbox.png',        label: 'Juegos Xbox' },
    { id: 'PS4', img: '/assets/playstation.png', label: 'Juegos PlayStation' },
    { id: 'Nintendo', img: '/assets/nintendo.png',    label: 'Juegos Nintendo' },
    { id: 'best',     icon: 'fi fi-rr-chat-arrow-grow', label: 'Juegos Más Vendidos' },
    { id: 'gift',     icon: 'fi fi-sr-gift',           label: 'Tarjetas de regalo' },
  ];

  return (
    <div className="categorias-container">
      <h2 className="cat-title">Categorías</h2>
      <div className="cat-grid">
        {cards.map(c => (
          <Link to={`/categoria/${c.id}`} key={c.id} style={{ textDecoration: 'none' }}>
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
