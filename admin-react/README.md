# Proyecto Semestral — Level-Up Gamer

Resumen
-------
Repositorio con dos partes principales:

- `admin/` — conjunto de páginas estáticas (HTML) del admin clásico (no React).
- `admin-react/` — SPA de administración en React + Vite (panel de administración, boletas, pedidos, productos, usuarios, etc.).
- `public/cliente/` (dentro de `admin-react/public/cliente/`) — versiones estáticas del sitio cliente (productos, misCompras.html, etc.) que comparten estilos y plantillas.

Objetivo
--------
Aplicación de e-commerce didáctica donde:
- Los clientes pueden navegar, añadir al carrito, pagar y ver sus compras ("Mis compras").
- El admin gestiona productos, pedidos, usuarios y boletas a través del panel React.

Estructura relevante
--------------------
- `admin-react/` — aplicación React (Vite)
  - `src/` — código fuente React
    - `components/` — paneles: `Boleta`, `Pedidos`, `Productos`, `Usuario`, `Dashboard`, etc.
    - `site/` — scripts usados por las páginas estáticas del cliente (ej. `app.js` contiene la lógica cliente: carrito, boletas, impresión, descuentos).
    - `utils/storage.js` — helpers para `localStorage` (obtener/guardar, usuarios, pedidos, boletas, etc.).
  - `public/cliente/` — páginas cliente estáticas (ej. `misCompras.html`) con la plantilla de boleta/modales.
  - `package.json` — scripts (dev, build, preview).

Principales comportamientos (boletas)
-----------------------------------
- Generación manual: desde el panel de Pedidos (botón "Generar boleta") se crea una boleta en `localStorage` (clave: `boletas`) y se navega a su detalle.
- Impresión: la vista de detalle de boleta abre una ventana con una plantilla HTML (idéntica a la del cliente) y llama a `window.print()` para generar PDF/print.
- Descuentos aplicados en boleta:
  - DUOC: 20% de descuento si el correo del cliente termina en `@duoc.cl`.
  - Puntos: 1 punto = $10 CLP. El monto por puntos que se puede usar está limitado al 20% del subtotal. Ej: si el cliente tiene 30 puntos => $300 CLP disponibles; se aplicará hasta el 20% del subtotal.
- El valor final de la boleta (total) se guarda en la boleta como `totalNumerico` (número) y `total` (string formateado). La vista y la impresión usan estos cálculos.

Notas de cambios/estado actual
-----------------------------
- Se consolidó el botón en Pedidos: ahora hay un único botón "Generar boleta" que crea/guarda y abre el detalle de la boleta (antes había dos botones con funciones distintas).
- La auto-generación de boletas al marcar pedidos como "despachado" ha sido desactivada en `src/components/Boleta/Boletas.jsx`. Las boletas ahora se crean únicamente cuando el admin las genera manualmente.
- La plantilla de impresión de boleta fue sincronizada con `public/cliente/misCompras.html` para tener paridad visual con el flujo cliente.

Claves de `localStorage` importantes
-----------------------------------
- `productos` — array de productos.
- `usuarios` — array de usuarios (incluye `puntosLevelUp`, `descuentoDuoc` implícito por correo).
- `carrito` — carrito temporal del cliente.
- `pedidos` — array de pedidos; cada pedido contiene `items`, `total` (sin descuentos por diseño original), `estado`.
- `boletas` — array de boletas generadas manualmente por admin (cada boleta contiene `numero`, `pedidoId`, `totalNumerico`, `total`, `fecha`).

Cómo ejecutar (desarrollo)
--------------------------
Requisitos: Node.js moderno (v16+ recomendado) y npm.

1) App admin React (dev server)

```powershell
cd admin-react
npm install
npm run dev
```

El dev server levanta la app React (por defecto Vite en http://localhost:5173 o puerto alternativo). La app usa rutas internas y en producción puede usar HashRouter si se hospeda como archivos estáticos.

2) Build producción

```powershell
cd admin-react
npm run build
# opcional: npm run preview
```

3) Cliente estático

Las páginas en `admin-react/public/cliente/` son páginas estáticas que se pueden servir con cualquier servidor HTTP (por ejemplo, `serve`, `http-server`, o copiar a `docs/` en GitHub Pages). Asegúrate de servir desde la raíz correcta porque las rutas a `/src/css/estilos.css` son relativas al servidor.

Requisitos y comportamientos a considerar
---------------------------------------
- Rutas y hosting estático: Si sirves la SPA admin como archivos estáticos sin un fallback server, usar HashRouter evita 404s en recargas directas. Hay partes del código que usan `href="#/admin/..."` para enlaces absolutamente estáticos.
- Compatibilidad del modal `<dialog>`: el cliente usa `<dialog>` para el modal de boleta (`dlgBoleta`), que no está soportado en todos los navegadores históricos. El código intenta `dlg.showModal()` y como fallback establece `open` si ese método falla.


