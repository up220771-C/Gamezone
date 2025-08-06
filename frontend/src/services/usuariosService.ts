// src/services/usuariosService.ts
import axios from 'axios';

export const obtenerUsuarios = () =>
  axios.get('/api/users').then(res => res.data);
