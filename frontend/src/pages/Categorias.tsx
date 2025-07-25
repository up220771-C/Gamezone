// src/pages/Categorias.tsx
import React from 'react';
import './Categorias.css';

export default function Categorias() {
  const cards = [
    // Primera fila
    { id: 'xbox',     img: '/assets/xbox.png',        label: 'Juegos Xbox' },
    { id: 'ps',       img: '/assets/playstation.png', label: 'Juegos PlayStation' },
    { id: 'nintendo', img: '/assets/nintendo.png',    label: 'Juegos Nintendo' },

    
    { id: 'best',     icon: 'fi fi-rr-chat-arrow-grow',        label: 'Juegos Más Vendidos' },
    { id: 'gift',     icon: 'fi fi-sr-gift',         label: 'Tarjetas de regalo' },
  ];

  return (
    <div className="categorias-container">
      <div className="cat-grid">
        {cards.map(c => (
          <div className="cat-card" key={c.id}>
            {c.img  
              ? <img src={c.img} alt={c.label} className="cat-img" />  
              : <i className={`${c.icon} cat-icon`} />}
            <span className="cat-label">{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
