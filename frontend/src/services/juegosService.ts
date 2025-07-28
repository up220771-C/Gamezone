import axios from 'axios';

const API_URL = 'http://localhost:5000/api/juegos';

export const obtenerJuegos = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const obtenerJuegos2 = async () => {
  const res = await axios.get('http://localhost:5000/api/juegos_2');
  return res.data;
};