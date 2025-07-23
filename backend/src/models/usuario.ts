import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
  nombre: string;
  apellido: string;
  username: string;
  correo: string;
  contraseña: string;
  rol: 'cliente' | 'admin';
}

const userSchema = new mongoose.Schema<IUser>({
  nombre:      { type: String, required: true },
  apellido:    { type: String, required: true },
  username:    { type: String, required: true, unique: true },
  correo:      { type: String, required: true, unique: true },
  contraseña:  { type: String, required: true },
  rol:         { type: String, enum: ['cliente','admin'], default: 'cliente' }
}, { timestamps: true });

const User = mongoose.model<IUser>('User', userSchema);
export default User;
