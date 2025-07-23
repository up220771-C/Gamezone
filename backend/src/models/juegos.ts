import mongoose from 'mongoose';

export interface IJuego extends mongoose.Document {
  nombre: string;
  descripcion: string;
  precio: number;
  plataforma: string;
  genero: string;
  imagen: string;
  disponible: boolean;
}

const juegoSchema = new mongoose.Schema<IJuego>({
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  precio: { type: Number, required: true },
  plataforma: { type: String, required: true },
  genero: { type: String, required: true },
  imagen: { type: String, required: true },
  disponible: { type: Boolean, default: true }
});

const Juego = mongoose.model<IJuego>('Juego', juegoSchema);
export default Juego;
