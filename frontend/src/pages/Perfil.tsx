// src/pages/Perfil.tsx
import './Perfil.css';
import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPurchases, Compra } from '../services/comprasService';

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
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [purchases, setPurchases] = useState<Compra[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const navigate = useNavigate();

  // Helper to calculate paid price if not provided by backend
  const getPrecioPagado = (compra: Compra): number => {
    return compra.precioPagado !== undefined
      ? compra.precioPagado
      : compra.juego.precio - (compra.juego.precio * compra.juego.descuento) / 100;
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch('http://localhost:5000/api/auth/perfil', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => data.usuario && setUsuario(data.usuario));
  }, []);

  // Obtener compras y calcular gastos totales
  useEffect(() => {
    getPurchases()
      .then((data: Compra[]) => {
        setPurchases(data);
      })
      .catch(err => console.error('Error cargando compras:', err));
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

  const saveEdit = async () => {
    if (!editField) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/auth/perfil', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ [editField]: tempValue })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Error al guardar cambios');
      }
      const data = await res.json();
      setUsuario(data.usuario);
      cancelEdit();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
    window.location.reload()
  };

  // Agrupar compras por juego para mostrar cantidad y gasto total por juego
  const purchaseSummary = useMemo(() => {
    const map: Record<string, { juego: any; quantity: number; total: number }> = {};
    purchases.forEach(compra => {
      const id = compra.juego._id;
      const price = getPrecioPagado(compra);
      if (!map[id]) {
        map[id] = { juego: compra.juego, quantity: 1, total: price };
      } else {
        map[id].quantity += 1;
        map[id].total += price;
      }
    });
    return Object.values(map);
  }, [purchases]);

  // Recalcular totalExpenses a partir del resumen agrupado
  useEffect(() => {
    const sum = purchaseSummary.reduce((acc, ps) => acc + ps.total, 0);
    setTotalExpenses(sum);
  }, [purchaseSummary]);

  return (
    <div className="perfil-container">
      <h2 className="seccion-titulo">Overview</h2>
      <div className="card-seccion perfil-top">
        <div className="perfil-usuario">
          <img
            src="https://www.pngmart.com/files/15/Fallout-Pip-Boy-PNG-HD.png"
            alt="avatar"
          />
          <div className="perfil-info">
            <p className="username">{usuario?.username}</p>
            <p className="correo">{usuario?.correo}</p>
          </div>
        </div>
      </div>

      <h3 className="subtitulo">Personal Information</h3>
      <div className="card-seccion">
        <div className="personal-info-grid">
          {(['nombre', 'apellido', 'username', 'correo'] as (keyof Usuario)[]).map(
            field => (
              <div key={field}>
                <div className="info-header">
                  <span className="info-label">
                    {field === 'nombre'
                      ? 'Name'
                      : field === 'apellido'
                      ? 'Last name'
                      : field === 'username'
                      ? 'Username'
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
                    <i
                      className="fi fi-rr-cross-circle cancel-icon"
                      onClick={cancelEdit}
                    />
                  </div>
                ) : (
                  <p className="info-value">{usuario?.[field]}</p>
                )}
              </div>
            )
          )}
        </div>

        <div className="total-gastos">
          <span className="titulo-gasto">Total Expenses</span>
          <div className="monto">{totalExpenses.toFixed(2)} USD</div>
        </div>
      </div>

      <h3 className="subtitulo">Latest Purchases</h3>
      <button
        className="view-history-btn"
        onClick={() => setShowHistory(h => !h)}
      >
        {showHistory ? 'Hide History' : 'View History'}
      </button>
      <div className="card-seccion ultimas-compras">
        {purchases.length === 0 ? (
          <p>No purchases yet.</p>
        ) : showHistory ? (
          // Detailed history: each purchase entry
          purchases.map(compra => (
            <div key={compra._id} className="purchase-item">
              <img src={compra.juego.imagen} alt={compra.juego.nombre} />
              <div className="purchase-info">
                <span className="purchase-name">{compra.juego.nombre}</span>
                <span className="purchase-date">{new Date(compra.fecha).toLocaleDateString()}</span>
                <span className="purchase-price">{getPrecioPagado(compra).toFixed(2)} USD</span>
              </div>
            </div>
          ))
        ) : (
          // Summary view: grouped by game
          purchaseSummary.slice(-5).map(ps => (
            <div key={ps.juego._id} className="purchase-item">
              <img src={ps.juego.imagen} alt={ps.juego.nombre} />
              <div className="purchase-info">
                <span className="purchase-name">{ps.juego.nombre} x{ps.quantity}</span>
                <span className="purchase-price">{ps.total.toFixed(2)} USD</span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="logout-action">
        <button className="logout-btn" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
