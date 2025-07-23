import { useEffect, useState } from 'react';
import '../App.css';
import { obtenerJuegos } from '../services/juegosService';


export default function Home() {
    const [juegos, setJuegos] = useState<any[]>([]);

    useEffect(() => {
        obtenerJuegos()
            .then(data => setJuegos(data))
            .catch(err => console.error('Error al obtener juegos:', err));
    }, []);

    return (
        <div className="homepage">


            <div className="destacados">
                {/* Deals con icono */}
                <button className="deal btn-icon">
                    <i className="fi fi-rr-badge-percent"></i>
                    <span>Deals</span>
                </button>

                <button className="coming btn-icon">
                    <i className="fi fi-rr-calendar"></i>
                    <span>Coming Soon</span>
                </button>
            </div>

            <main className="juegos">
                {juegos.map((juego) => (
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
