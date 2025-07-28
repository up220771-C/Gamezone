// src/models/Juego2.ts
import { Schema, model } from 'mongoose';

const Juego2Schema = new Schema({
  nombre:       { type: String, required: true },
  descripcion:  { type: String },
  precio:       { type: Number, default: 0 },
  plataforma:   { type: String },
  genero:       { type: String },
  imagen:       { type: String },
  disponible:   { type: Boolean, default: false },
}, {
  collection: 'juegos_2'   // **IMPORTANTE**: el nombre exacto de tu colección en Mongo
});

export default model('Juego2', Juego2Schema);
