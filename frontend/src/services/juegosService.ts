// src/services/juegosService.ts
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/juegos';

//-------------------------
//import axios from 'axios';
//axios.defaults.baseURL = process.env.REACT_APP_API_URL;

//export const obtenerJuegos = () =>
//  axios.get('/api/juegos').then(res => res.data);
//-------------------------

export const obtenerJuegos = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const obtenerJuegos2 = async () => {
  const res = await axios.get('http://localhost:5000/api/juegos_2');
  return res.data;
};
export const obtenerJuegosEnOferta = async () => {
  const res = await axios.get(`${API_URL}/deals`);
  return res.data;
};

export const obtenerJuegoPorId = async (id: string) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};
/**
 * Obtiene los juegos con más de 5 ventas.
 */
export const obtenerMasVendidos = async () => {
  const res = await axios.get(`${API_URL}/masvendidos`);
  return res.data;
};