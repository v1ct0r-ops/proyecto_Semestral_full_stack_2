// =============== STORAGE BRIDGE (SOLUCIÓN TEMPORAL) ===============

// Esta función intentará leer datos del HTML via iframe oculto
export async function syncFromHTMLStorage() {
  return new Promise((resolve) => {
    // Crear iframe oculto que cargue una página del HTML
    const iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    iframe.src = 'http://localhost:5500/login.html' // Cualquier página del HTML
    
    iframe.onload = () => {
      try {
        // Intentar acceder al localStorage del iframe
        const htmlLocalStorage = iframe.contentWindow.localStorage
        
        if (htmlLocalStorage) {
          // Copiar datos importantes
          const sesion = htmlLocalStorage.getItem('sesion')
          const usuarios = htmlLocalStorage.getItem('usuarios')
          const productos = htmlLocalStorage.getItem('productos')
          
          if (sesion) localStorage.setItem('sesion', sesion)
          if (usuarios) localStorage.setItem('usuarios', usuarios)
          if (productos) localStorage.setItem('productos', productos)
          
          console.log('✅ Datos sincronizados desde HTML')
          resolve(true)
        } else {
          console.log('❌ No se pudo acceder al localStorage del HTML')
          resolve(false)
        }
      } catch (error) {
        console.log('❌ Error de CORS:', error)
        resolve(false)
      } finally {
        document.body.removeChild(iframe)
      }
    }
    
    iframe.onerror = () => {
      console.log('❌ Error cargando iframe')
      document.body.removeChild(iframe)
      resolve(false)
    }
    
    document.body.appendChild(iframe)
  })
}

// Función para copiar datos manualmente (SOLUCIÓN INMEDIATA)
export function manualDataSync() {
  // Datos de prueba que deberían estar en el HTML
  const testData = {
    sesion: { correo: "admin@test.com", tipo: "admin" },
    usuarios: [
      {
        run: "12345678-9",
        nombres: "Admin",
        apellidos: "Principal", 
        correo: "admin@test.com",
        fechaNacimiento: "1990-01-01",
        tipoUsuario: "admin",
        region: "Región Metropolitana",
        comuna: "Santiago",
        direccion: "Dirección Admin 123",
        pass: "1234",
        codigoReferido: "ADMIN123",
        puntos: 0,
        nivel: "Bronce"
      },
      {
        run: "98765432-1",
        nombres: "Vendedor",
        apellidos: "Principal",
        correo: "vendedor@test.com", 
        fechaNacimiento: "1992-01-01",
        tipoUsuario: "vendedor",
        region: "Región Metropolitana",
        comuna: "Santiago", 
        direccion: "Dirección Vendedor 456",
        pass: "1234",
        codigoReferido: "VEND123",
        puntos: 0,
        nivel: "Bronce"
      }
    ]
  }
  
  // Solo sobrescribir si no existe
  if (!localStorage.getItem('usuarios') || JSON.parse(localStorage.getItem('usuarios')).length === 0) {
    localStorage.setItem('usuarios', JSON.stringify(testData.usuarios))
    console.log('📋 Usuarios de prueba agregados')
  }
  
  return testData
}