
// backend/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import connectDB from './config/db';
import juegosRoutes from './routes/juegos';
import juegos2Routes from './routes/juegos2';
import authRoutes from './routes/auth';
import comprasRoutes from './routes/compras';
import plataformaRoutes from './routes/plataforma';
import generoRoutes from './routes/genero';
import adminRoutes from './routes/admin';
import usersRoutes from './routes/users';


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 📁 Sirvo la carpeta uploads desde la raíz del proyecto
const uploadsPath = path.join(process.cwd(), 'uploads');
console.log(`Sirviendo uploads desde: ${uploadsPath}`);
app.use('/uploads', express.static(uploadsPath));

// 📁 Rutas API
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/juegos', juegosRoutes);
app.use('/api/juegos_2', juegos2Routes);
app.use('/api/compras', comprasRoutes);
app.use('/api/plataformas', plataformaRoutes);
app.use('/api/generos', generoRoutes);
app.use('/api/users', usersRoutes);

// Conexión a la base de datos
connectDB();

// Ruta base
app.get('/', (_req, res) => {
  res.send('🚀 API de Gamezone funcionando');
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
