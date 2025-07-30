import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import '../App.css';
import './Cart.css';

export default function Cart() {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, clearCart, getCartTotal } = useCart();
  const [showPayment, setShowPayment] = useState(false);
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });
  const [notification, setNotification] = useState<string | null>(null);

  // Handlers to enforce per-item limit and show neon notification on error
  const handleIncrease = (id: string, currentQty: number) => {
    try {
      updateQuantity(id, currentQty + 1);
    } catch (error: any) {
      setNotification(error.message);
      setTimeout(() => setNotification(null), 2000);
    }
  };

  const handleDecrease = (id: string, currentQty: number) => {
    // decreasing won't exceed limits
    updateQuantity(id, currentQty - 1);
  };

  // CartContext loads saved cart automatically

  const subtotal = getCartTotal();
  const total = subtotal;

  const handleCancel = () => {
    clearCart();
    setShowPayment(false);
  };

  const handleBuy = () => {
    setShowPayment(true);
    setNotification('Preparando pago...');
    setTimeout(() => setNotification(null), 2000);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNotification('Pago realizado con éxito!');
    setTimeout(() => setNotification(null), 2000);
    clearCart();
    setShowPayment(false);
    setCardData({ number: '', name: '', expiry: '', cvv: '' });
    navigate('/');
  };

  return (
    <div className="cart-container">
      <h1 className="cart-title neon-text">Tu Carrito</h1>
      <div className="cart-main">
        <div className="cart-items">
          {cart.length === 0 ? (
            <p className="empty-message">Tu carrito está vacío.</p>
          ) : (
            cart.map(item => (
              <div key={item._id} className="cart-item">
                <img src={item.imagen} alt={item.nombre} className="cart-img" />
                <div className="cart-item-info">
                  <h3 className="cart-item-title">{item.nombre}</h3>
                  <p className="cart-item-desc">{item.descripcion}</p>
                  <div className="quantity-controls">
                    <button
                      className="cart-btn-buy"
                      onClick={() => handleDecrease(item._id, item.quantity)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="cart-qty">{item.quantity}</span>
                    <button
                      className="cart-btn-buy"
                      onClick={() => handleIncrease(item._id, item.quantity)}
                    >
                      +
                    </button>
                  </div>
                  <button className="cart-btn-cancel" onClick={() => removeFromCart(item._id)}>Eliminar</button>
                </div>
                <span className="cart-item-price">${(item.precio * item.quantity).toFixed(2)}</span>
              </div>
            ))
          )}
        </div>
        <div className="cart-summary">
          <div className="summary-line"><span>Productos:</span><span>${subtotal.toFixed(2)}</span></div>
          <div className="summary-total"><span>Total cost:</span><span>${total.toFixed(2)}</span></div>
          <div className="cart-btn-row">
            <button className="cart-btn-cancel" onClick={clearCart} disabled={cart.length === 0}>Cancelar compra</button>
            <button className="cart-btn-buy" onClick={handleBuy} disabled={cart.length === 0}>Comprar ahora</button>
          </div>
        </div>
      </div>
      {showPayment && (
        <div className="cart-payment-modal">
          <button className="modal-close" onClick={handleCancel}>X</button>
          <form onSubmit={handlePaymentSubmit} className="cart-payment-form">
            <h2 className="cart-payment-title">Datos de Pago</h2>
            <input
              type="text"
              placeholder="Número de tarjeta"
              value={cardData.number}
              onChange={e => setCardData({ ...cardData, number: e.target.value })}
              required
              maxLength={19}
              className="cart-payment-input"
            />
            <input
              type="text"
              placeholder="Nombre en la tarjeta"
              value={cardData.name}
              onChange={e => setCardData({ ...cardData, name: e.target.value })}
              required
              className="cart-payment-input"
            />
            <div className="payment-row">
              <input
                type="text"
                placeholder="MM/YY"
                value={cardData.expiry}
                onChange={e => setCardData({ ...cardData, expiry: e.target.value })}
                required
                maxLength={5}
                className="cart-payment-input-half"
              />
              <input
                type="password"
                placeholder="CVV"
                value={cardData.cvv}
                onChange={e => setCardData({ ...cardData, cvv: e.target.value })}
                required
                maxLength={4}
                className="cart-payment-input-half"
              />
            </div>
            <button type="submit" className="confirm-btn">Confirmar pago</button>
          </form>
        </div>
      )}
      {/* Fondo de estrellas decorativas */}
      <div className="cart-stars-bg">
        <div className="cart-stars-left">★</div>
        <div className="cart-stars-right">★</div>
      </div>
      {/* Imagen decorativa estilo Vault Boy */}
      <img src="/assets/Vallue_Boy.png" alt="Vallue Boy" className="cart-vaultboy" />
    </div>
  );
}