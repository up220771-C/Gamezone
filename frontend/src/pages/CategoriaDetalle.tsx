import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css';

export default function CategoriaDetalle() {
  const { nombre } = useParams();
  const [juegos, setJuegos] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/juegos?plataforma=${nombre}`)
      .then(res => setJuegos(res.data))
      .catch(err => console.error('Error:', err));
  }, [nombre]);

  return (
    <div className="homepage">
      <main className="juegos">
        {juegos.map((juego: any) => (
          <div className="card" key={juego._id}>
            {/* Badge si el juego está agotado */}
            {!juego.disponible && <div className="sold-out">Agotado</div>}
            <img src={juego.imagen} alt={juego.nombre} />
            <div className="card-content">
              <h3>{juego.nombre}</h3>
              <p>{juego.descripcion}</p>
              <span className="precio">${juego.precio.toFixed(2)}</span>
              <button className="detalle" disabled={!juego.disponible}>
                Detail
              </button>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
