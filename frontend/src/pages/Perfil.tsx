import './Perfil.css';
import { useEffect, useState } from 'react';

interface Usuario {
  nombre: string;
  apellido: string;
  username: string;
  correo: string;
}

export default function Perfil() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [editField, setEditField] = useState<keyof Usuario | null>(null);
  const [tempValue, setTempValue] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:5000/api/auth/perfil', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => data.usuario && setUsuario(data.usuario));
  }, []);

  const startEdit = (field: keyof Usuario) => {
    if (!usuario) return;
    setEditField(field);
    setTempValue(usuario[field]);
  };

  const cancelEdit = () => {
    setEditField(null);
    setTempValue('');
  };

  // No se ejecuta aún, solo ejemplar
  const saveEdit = async () => {
    /* aquí vendría el PATCH */
    setUsuario(u => u && ({ ...u, [editField!]: tempValue }));
    cancelEdit();
  };

  return (
    <div className="perfil-container">
      <h2 className="seccion-titulo">Overview</h2>

      {/* PROFILE */}
      <div className="card-seccion perfil-top">
        <div className="perfil-usuario">
          <img src="/logo.png" alt="avatar" />
          <div className="perfil-info">
            <p className="username">{usuario?.username}</p>
            <p className="correo">{usuario?.correo}</p>
          </div>
        </div>
      </div>

      {/* PERSONAL INFORMATION w/ inline-edit */}
      <h3 className="subtitulo">Personal Information</h3>
      <div className="card-seccion">
        <div className="personal-info-grid">
          {(['nombre','apellido','username','correo'] as (keyof Usuario)[]).map(field => (
            <div key={field}>
              <div className="info-header">
                <span className="info-label">
                  {field === 'nombre' ? 'Name'
                   : field === 'apellido' ? 'Last name'
                   : field === 'username' ? 'Username'
                   : 'Correo'}
                </span>
                {editField !== field && (
                  <i
                    className="fi fi-rr-pencil edit-icon"
                    onClick={() => startEdit(field)}
                  />
                )}
              </div>

              {editField === field ? (
                <div className="edit-row">
                  <input
                    className="edit-input"
                    value={tempValue}
                    onChange={e => setTempValue(e.target.value)}
                  />
                  <i className="fi fi-rr-check save-icon" onClick={saveEdit} />
                  <i className="fi fi-rr-cross-circle cancel-icon" onClick={cancelEdit} />
                </div>
              ) : (
                <p className="info-value">{usuario?.[field]}</p>
              )}
            </div>
          ))}
        </div>

        

        <div className="total-gastos">
          <span className="titulo-gasto">Total Expenses</span>
          <div className="monto">0.00 USD</div>
        </div>
      </div>

      {/* LATEST PURCHASES */}
      <h3 className="subtitulo">Latest Purchases</h3>
      <div className="card-seccion ultimas-compras">
        <img src="/juegos/farcry6.jpg" alt="Última compra" />
        <button className="view-history-btn">View History</button>
      </div>
    </div>
  );
}
