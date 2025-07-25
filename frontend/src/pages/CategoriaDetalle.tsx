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
      <h2 style={{ textAlign: 'center' }}>Juegos de {nombre}</h2>
      <main className="juegos">
        {juegos.map((juego: any) => (
          <div className="card" key={juego._id}>
            <img src={juego.imagen} alt={juego.nombre} />
            <div className="card-content">
              <h3>{juego.nombre}</h3>
              <p>{juego.descripcion}</p>
              <span className="precio">${juego.precio.toFixed(2)}</span>
              <button className="detalle">Detail</button>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
