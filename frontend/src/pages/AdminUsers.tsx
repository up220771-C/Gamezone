// src/pages/AdminUsers.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminUsers.css';

axios.defaults.baseURL = 'http://localhost:5000';

interface UsuarioAPI {
  _id: string;
  nombre: string;
  correo: string;
  rol: 'cliente' | 'admin';
  activo: boolean;
}

interface Usuario {
  _id: string;
  nombre: string;
  email: string;
  role: 'user' | 'admin';
  activo: boolean;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<Usuario[]>([]);
  const [filterRole, setFilterRole] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [errorGlobal, setErrorGlobal] = useState<string>('');
  const [mensaje, setMensaje] = useState<string>('');

  const [newUser, setNewUser] = useState({
    nombre: '',
    email: '',
    role: 'user',
    password: '',
  });

  const [viewModal, setViewModal] = useState<Usuario | null>(null);
  const [editModal, setEditModal] = useState<Usuario | null>(null);
  const [editData, setEditData] = useState({
    nombre: '',
    email: '',
    role: 'user',
  });
  const [deleteModal, setDeleteModal] = useState<Usuario | null>(null);
  const [confirmPass, setConfirmPass] = useState<string>('');
  const [errorDelete, setErrorDelete] = useState<string>('');

  useEffect(() => {
    cargarUsers();
  }, []);

  const cargarUsers = async () => {
    try {
      const token = localStorage.getItem('token') || '';
      const { data } = await axios.get<UsuarioAPI[]>('/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const mapped: Usuario[] = data.map(u => ({
        _id:    u._id,
        nombre: u.nombre,
        email:  u.correo,
        role:   u.rol === 'admin' ? 'admin' : 'user',
        activo: u.activo
      }));

      setUsers(mapped);
    } catch {
      setErrorGlobal('Error al cargar usuarios.');
    }
  };

  const handleNewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token') || '';
      await axios.post(
        '/api/users',
        {
          nombre: newUser.nombre,
          correo: newUser.email,
          rol:    newUser.role,
          contraseña: newUser.password
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMensaje('Usuario creado con éxito');
      setNewUser({ nombre: '', email: '', role: 'user', password: '' });
      cargarUsers();
    } catch {
      setMensaje('Error al crear usuario');
    }
  };

  const listaFiltrada = users
    .filter(u => filterRole ? u.role === filterRole : true)
    .filter(u =>
      u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const abrirView   = (u: Usuario) => setViewModal(u);
  const abrirEdit   = (u: Usuario) => {
    setEditModal(u);
    setEditData({ nombre: u.nombre, email: u.email, role: u.role });
  };
  const abrirDelete = (u: Usuario) => {
    setDeleteModal(u);
    setConfirmPass('');
    setErrorDelete('');
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModal) return;
    try {
      const token = localStorage.getItem('token') || '';
      await axios.put(
        `/api/users/${editModal._id}`,
        {
          nombre:  editData.nombre,
          correo:  editData.email,
          rol:     editData.role
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMensaje('Usuario actualizado con éxito');
      setEditModal(null);
      cargarUsers();
    } catch {
      setMensaje('Error al actualizar usuario');
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    try {
      const token = localStorage.getItem('token') || '';
      await axios.delete(`/api/users/${deleteModal._id}`, {
        data: { password: confirmPass },
        headers: { Authorization: `Bearer ${token}` }
      });
      setDeleteModal(null);
      cargarUsers();
    } catch (err: any) {
      setErrorDelete(err.response?.data?.mensaje || 'Error al eliminar');
    }
  };

  return (
    <div className="admin-users-container">
      <h1>Administrar Usuarios</h1>

      <section className="create-section">
        <h2>Crear Nuevo Usuario</h2>
        <form onSubmit={handleCreateUser} className="user-form">
          <div className="form-row">
            <input
              name="nombre"
              placeholder="Nombre"
              value={newUser.nombre}
              onChange={handleNewChange}
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={handleNewChange}
              required
            />
          </div>
          <div className="form-row">
            <select name="role" value={newUser.role} onChange={handleNewChange}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <input
              name="password"
              type="password"
              placeholder="Contraseña"
              value={newUser.password}
              onChange={handleNewChange}
              required
            />
          </div>
          <button type="submit">Agregar Usuario</button>
          {mensaje && <p className="mensaje">{mensaje}</p>}
        </form>
      </section>

      <section className="filter-section">
        {errorGlobal && <p className="error">{errorGlobal}</p>}
        <label>Filtrar por rol:</label>
        <select value={filterRole} onChange={e => setFilterRole(e.target.value)}>
          <option value="">Todos</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <input
          type="text"
          placeholder="Buscar nombre o email…"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </section>

      <section className="table-section">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Activo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {listaFiltrada.map(u => (
              <tr key={u._id}>
                <td>{u.nombre}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.activo ? 'Sí' : 'No'}</td>
                <td className="actions">
                  <button onClick={() => abrirView(u)} title="Ver">
                    <i className="material-icons">visibility</i>
                  </button>
                  <button onClick={() => abrirEdit(u)} title="Editar">
                    <i className="material-icons">edit</i>
                  </button>
                  <button onClick={() => abrirDelete(u)} title="Eliminar">
                    <i className="material-icons">delete</i>
                  </button>
                </td>
              </tr>
            ))}
            {listaFiltrada.length === 0 && (
              <tr>
                <td colSpan={5} className="no-results">
                  No hay usuarios
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {viewModal && (
        <div className="modal-backdrop">
          <div className="modal-box detail-modal">
            <h3>Detalles de {viewModal.nombre}</h3>
            <p><strong>Email:</strong> {viewModal.email}</p>
            <p><strong>Rol:</strong> {viewModal.role}</p>
            <p><strong>Activo:</strong> {viewModal.activo ? 'Sí' : 'No'}</p>
            <button onClick={() => setViewModal(null)}>Cerrar</button>
          </div>
        </div>
      )}

      {editModal && (
        <div className="modal-backdrop">
          <div className="modal-box edit-modal">
            <h3>Editar {editModal.nombre}</h3>
            <form onSubmit={handleEditSubmit} className="user-form">
              <div className="form-row">
                <input
                  name="nombre"
                  value={editData.nombre}
                  onChange={handleEditChange}
                  required
                />
                <input
                  name="email"
                  type="email"
                  value={editData.email}
                  onChange={handleEditChange}
                  required
                />
              </div>
              <div className="form-row">
                <select
                  name="role"
                  value={editData.role}
                  onChange={handleEditChange}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <button type="submit">Guardar</button>
                <button type="button" onClick={() => setEditModal(null)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteModal && (
        <div className="modal-backdrop">
          <div className="modal-box delete-modal">
            <h3>Eliminar {deleteModal.nombre}?</h3>
            <input
              type="password"
              placeholder="Contraseña admin"
              value={confirmPass}
              onChange={e => setConfirmPass(e.target.value)}
            />
            {errorDelete && <p className="error">{errorDelete}</p>}
            <div className="delete-buttons">
              <button onClick={handleDelete} disabled={!confirmPass}>
                Eliminar
              </button>
              <button type="button" onClick={() => setDeleteModal(null)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
