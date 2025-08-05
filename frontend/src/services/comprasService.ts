const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export interface Compra {
  _id: string;
  juego: {
    _id: string;
    nombre: string;
    imagen: string;
    precio: number;
    descuento: number;
  };
  // precioPagado opcional, puede calcularse si no lo retorna el backend
  precioPagado?: number;
  fecha: string;
}

/**
 * Obtiene las compras realizadas por el usuario autenticado.
 */
export const getPurchases = async (): Promise<Compra[]> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No auth token');
  const response = await fetch(`${API}/api/compras`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) {
    throw new Error('Error fetching purchases');
  }
  const data = await response.json();
  return data;
};

/**
 * Registra una compra para el usuario autenticado.
 * @param juegoId ID del juego a comprar
 */
export const addPurchase = async (juegoId: string): Promise<Compra> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No auth token');
  const response = await fetch(`${API}/api/compras`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ juego: juegoId })
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error adding purchase');
  }
  const data = await response.json();
  return data;
};
