import { useEffect } from 'react'
import Dashboard from './components/Dashboard/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import { setupCrossDomainSync } from './services/crossDomainStorage'
import './App.css'
// import './admin-styles.css' // Descomenta cuando copies el CSS

function App() {
  useEffect(() => {
    // Configurar sincronización cross-domain
    setupCrossDomainSync()
    console.log('🔄 Sincronización cross-domain activada')
  }, [])

  return (
    <div className="App" style={{ fontFamily: 'Roboto, sans-serif' }}>
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    </div>
  )
}

export default App