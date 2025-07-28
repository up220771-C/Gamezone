import { useState, useEffect } from 'react';
import './Cart.css';

export default function Cart() {
  const [cart, setCart] = useState<any[]>([]);
  const [showPayment, setShowPayment] = useState(false);
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });

  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) setCart(JSON.parse(stored));
  }, []);

  const shipping = 4.99;
  const subtotal = cart.reduce((acc, juego) => acc + juego.precio, 0);
  const total = subtotal + (cart.length > 0 ? shipping : 0);

  const handleCancel = () => {
    setCart([]);
    localStorage.removeItem('cart');
    setShowPayment(false);
  };

  const handleBuy = () => {
    setShowPayment(true);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Pago realizado con éxito!');
    setCart([]);
    localStorage.removeItem('cart');
    setShowPayment(false);
    setCardData({ number: '', name: '', expiry: '', cvv: '' });
  };

  return (
    <div className="cart-container">
      <div className="cart-main">
        <div className="cart-items">
          {cart.length === 0 ? (
            <p style={{ color: '#fff', fontSize: '1.2rem' }}>Your cart is empty.</p>
          ) : (
            cart.map(juego => (
              <div key={juego._id} className="cart-item">
                <img src={juego.imagen} alt={juego.nombre} className="cart-img" />
                <div className="cart-item-info">
                  <h3 className="cart-item-title">{juego.nombre}</h3>
                  <p className="cart-item-desc">{juego.descripcion}</p>
                  <div>
                    {Array.from({ length: juego.estrellas || 5 }).map((_, i) => (
                      <span key={i} style={{ color: '#ff0', fontSize: '1.1rem' }}>★</span>
                    ))}
                  </div>
                </div>
                <span className="cart-item-price">${juego.precio.toFixed(2)}</span>
              </div>
            ))
          )}
        </div>
        <div className="cart-summary">
          <div className="cart-summary-row">
            <div>Send: <span style={{ color: '#00ffff' }}>${cart.length > 0 ? shipping.toFixed(2) : '0.00'}</span></div>
            <div>Products: <span style={{ color: '#00ffff' }}>${subtotal.toFixed(2)}</span></div>
          </div>
          <div className="cart-summary-total">
            Total cost: <span style={{ color: '#ff00ff' }}>${total.toFixed(2)}</span>
          </div>
          <div className="cart-btn-row">
            <button
              className="cart-btn-cancel"
              onClick={handleCancel}
              disabled={cart.length === 0 || showPayment}
            >
              Cancel buy
            </button>
            <button
              className="cart-btn-buy"
              onClick={handleBuy}
              disabled={cart.length === 0 || showPayment}
            >
              Buy now
            </button>
          </div>
        </div>
      </div>
      {showPayment && (
        <div className="cart-payment-modal">
          <form onSubmit={handlePaymentSubmit} className="cart-payment-form">
            <h2 className="cart-payment-title">Payment</h2>
            <input
              type="text"
              placeholder="Card number"
              value={cardData.number}
              onChange={e => setCardData({ ...cardData, number: e.target.value })}
              required
              maxLength={19}
              className="cart-payment-input"
            />
            <input
              type="text"
              placeholder="Cardholder name"
              value={cardData.name}
              onChange={e => setCardData({ ...cardData, name: e.target.value })}
              required
              className="cart-payment-input"
            />
            <div style={{ display: 'flex', gap: '1rem' }}>
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
            <button type="submit" className="cart-payment-btn">
              Pay ${total.toFixed(2)}
            </button>
            <button
              type="button"
              onClick={() => setShowPayment(false)}
              className="cart-payment-cancel"
            >
              Cancel
            </button>
          </form>
        </div>
      )}
      <div className="cart-stars-bg">
        <div className="cart-stars-left">★ ★ ★ ★ ★</div>
        <div className="cart-stars-right">★ ★ ★ ★ ★</div>
      </div>
    </div>
  );
}