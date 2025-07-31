// src/pages/AdminGames.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminGames.css';

interface Juego {
  _id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  plataforma: string;
  genero: string;
  stock: number;
  imagen: string;
}

export default function AdminGames() {
  // — estados para el formulario de agregar —
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    plataforma: '',
    genero: '',
    stock: '',
  });
  const [imagen, setImagen] = useState<File | null>(null);
  const [mensaje, setMensaje] = useState('');

  // — estados para el listado, filtrado y búsqueda —
  const [todos, setTodos] = useState<Juego[]>([]);
  const [filter, setFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [errorGlobal, setErrorGlobal] = useState<string>('');

  // — estados para el modal de eliminación —
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<Juego | null>(null);
  const [passDelete, setPassDelete] = useState('');
  const [errorDelete, setErrorDelete] = useState('');

  // Carga todos los juegos al montar, extrae plataformas y excluye "Steam"
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('token') || '';
        const res = await axios.get<Juego[]>('http://localhost:5000/api/juegos', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTodos(res.data);
        const todasPlats = Array.from(new Set(res.data.map(j => j.plataforma)));
        const filtradas = todasPlats.filter(p => p.toLowerCase() !== 'steam');
        setPlatforms(filtradas);
      } catch {
        setErrorGlobal('Error al cargar juegos.');
      }
    })();
  }, []);

  // Handlers para el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImagen(file);
  };

  // Agregar juego
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setMensaje('❌ Debes iniciar sesión como administrador');
      return;
    }
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([k, v]) => data.append(k, v));
      if (imagen) data.append('imagen', imagen);
      await axios.post('http://localhost:5000/api/juegos', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setMensaje('🎮 Juego agregado con éxito');
      // refrescar listado
      const res = await axios.get<Juego[]>('http://localhost:5000/api/juegos', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTodos(res.data);
      const todasPlats = Array.from(new Set(res.data.map(j => j.plataforma)));
      setPlatforms(todasPlats.filter(p => p.toLowerCase() !== 'steam'));
      setFormData({ nombre: '', descripcion: '', precio: '', plataforma: '', genero: '', stock: '' });
      setImagen(null);
    } catch {
      setMensaje('❌ Error al agregar el juego');
    }
  };

  // Filtrado + búsqueda
  const listaFiltrada = todos
    .filter(j => j.plataforma.toLowerCase() !== 'steam')
    .filter(j => (filter ? j.plataforma === filter : true))
    .filter(j => j.nombre.toLowerCase().includes(searchTerm.toLowerCase()));

  // Modal de eliminación
  const onDeleteClick = (j: Juego) => {
    setSelected(j);
    setPassDelete('');
    setErrorDelete('');
    setModalOpen(true);
  };
  const confirmarEliminacion = async () => {
    if (!selected) return;
    try {
      const token = localStorage.getItem('token') || '';
      await axios.delete(`http://localhost:5000/api/juegos/${selected._id}`, {
        data: { password: passDelete },
        headers: { Authorization: `Bearer ${token}` }
      });
      setTodos(prev => prev.filter(j => j._id !== selected._id));
      setModalOpen(false);
    } catch (err: any) {
      setErrorDelete(err.response?.data?.mensaje || 'Error al eliminar');
    }
  };

  return (
    <div className="admin-games-container">
      <h1>Agregar Nuevo Juego</h1>
      <form onSubmit={handleSubmit} className="admin-form" encType="multipart/form-data">
        <div className="form-grid">
          {/* Nombre */}
          <div className="form-group">
            <label>Nombre</label>
            <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
          </div>
          {/* Precio */}
          <div className="form-group">
            <label>Precio</label>
            <div className="input-icon-group">
              <span>$</span>
              <input
                type="number"
                name="precio"
                min="0"
                step="0.01"
                value={formData.precio}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          {/* Stock */}
          <div className="form-group">
            <label>Stock Disponible</label>
            <input type="number" name="stock" min="0" value={formData.stock} onChange={handleChange} required />
          </div>
          {/* Plataforma */}
          <div className="form-group">
            <label>Plataforma</label>
            <input type="text" name="plataforma" value={formData.plataforma} onChange={handleChange} required />
          </div>
          {/* Género */}
          <div className="form-group">
            <label>Género</label>
            <input type="text" name="genero" value={formData.genero} onChange={handleChange} required />
          </div>
          {/* Imagen */}
          <div className="form-group">
            <label>Imagen</label>
            <input type="file" name="imagen" accept="image/*" onChange={handleFileChange} required />
          </div>
        </div>
        {/* Descripción */}
        <div className="form-group full">
          <label>Descripción</label>
          <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} required />
        </div>
        <button type="submit">Guardar Juego</button>
        {mensaje && <p className="mensaje">{mensaje}</p>}
      </form>

      <h2>Administrar Juegos</h2>
      {errorGlobal && <p className="error-global">{errorGlobal}</p>}

      <div className="controls">
        <div className="filtro">
          <label htmlFor="plataforma">Filtrar por plataforma:</label>
          <select id="plataforma" value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="">Todas</option>
            {platforms.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div className="buscador">
          <input
            type="text"
            placeholder="Buscar por nombre…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <table className="tabla-juegos">
        <thead>
          <tr>
            <th>Name</th>
            <th>Plataform</th>
            <th>Price</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {listaFiltrada.map(j => (
            <tr key={j._id}>
              <td>{j.nombre}</td>
              <td>{j.plataforma}</td>
              <td>${j.precio.toFixed(2)}</td>
              <td>
                <button className="btn-eliminar" onClick={() => onDeleteClick(j)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {listaFiltrada.length === 0 && (
            <tr>
              <td colSpan={4} className="sin-resultados">
                No hay juegos que coincidan.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {modalOpen && selected && (
        <div className="modal-backdrop">
          <div className="modal-contenido">
            <h3>Delete “{selected.nombre}”</h3>
            <p>Ingresa tu contraseña de administrador:</p>
            <input
              type="password"
              value={passDelete}
              onChange={e => setPassDelete(e.target.value)}
              placeholder="Contraseña"
            />
            {errorDelete && <p className="error-delete">{errorDelete}</p>}
            <div className="modal-buttons">
              <button
                className="btn-neon"
                onClick={confirmarEliminacion}
                disabled={!passDelete}
              >
                Delete
              </button>
              <button
                className="btn-neon"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
