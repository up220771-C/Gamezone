import mongoose from 'mongoose';

export interface IJuego extends mongoose.Document {
  nombre: string;
  descripcion: string;
  precio: number;
  plataforma: string;
  genero: string;
  imagen: string;
  disponible: boolean;
  descuento: number;
}

const juegoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String },
  precio: { type: Number, required: true },
  plataforma: { type: String, required: true },
  genero: { type: String },
  imagen: { type: String },
  disponible: { type: Boolean, default: true },
  descuento: { type: Number, default: 0 }
});
const Juego = mongoose.model<IJuego>('Juego', juegoSchema);
export default Juego;
