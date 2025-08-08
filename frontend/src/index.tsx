import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './contexts/AuthContext';
import { Provider } from 'react-redux';           // ✅ importa Redux Provider
import { store } from './app/store';              // ✅ importa tu store

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <Provider store={store}>                     {/* ✅ Redux aquí */}
        <App />
      </Provider>
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
