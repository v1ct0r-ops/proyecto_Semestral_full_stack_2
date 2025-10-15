// =============== SINCRONIZACIÓN CROSS-DOMAIN ===============

const HTML_ORIGIN = 'http://localhost:5500' // Tu servidor HTML
const REACT_ORIGIN = 'http://localhost:5173' // Tu servidor React

// Escuchar mensajes del HTML
export function setupCrossDomainSync() {
  window.addEventListener('message', (event) => {
    // Verificar origen por seguridad
    if (event.origin !== HTML_ORIGIN) return

    const { type, key, value } = event.data

    switch (type) {
      case 'SYNC_SET':
        localStorage.setItem(key, value)
        console.log(`🔄 Sincronizado desde HTML: ${key}`)
        break
      
      case 'SYNC_REMOVE':
        localStorage.removeItem(key)
        console.log(`🗑️ Eliminado desde HTML: ${key}`)
        break
      
      case 'SYNC_REQUEST':
        // HTML solicita datos del React
        sendToHTML('SYNC_RESPONSE', key, localStorage.getItem(key))
        break
    }
  })
}

// Enviar datos al HTML
export function sendToHTML(type, key, value) {
  try {
    // Buscar ventana del HTML abierta
    const htmlWindow = window.open('', 'html-app')
    if (htmlWindow && !htmlWindow.closed) {
      htmlWindow.postMessage({ type, key, value }, HTML_ORIGIN)
    }
  } catch (error) {
    console.log('No se pudo enviar al HTML:', error)
  }
}

// Sincronizar un cambio hacia el HTML
export function syncToHTML(key, value) {
  sendToHTML('SYNC_SET', key, JSON.stringify(value))
}

// Solicitar datos del HTML
export function requestFromHTML(key) {
  sendToHTML('SYNC_REQUEST', key, null)
}

// Override de localStorage para auto-sincronizar
const originalSetItem = localStorage.setItem
const originalRemoveItem = localStorage.removeItem

localStorage.setItem = function(key, value) {
  originalSetItem.call(this, key, value)
  syncToHTML(key, value)
}

localStorage.removeItem = function(key) {
  originalRemoveItem.call(this, key)
  sendToHTML('SYNC_REMOVE', key, null)
}