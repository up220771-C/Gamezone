// src/models/juegos.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IJuego extends Document {
  nombre: string;
  descripcion: string;
  precio: number;
  plataforma: string;
  genero: string;
  imagen: string;
  disponible: boolean;
  descuento: number;
}

const juegoSchema = new Schema<IJuego>({
  nombre:      { type: String,  required: true },
  descripcion: { type: String,  required: true },
  precio:      { type: Number,  required: true },
  plataforma:  { type: String,  required: true },
  genero:      { type: String,  required: true },
  imagen:      { type: String,  required: true },
  disponible:  { type: Boolean, default: true },
  descuento:   { type: Number,  default: 0 }, // porcentaje de oferta
});

export default mongoose.model<IJuego>('Juego', juegoSchema);