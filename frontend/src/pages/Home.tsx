import { useEffect, useState } from 'react';
import '../App.css';
import { obtenerJuegos } from '../services/juegosService';
import { useNavigate } from 'react-router-dom';


export default function Home() {
    const [juegos, setJuegos] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        obtenerJuegos()
            .then(data => {
                // Solo juegos disponibles y con precio > 0
                const disponibles = data.filter((juego: any) => juego.disponible !== false && juego.precio > 0);
                setJuegos(disponibles);
            })
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

                <button
                    className="coming btn-icon"
                    onClick={() => navigate('/coming-soon')}
                >
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
