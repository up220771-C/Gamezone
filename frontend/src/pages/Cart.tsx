// ✅ Versión migrada de Cart.tsx usando Redux Toolkit para el carrito
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../app/store';
import {
  updateQuantity,
  removeFromCart,
  clearCart
} from '../features/cart/cartSlice';
import jsPDF from 'jspdf';
import '../App.css';
import './Cart.css';
import './CartReceipt.css';

export default function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart.items);
  const { token, usuario } = useAuth();
  const isAuthenticated = !!token;

  const [showPayment, setShowPayment] = useState(false);
  const [cardData, setCardData] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [notification, setNotification] = useState<string | null>(null);

  const subtotal = cart.reduce((acc, item) => acc + item.precio * item.quantity, 0);
  const total = subtotal;
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleIncrease = (id: string, currentQty: number) => {
    try {
      dispatch(updateQuantity({ id, quantity: currentQty + 1 }));
    } catch (error: any) {
      setNotification(error.message);
      setTimeout(() => setNotification(null), 2000);
    }
  };

  const handleDecrease = (id: string, currentQty: number) => {
    dispatch(updateQuantity({ id, quantity: currentQty - 1 }));
  };

  const handleRemove = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const handleCancel = () => {
    dispatch(clearCart());
    setShowPayment(false);
  };

  const handleBuy = () => {
    setShowPayment(true);
    setNotification('Preparando pago...');
    setTimeout(() => setNotification(null), 2000);
  };

  const handleClosePayment = () => {
    setShowPayment(false);
    setCardData({ number: '', name: '', expiry: '', cvv: '' });
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      for (const item of cart) {
        for (let i = 0; i < item.quantity; i++) {
          const res = await fetch('http://localhost:5000/api/compras', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ juego: item._id })
          });

          const data = await res.json();

          if (!res.ok) {
            console.error(`❌ Error al comprar ${item.nombre}:`, data);
            setNotification(`Error al comprar ${item.nombre}: ${data.mensaje}`);
            return;
          }
        }
      }

      setNotification('Pago realizado con éxito!');
      setTimeout(() => setNotification(null), 2000);
      generatePDF();
      dispatch(clearCart());
      setShowPayment(false);
      setCardData({ number: '', name: '', expiry: '', cvv: '' });
      navigate('/');
    } catch (error) {
      console.error('Error en la compra:', error);
      setNotification('Error al realizar la compra');
    }
  };

  const generatePDF = async () => {
    const orderId = Date.now();
    const dateStr = new Date().toLocaleString();
    const clientName = usuario ? `${usuario.nombre} ${usuario.apellido}` : '';
    const groupedCodes: Record<string, string[]> = {};

    cart.forEach(item => {
      groupedCodes[item.nombre] = [];
      for (let i = 0; i < item.quantity; i++) {
        groupedCodes[item.nombre].push(`${item.nombre} (${i+1}/${item.quantity}): ${Math.random().toString(36).substring(2,10).toUpperCase()}`);
      }
    });

    const tableRows = cart.map(item => {
      const unit = item.descuento ? (item.precio*(1-item.descuento/100)).toFixed(2) : item.precio.toFixed(2);
      const sub = (parseFloat(unit)*item.quantity).toFixed(2);
      return `<tr><td>${item.quantity}</td><td>${item.nombre}</td><td>$${unit}</td><td>$${sub}</td></tr>`;
    }).join('');

    const receiptHTML = `...`; // omitir por espacio
    const container = document.createElement('div');
    container.innerHTML = receiptHTML;
    document.body.appendChild(container);
    const doc = new jsPDF({unit:'pt', format:'a4'});
    await (doc as any).html(container, {
      callback: () => {
        doc.save(`receipt_${orderId}.pdf`);
        document.body.removeChild(container);
      },
      x: 0, y: 0,
      html2canvas: { scale: 0.85 },
      autoPaging: 'slice',
      pagebreak: { mode: ['css', 'legacy'] }
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="cart-container">
        <h1 className="cart-title neon-text">Your cart</h1>
        <p className="empty-message">You must log in to view your cart.</p>
      </div>
    );
  }

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
                  <button
                    className="cart-btn-cancel"
                    onClick={() => handleRemove(item._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <span className="cart-item-price">
                ${(item.precio * item.quantity).toFixed(2)}
              </span>
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
);

}
