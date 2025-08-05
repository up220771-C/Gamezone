import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext'; // ✅ Importar el AuthContext

interface Juego {
  _id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  descuento?: number;
  imagen: string;
  plataforma: string;
  genero: string;
  estrellas?: number;
}

interface CartItem extends Juego {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (juego: Juego) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  isInCart: (id: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth(); // ✅ Hook de sesión
  const [cart, setCart] = useState<CartItem[]>([]);

  // ✅ Cargar carrito solo si hay sesión
  useEffect(() => {
    if (token) {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          const normalizedCart = parsedCart.map((item: any) => ({
            ...item,
            quantity: item.quantity || 1
          }));
          setCart(normalizedCart);
        } catch (error) {
          console.error('Error parsing cart from localStorage:', error);
          localStorage.removeItem('cart');
        }
      }
    } else {
      setCart([]); // ✅ Limpiar carrito si se cierra sesión
      localStorage.removeItem('cart');
    }
  }, [token]); // ← se ejecuta cada vez que cambia el token

  // ✅ Guardar carrito si hay sesión
  useEffect(() => {
    if (token) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, token]);

  const addToCart = (juego: Juego) => {
    const existingItem = cart.find(item => item._id === juego._id);
    if (existingItem && existingItem.quantity >= 5) {
      throw new Error('Cantidad máxima por juego es 5.');
    }

    setCart(prevCart => {
      const found = prevCart.find(item => item._id === juego._id);
      if (found) {
        return prevCart.map(item =>
          item._id === juego._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...juego, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prevCart => prevCart.filter(item => item._id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    if (quantity > 5) {
      throw new Error('Cantidad máxima por juego es 5.');
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item._id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const precio = item.descuento
        ? item.precio * (1 - item.descuento / 100)
        : item.precio;
      return total + (precio * item.quantity);
    }, 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const isInCart = (id: string) => {
    return cart.some(item => item._id === id);
  };

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    isInCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
