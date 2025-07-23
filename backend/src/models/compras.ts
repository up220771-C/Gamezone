import mongoose from 'mongoose';

export interface ICompra extends mongoose.Document {
  usuario: mongoose.Types.ObjectId;
  juego: mongoose.Types.ObjectId;
  fecha: Date;
}

const compraSchema = new mongoose.Schema<ICompra>({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  juego: { type: mongoose.Schema.Types.ObjectId, ref: 'Juego', required: true },
  fecha: { type: Date, default: Date.now }
});

const Compra = mongoose.model<ICompra>('Compra', compraSchema);
export default Compra;
