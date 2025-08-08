import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import { obtenerMasVendidos } from '../services/juegosService';

interface JuegoMasVendido {
  juego: {
    _id: string;
    nombre: string;
    descripcion: string;
    imagen: string;
    precio: number;
    descuento?: number;
    disponible: boolean;
  };
  ventas: number;
}

export default function MasVendidos() {
  const navigate = useNavigate();
  const [items, setItems] = useState<JuegoMasVendido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    obtenerMasVendidos()
      .then(data => {
        const disponibles = data.filter((item: any) => item.juego.disponible);
        setItems(disponibles);
      })
      .catch(err => setError('Error al cargar los más vendidos'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ textAlign: 'center' }}>Cargando...</p>;
  if (error) return <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>;

  return (
    <div className="page-container masvendidos-container">
      <h2 className="seccion-titulo masvendidos-title">Más Vendidos</h2>

      <main className="juegos">
        {items.length === 0 ? (
          <p style={{ textAlign: 'center' }}>No hay juegos más vendidos.</p>
        ) : (
          items.map(item => {
            const { juego } = item;
            const precioFinal = juego.descuento
              ? +(juego.precio * (1 - juego.descuento / 100)).toFixed(2)
              : juego.precio;
            return (
              <div
                key={juego._id}
                className="card masvendidos-card"
                onClick={() => navigate(`/juego/${juego._id}`)}
              >
                <div className="masvendidos-img-wrapper">
                  <img src={juego.imagen} alt={juego.nombre} />
                </div>
                <div className="masvendidos-info">
                  <h3>{juego.nombre}</h3>
                  <p>{juego.descripcion}</p>
                  <div className="masvendidos-footer">
                    <span className="precio-oferta">${precioFinal.toFixed(2)}</span>
                    <button
                      className="detalle"
                      onClick={e => {
                        e.stopPropagation();
                        navigate(`/juego/${juego._id}`);
                      }}
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </main>
    </div>
  );
}
