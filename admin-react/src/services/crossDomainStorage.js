// =============== SINCRONIZACIÓN CROSS-DOMAIN ===============

const HTML_ORIGIN = 'http://localhost:5500' // Tu servidor HTML
const REACT_ORIGIN = window.location.origin // Origen actual del panel React

// Escuchar mensajes del HTML
let htmlIframe = null
let iframeReady = false
const msgQueue = []
let applyingExternal = false // evita eco infinito

function ensureIframe(){
  if (htmlIframe) return htmlIframe
  htmlIframe = document.createElement('iframe')
  htmlIframe.style.display = 'none'
  // Cargar una página mínima que solo tenga el bridge (sin alerts/redirects)
  htmlIframe.src = `${HTML_ORIGIN}/admin/storage-bridge.html`
  htmlIframe.onload = () => {
    iframeReady = true
    try { window.__htmlSyncReady = true; window.dispatchEvent(new Event('html-sync-ready')) } catch {}
    // vaciar cola
    while (msgQueue.length) {
      const m = msgQueue.shift()
      htmlIframe.contentWindow?.postMessage(m.data, m.targetOrigin)
    }
    // Pedir claves iniciales
    ;['sesion','usuarios','productos','pedidos','carrito','resenas'].forEach(k=>{
      try { requestFromHTML(k) } catch {}
    })
  }
  document.body.appendChild(htmlIframe)
  return htmlIframe
}

export function setupCrossDomainSync() {
  ensureIframe()
  window.addEventListener('message', (event) => {
    // Verificar origen por seguridad (aceptar solo localhost:5500)
    if (event.origin !== HTML_ORIGIN) return

    const { type, key, value } = event.data

    switch (type) {
      case 'SYNC_SET':
        // marcar que estamos aplicando un cambio externo para no reenviar eco
        applyingExternal = true
        try { localStorage.setItem(key, value) } finally { applyingExternal = false }
        console.log(`🔄 Sincronizado desde HTML: ${key}`)
        try { window.dispatchEvent(new CustomEvent('storage-sync', { detail: { key } })) } catch {}
        break
      case 'SYNC_RESPONSE':
        if (key) {
          if (value == null) {
            // Si HTML no tiene el valor, asegúrate de limpiar el local
            applyingExternal = true
            try { localStorage.removeItem(key) } finally { applyingExternal = false }
            console.log(`📥 ${key} no existe en HTML, eliminado localmente`)
            try { window.dispatchEvent(new CustomEvent('storage-sync', { detail: { key } })) } catch {}
          } else {
            applyingExternal = true
            try { localStorage.setItem(key, value) } finally { applyingExternal = false }
            console.log(`📥 Recibido ${key} desde HTML`)
            try { window.dispatchEvent(new CustomEvent('storage-sync', { detail: { key } })) } catch {}
          }
        }
        break
      
      case 'SYNC_REMOVE':
        applyingExternal = true
        try { localStorage.removeItem(key) } finally { applyingExternal = false }
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
    const data = { type, key, value }
    ensureIframe()
    if (iframeReady && htmlIframe?.contentWindow) {
      htmlIframe.contentWindow.postMessage(data, HTML_ORIGIN)
    } else {
      msgQueue.push({ data, targetOrigin: HTML_ORIGIN })
    }
  } catch (error) {
    console.log('No se pudo enviar al HTML:', error)
  }
}

// Sincronizar un cambio hacia el HTML
export function syncToHTML(key, value) {
  // value ya es string porque localStorage.setItem recibe strings
  sendToHTML('SYNC_SET', key, value)
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
  // si el cambio no proviene del HTML, propagarlo al HTML
  if (!applyingExternal) {
    syncToHTML(key, value)
  }
  try { window.dispatchEvent(new CustomEvent('storage-sync', { detail: { key } })) } catch {}
}

localStorage.removeItem = function(key) {
  originalRemoveItem.call(this, key)
  if (!applyingExternal) {
    sendToHTML('SYNC_REMOVE', key, null)
  }
  try { window.dispatchEvent(new CustomEvent('storage-sync', { detail: { key } })) } catch {}
}