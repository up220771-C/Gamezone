// src/features/cart/cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  _id: string;             
  nombre: string;          
  descripcion: string;      
  imagen: string;          
  precio: number;          
  descuento?: number;       
  quantity: number;        
}


interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state: CartState, action: PayloadAction<CartItem>) => {
    const itemIndex = state.items.findIndex(i => i._id === action.payload._id);
      if (itemIndex >= 0) {
        state.items[itemIndex].quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    updateQuantity: (state: CartState, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find((i: CartItem) => i._id === action.payload.id);
      if (item && action.payload.quantity > 0) {
        item.quantity = action.payload.quantity;
      }
    },
    removeFromCart: (state: CartState, action: PayloadAction<string>) => {
      state.items = state.items.filter((i: CartItem) => i._id !== action.payload);
    },
    clearCart: (state: CartState) => {
      state.items = [];
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
