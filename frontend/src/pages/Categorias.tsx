// src/pages/Categorias.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Categorias.css';

export default function Categorias() {
  const cards = [
    { id: 'xbox',     img: '/assets/xbox.png',        label: 'Xbox games' },
    { id: 'PS4',      img: '/assets/playstation.png', label: 'PlayStation games' },
    { id: 'Nintendo', img: '/assets/nintendo.png',    label: 'Nintendo games' },
    { id: 'best',     icon: 'fi fi-rr-chat-arrow-grow', label: 'Best selling games' },
  ];

  return (
    <div className="categorias-container">

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

      <div className="cat-row full-width">
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
