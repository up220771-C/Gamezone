import { useEffect, useState } from 'react';

export default function ComingSoon() {
  const [juegos, setJuegos] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/juegos?disponible=false')
      .then(res => res.json())
      .then(data => {
        // Filtra los juegos que tienen precio 0
        const filtrados = data.filter((juego: any) => juego.precio === 0);
        setJuegos(filtrados);
      })
      .catch(err => console.error('Error al obtener juegos:', err));
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'transparent',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '2rem',
      }}
    >
      <div
        style={{
          background: '#1e1f3b',
          borderRadius: '24px',
          padding: '2rem',
          width: '90%',
          maxWidth: '1200px',
          boxShadow: '0 2px 20px rgba(0,255,255,0.12)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
          <i
            className="fi fi-rr-calendar"
            style={{
              fontSize: '2.2rem',
              color: '#ff00ff',
              marginRight: '1rem',
            }}
          />
          <h2
            style={{
              color: '#00ffff',
              fontWeight: 'bold',
              fontSize: '2rem',
              margin: 0,
              letterSpacing: '1px',
            }}
          >
            Coming Soon
          </h2>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2rem',
          }}
        >
          {juegos.length === 0 ? (
            <p style={{ color: '#fff' }}>No upcoming games found.</p>
          ) : (
            juegos.map(juego => (
              <div
                key={juego._id}
                style={{
                  background: '#23244a',
                  borderRadius: '15px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  border: '1px solid #00ffff',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minHeight: '370px',
                  position: 'relative',
                }}
              >
                <img
                  src={juego.imagen}
                  alt={juego.nombre}
                  style={{
                    width: '120px',
                    height: '160px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    marginBottom: '0.7rem',
                    boxShadow: '0 0 8px #0ff',
                  }}
                />
                <h3
                  style={{
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    margin: '0 0 0.3rem 0',
                    textAlign: 'center',
                  }}
                >
                  {juego.nombre}
                </h3>
                <div style={{ marginBottom: '0.4rem' }}>
                  {Array.from({ length: juego.estrellas || 5 }).map((_, i) => (
                    <span key={i} style={{ color: '#ff0', fontSize: '1.1rem' }}>★</span>
                  ))}
                </div>
                <p
                  style={{
                    color: '#b3b3ff',
                    fontSize: '0.95rem',
                    margin: '0 0 0.7rem 0',
                    textAlign: 'center',
                    minHeight: '60px',
                  }}
                >
                  {juego.descripcion}
                </p>
                <button
                  style={{
                    background: '#ff00ff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '0.5rem 1.2rem',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    marginTop: 'auto',
                    boxShadow: '0 0 8px #ff00ff',
                  }}
                >
                  Detail
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}