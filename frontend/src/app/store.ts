// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../features/cart/cartSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer, // aquí irás agregando más slices como auth, purchases, etc.
  },
});

// Tipos globales
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
 