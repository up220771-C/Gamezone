import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../App.css';
import './JuegoDetalle.css';
import { obtenerJuegoPorId } from '../services/juegosService';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

import { FiGlobe, FiInfo, FiCode } from 'react-icons/fi';
import {
  FaStar,
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaCcPaypal,
} from 'react-icons/fa';

const GlobeIcon: any = FiGlobe;
const InfoIcon: any = FiInfo;
const CodeIcon: any = FiCode;
const StarIcon: any = FaStar;
const VisaIcon: any = FaCcVisa;
const MastercardIcon: any = FaCcMastercard;
const AmexIcon: any = FaCcAmex;
const PaypalIcon: any = FaCcPaypal;

interface Juego {
  _id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  descuento?: number;
  imagen: string;
  plataforma: string;
  genero: string;
}

export default function JuegoDetalle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { token } = useAuth();
  const isAuthenticated = !!token;

  const [juego, setJuego] = useState<Juego | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      obtenerJuegoPorId(id)
        .then(data => setJuego(data))
        .catch(console.error);
    }
  }, [id]);

  if (!juego) return <div className="detalle-page">Cargando...</div>;

  const precioOriginal = juego.precio;
  const hasDesc = juego.descuento != null && juego.descuento > 0;
  const precioOferta = hasDesc
    ? +(precioOriginal * (1 - juego.descuento! / 100)).toFixed(2)
    : precioOriginal;

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      setNotification("⚠️ Debes iniciar sesión para comprar.");
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    try {
      addToCart(juego);
      setNotification('✅ Juego añadido. Redirigiendo al carrito...');
      setTimeout(() => navigate('/cart'), 1000);
    } catch (error: any) {
      setNotification(error.message);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      setNotification("⚠️ Debes iniciar sesión para agregar al carrito.");
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    try {
      addToCart(juego);
      setNotification('✅ Juego agregado al carrito!');
      setTimeout(() => setNotification(null), 2000);
    } catch (error: any) {
      setNotification(error.message);
      setTimeout(() => setNotification(null), 2000);
    }
  };

  return (
    <>
      {notification && (
        <div className="neon-alert neon-text">{notification}</div>
      )}
      <div className="detalle-page">
        <div className="detalle-container">
          <div className="detalle-imagen">
            <img src={juego.imagen} alt={juego.nombre} />
          </div>

          <div className="detalle-info">
            <h2 className="detalle-title">
              {juego.nombre} – {juego.plataforma}
            </h2>
            <div className="detalle-sections">
              <div className="detalle-section descripcion">
                <InfoIcon className="detalle-icon" />
                <div>
                  <h3>Descripción</h3>
                  <p>{juego.descripcion}</p>
                </div>
              </div>

              <div className="detalle-section global">
                <GlobeIcon className="detalle-icon" />
                <div>
                  <h3>Global</h3>
                  <p>Este código digital se puede canjear en cualquier región.</p>
                </div>
              </div>

              <div className="detalle-section codigo">
                <CodeIcon className="detalle-icon" />
                <div>
                  <h3>Código</h3>
                  <p>
                    Tras la compra recibirás un código único que canjearás en la plataforma correspondiente.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="detalle-actions">
            <div className="detalle-stars">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className="estrella-rellena" />
              ))}
            </div>

            <button className="btn comprar" onClick={handleBuyNow}>Comprar Ahora</button>
            <button className="btn carrito" onClick={handleAddToCart}>Agregar al carrito</button>

            <div className="detalle-precio">
              {hasDesc && (
                <span className="precio-original">${precioOriginal.toFixed(2)}</span>
              )}
              <span className="precio-oferta">${precioOferta.toFixed(2)}</span>
              {hasDesc && <span className="badge-descuento">-{juego.descuento}%</span>}
            </div>

            <div className="detalle-metodos-icons">
              <VisaIcon className="pay-icon" />
              <MastercardIcon className="pay-icon" />
              <AmexIcon className="pay-icon" />
              <PaypalIcon className="pay-icon" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
