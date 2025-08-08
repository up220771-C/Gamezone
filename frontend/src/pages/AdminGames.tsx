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

  const [todos, setTodos] = useState<Juego[]>([]);
  const [filter, setFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [errorGlobal, setErrorGlobal] = useState<string>('');

  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<Juego | null>(null);
  const [passDelete, setPassDelete] = useState('');
  const [errorDelete, setErrorDelete] = useState('');
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const [currentGame, setCurrentGame] = useState<Juego | null>(null);
  const [editFormData, setEditFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    plataforma: '',
    genero: '',
    stock: '',
  });
  const [editImagen, setEditImagen] = useState<File | null>(null);

  useEffect(() => {
    cargarJuegos();
  }, []);

  const cargarJuegos = async () => {
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
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImagen(file);
  };

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
      cargarJuegos();
      setFormData({ nombre: '', descripcion: '', precio: '', plataforma: '', genero: '', stock: '' });
      setImagen(null);
    } catch {
      setMensaje('❌ Error al agregar el juego');
    }
  };

  const listaFiltrada = todos
    .filter(j => j.plataforma.toLowerCase() !== 'steam')
    .filter(j => (filter ? j.plataforma === filter : true))
    .filter(j => j.nombre.toLowerCase().includes(searchTerm.toLowerCase()));

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

  const verDetalles = (juego: Juego) => {
    setCurrentGame(juego);
    setViewModalOpen(true);
  };

  const abrirEditar = (juego: Juego) => {
    setCurrentGame(juego);
    setEditFormData({
      nombre: juego.nombre,
      descripcion: juego.descripcion,
      precio: juego.precio.toString(),
      plataforma: juego.plataforma,
      genero: juego.genero,
      stock: juego.stock.toString(),
    });
    setEditImagen(null);
    setEditModalOpen(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setEditImagen(file);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentGame) return;
    const token = localStorage.getItem('token');
    if (!token) {
      setMensaje('❌ Debes iniciar sesión como administrador');
      return;
    }
    try {
      const data = new FormData();
      Object.entries(editFormData).forEach(([k, v]) => data.append(k, v));
      if (editImagen) data.append('imagen', editImagen);

      await axios.put(`http://localhost:5000/api/juegos/${currentGame._id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setMensaje('🎮 Juego actualizado con éxito');
      cargarJuegos();
      setEditModalOpen(false);
    } catch {
      setMensaje('❌ Error al actualizar el juego');
    }
  };

  return (
    <div className="admin-games-container">
      <h1>Panel de Administración de Juegos</h1>

      <section>
        <h2>Agregar Nuevo Juego</h2>
        <form onSubmit={handleSubmit} className="admin-form" encType="multipart/form-data">
          <div className="form-grid">
            <div className="form-group">
              <label>Nombre</label>
              <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
            </div>
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
            <div className="form-group">
              <label>Stock</label>
              <input type="number" name="stock" min="0" value={formData.stock} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Plataforma</label>
              <select name="plataforma" value={formData.plataforma} onChange={handleChange} required>
                <option value="">Seleccionar plataforma</option>
                {platforms.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Género</label>
              <input type="text" name="genero" value={formData.genero} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Imagen</label>
              <input type="file" name="imagen" accept="image/*" onChange={handleFileChange} required />
            </div>
          </div>
          <div className="form-group full">
            <label>Descripción</label>
            <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} required />
          </div>
          <button type="submit">Guardar Juego</button>
          {mensaje && <p className="mensaje">{mensaje}</p>}
        </form>
      </section>

      <section>
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
            <i className="material-icons">search</i>
            <input
              type="text"
              placeholder="Buscar por nombre…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="tabla-container">
          <table className="tabla-juegos">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Plataforma</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {listaFiltrada.map(j => (
                <tr key={j._id}>
                  <td>{j.nombre}</td>
                  <td>{j.plataforma}</td>
                  <td>${j.precio.toFixed(2)}</td>
                  <td>{j.stock}</td>
                  <td>
                    <div className="acciones-celda">
                      <button className="btn-accion btn-ver" onClick={() => verDetalles(j)}>
                        <i className="material-icons">visibility</i>
                      </button>
                      <button className="btn-accion btn-editar" onClick={() => abrirEditar(j)}>
                        <i className="material-icons">edit</i>
                      </button>
                      <button className="btn-accion btn-eliminar" onClick={() => onDeleteClick(j)}>
                        <i className="material-icons">delete</i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {listaFiltrada.length === 0 && (
                <tr>
                  <td colSpan={5} className="sin-resultados">
                    No hay juegos que coincidan con los criterios de búsqueda
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {modalOpen && selected && (
        <div className="modal-backdrop">
          <div className="modal-contenido">
            <h3>Eliminar "{selected.nombre}"</h3>
            <p>¿Estás seguro? Esta acción no se puede deshacer.</p>
            <input
              type="password"
              value={passDelete}
              onChange={e => setPassDelete(e.target.value)}
              placeholder="Contraseña"
            />
            {errorDelete && <p className="error-delete">{errorDelete}</p>}
            <div className="modal-buttons">
              <button onClick={confirmarEliminacion} disabled={!passDelete}>Eliminar</button>
              <button onClick={() => setModalOpen(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {viewModalOpen && currentGame && (
        <div className="modal-backdrop">
          <div className="modal-contenido detalle-preview">
            <h3>Detalles del Juego</h3>

            <div className="preview-grid">
              <div className="preview-image">
                <img src={currentGame.imagen} alt={currentGame.nombre} />
              </div>
              <div className="preview-info">
                <div className="detalle-item">
                  <div className="detalle-etiqueta">Nombre:</div>
                  <div className="detalle-valor">{currentGame.nombre}</div>
                </div>
                <div className="detalle-item">
                  <div className="detalle-etiqueta">Plataforma:</div>
                  <div className="detalle-valor">{currentGame.plataforma}</div>
                </div>
                <div className="detalle-item">
                  <div className="detalle-etiqueta">Precio:</div>
                  <div className="detalle-valor">${currentGame.precio.toFixed(2)}</div>
                </div>
                <div className="detalle-item">
                  <div className="detalle-etiqueta">Stock:</div>
                  <div className="detalle-valor">{currentGame.stock}</div>
                </div>
                <div className="detalle-item">
                  <div className="detalle-etiqueta">Género:</div>
                  <div className="detalle-valor">{currentGame.genero}</div>
                </div>
                <div className="detalle-item full">
                  <div className="detalle-etiqueta">Descripción:</div>
                  <div className="detalle-valor">{currentGame.descripcion}</div>
                </div>
              </div>
            </div>

            <div className="modal-buttons">
              <button onClick={() => setViewModalOpen(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}


      {editModalOpen && currentGame && (
        <div className="modal-backdrop">
          <div className="modal-contenido edit-modal">
            <h3>Editar "{currentGame.nombre}"</h3>
            <form onSubmit={handleEditSubmit} className="admin-form" encType="multipart/form-data">
              <div className="form-grid">
                <div className="form-group">
                  <label>Nombre</label>
                  <input type="text" name="nombre" value={editFormData.nombre} onChange={handleEditChange} required />
                </div>
                <div className="form-group">
                  <label>Precio</label>
                  <div className="input-icon-group">
                    <span>$</span>
                    <input
                      type="number"
                      name="precio"
                      min="0"
                      step="0.01"
                      value={editFormData.precio}
                      onChange={handleEditChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Stock</label>
                  <input type="number" name="stock" min="0" value={editFormData.stock} onChange={handleEditChange} required />
                </div>
                <div className="form-group">
                  <label>Plataforma</label>
                  <select name="plataforma" value={editFormData.plataforma} onChange={handleEditChange} required>
                    <option value="">Seleccionar plataforma</option>
                    {platforms.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Género</label>
                  <input type="text" name="genero" value={editFormData.genero} onChange={handleEditChange} required />
                </div>
                <div className="form-group">
                  <label>Imagen (opcional)</label>
                  <input type="file" accept="image/*" onChange={handleEditFileChange} />
                </div>
              </div>
              <div className="form-group full">
                <label>Descripción</label>
                <textarea name="descripcion" value={editFormData.descripcion} onChange={handleEditChange} required />
              </div>
              <div className="modal-buttons">
                <button type="submit">Guardar Cambios</button>
                <button type="button" onClick={() => setEditModalOpen(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
