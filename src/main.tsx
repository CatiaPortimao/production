import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'; // Importa PersistGate
import { store, persistor } from '../src/slice/store'; // Importa a store e o persistor configurado

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    {/* Provedor do Redux */}
    <Provider store={store}>
      {/* PersistGate para garantir que o estado seja carregado antes do render */}
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);


