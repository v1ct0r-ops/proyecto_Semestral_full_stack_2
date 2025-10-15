import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import '../css/estilos.css'
import App from './App.jsx'
import { inicializarDatosBase } from './data/baseData.js'

console.log('🚀 main.jsx cargando...');

// Inicializar datos base
try {
  inicializarDatosBase();
  console.log('✅ Datos base inicializados');
} catch (error) {
  console.error('❌ Error inicializando datos:', error);
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
