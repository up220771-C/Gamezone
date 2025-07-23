import mongoose from 'mongoose';

export interface IGenero extends mongoose.Document {
  nombre: string;
}

const generoSchema = new mongoose.Schema<IGenero>({
  nombre: { type: String, required: true, unique: true }
});

const Genero = mongoose.model<IGenero>('Genero', generoSchema);
export default Genero;
