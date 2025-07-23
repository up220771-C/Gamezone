import mongoose from 'mongoose';

export interface IPlataforma extends mongoose.Document {
  nombre: string;
}

const plataformaSchema = new mongoose.Schema<IPlataforma>({
  nombre: { type: String, required: true, unique: true }
});

const Plataforma = mongoose.model<IPlataforma>('Plataforma', plataformaSchema);
export default Plataforma;
