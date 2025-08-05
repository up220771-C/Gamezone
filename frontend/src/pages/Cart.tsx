import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import '../App.css';
import './Cart.css';

export default function Cart() {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, clearCart, getCartTotal } = useCart();
  const { token } = useAuth();
  const isAuthenticated = !!token;

  const [showPayment, setShowPayment] = useState(false);
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });
  const [notification, setNotification] = useState<string | null>(null);

  // ⛔️ Si no hay sesión, no mostramos el carrito
  if (!isAuthenticated) {
    return (
      <div className="cart-container">
        <h1 className="cart-title neon-text">Your cart</h1>
        <p className="empty-message">Debes iniciar sesión para ver tu carrito.</p>
      </div>
    );
  }

  const handleIncrease = (id: string, currentQty: number) => {
    try {
      updateQuantity(id, currentQty + 1);
    } catch (error: any) {
      setNotification(error.message);
      setTimeout(() => setNotification(null), 2000);
    }
  };

  const handleDecrease = (id: string, currentQty: number) => {
    updateQuantity(id, currentQty - 1);
  };

  const handleRemove = (id: string) => {
    removeFromCart(id);
  };

  const subtotal = getCartTotal();
  const total = subtotal;
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleCancel = () => {
    clearCart();
    setShowPayment(false);
  };

  const handleClosePayment = () => {
    setShowPayment(false);
    setCardData({ number: '', name: '', expiry: '', cvv: '' });
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
      <h1 className="cart-title neon-text">Your cart</h1>
      {notification && <p className="cart-notification">{notification}</p>}
      <div className="cart-main">
        <div className="cart-items">
          {cart.length === 0 ? (
            <p className="empty-message">Your shopping cart is empty.</p>
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
                  <div>
                    <button className="cart-btn-cancel" onClick={() => handleRemove(item._id)}>
                      Delete
                    </button>
                  </div>
                </div>
                <span className="cart-item-price">${(item.precio * item.quantity).toFixed(2)}</span>
              </div>
            ))
          )}
        </div>

        <div className="cart-summary">
          <div className="summary-line">
            <span>Products:</span>
            <span>{totalItems}</span>
          </div>
          <div className="summary-total">
            <span>Total cost:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="cart-btn-row">
            <button className="cart-btn-cancel" onClick={handleCancel} disabled={cart.length === 0}>
              Cancel buy
            </button>
            <button className="cart-btn-buy" onClick={handleBuy} disabled={cart.length === 0}>
              Buy now
            </button>
          </div>
        </div>
      </div>

      {showPayment && (
        <div className="cart-payment-modal">
          <form onSubmit={handlePaymentSubmit} className="cart-payment-form">
            <button
              type="button"
              className="cart-payment-close"
              onClick={handleClosePayment}
            >
              ✕
            </button>
            <h2 className="cart-payment-title">Payment details</h2>

            <div className="payment-full-row">
              <input
                type="text"
                placeholder="Número de tarjeta"
                value={cardData.number}
                onChange={e => setCardData({ ...cardData, number: e.target.value })}
                required
                maxLength={19}
                className="cart-payment-input-half"
              />
              <input
                type="text"
                placeholder="Nombre en la tarjeta"
                value={cardData.name}
                onChange={e => setCardData({ ...cardData, name: e.target.value })}
                required
                className="cart-payment-input-half"
              />
            </div>

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
            <button type="submit" className="confirm-btn">
              Confirm purchase
            </button>
            <div className="payment-logos">
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" style={{ height: '30px' }} />
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" style={{ height: '30px' }} />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" style={{ height: '30px' }} />
            </div>
          </form>
        </div>
      )}

      <div className="cart-stars-bg">
        <div className="cart-stars-left">★</div>
        <div className="cart-stars-right">★</div>
      </div>
      <img src="https://i.imgur.com/C1vqLxU.png" alt="Vallue Boy" className="cart-vaultboy" />
    </div>
  );
}