Notas de mantenimiento
---------------------
- La lógica de descuentos está implementada en varios lugares (cliente `src/site/app.js`, admin `DetalleBoleta.jsx`, `DetallePedidoPanel.jsx` al crear boletas). Si vas a cambiar las reglas (por ejemplo, porcentaje DUOC o valor del punto), considera extraer esa lógica a una función utilitaria compartida para evitar inconsistencias.
- Hay un helper central en `src/utils/storage.js` para leer/escribir `localStorage` y centralizar el acceso a claves.


\---admin-react
    |   .gitignore
    |   eslint.config.js
    |   index.html
    |   karma.conf.cjs
    |   package-lock.json
    |   package.json
    |   README.md
    |   vite.config.js
    |   
    +---docs
    |       Documento de Cobertura de Testing - EP2.md
    |       
    +---public
    |   |   vite.svg
    |   |   
    |   +---cliente
    |   |       blog-detalle-1.html
    |   |       blog-detalle-2.html
    |   |       blogs.html
    |   |       contacto.html
    |   |       index.html
    |   |       login.html
    |   |       misCompras.html
    |   |       nosotros.html
    |   |       perfil.html
    |   |       producto.html
    |   |       productos.html
    |   |       README.md
    |   |       registro.html
    |   |       
    |   \---img
    |           8-verthing-k_pBB5wJtaU-unsplash.jpg
    |           ella-don-fK5Oomnc-Wk-unsplash (1).jpg
    |           ella-don-K4kfIEhj4GM-unsplash.jpg
    |           imgPerfil.png
    |           LOGO.png
    |           placeholder.jpg
    |           samsung-memory-XB4F9V5UleA-unsplash.jpg
    |           
    +---src
    |   |   App.css
    |   |   App.jsx
    |   |   index.css
    |   |   main.jsx
    |   |   
    |   +---assets
    |   |       react.svg
    |   |       
    |   +---components
    |   |   |   ProtectedRoute.jsx
    |   |   |   
    |   |   +---Boleta
    |   |   |       Boleta.jsx
    |   |   |       DetalleBoleta.jsx
    |   |   |       
    |   |   +---Dashboard
    |   |   |       AdminPanel.jsx
    |   |   |       
    |   |   +---Pedidos
    |   |   |       DetallePedidoPanel.jsx
    |   |   |       PedidosPanel.jsx
    |   |   |       
    |   |   +---Productos
    |   |   |       EditarProductoPanel.jsx
    |   |   |       NuevoProductoPanel.jsx
    |   |   |       ProductosPanel.jsx
    |   |   |       ProductosPocoStockPanel.jsx
    |   |   |       ReportesProductosPanel.jsx
    |   |   |       
    |   |   +---Reportes
    |   |   |       ReportesPanel.jsx
    |   |   |       
    |   |   +---Solicitud
    |   |   |       DetalleSolicitudPanel.jsx
    |   |   |       SolicitudesPanel.jsx
    |   |   |       
    |   |   \---Usuario
    |   |           EditarUsuarioPanel.jsx
    |   |           HistorialUsuarioPanel.jsx
    |   |           NuevoUsuarioPanel.jsx
    |   |           UsuariosPanel.jsx
    |   |           
    |   +---css
    |   |       blogs.css
    |   |       contactos.css
    |   |       estilos.css
    |   |       nosotros.css
    |   |       
    |   +---site
    |   |       app.js
    |   |       contacto.js
    |   |       datos.js
    |   |       solicitud.js
    |   |       
    |   \---utils
    |           storage.js
    |           
    \---test
        |   contacto.spec.js
        |   DetallePedidoPanel.spec.js
        |   DetallePedidoPanel.spec.jsx
        |   EditarProductoPanel.spec.js
        |   EditarProductoPanel.spec.jsx
        |   NuevoProductoPanel.spec.js
        |   NuevoProductoPanel.spec.jsx
        |   panel-solicitudes.spec.js
        |   panel-solicitudes.spec.jsx
        |   PedidosPanel.spec.js
        |   PedidosPanel.spec.jsx
        |   ProductosPanelSmoke.spec.js
        |   ProductosPanelSmoke.spec.jsx
        |   ProductosPocoStockPanel.spec.js
        |   ProductosPocoStockPanel.spec.jsx
        |   ReportesPanel.spec.js
        |   ReportesPanel.spec.jsx
        |   sanity.spec.js
        |   
        \---stubs
                storage.stub.js
