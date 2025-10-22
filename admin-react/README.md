
# Proyecto Semestral — Level-Up Gamer

## Descripción
Panel de administración para la tienda web Level-Up Gamer. Permite gestionar productos, usuarios, pedidos, boletas y solicitudes de contacto desde una SPA desarrollada en React y Vite. El panel está orientado a administradores y vendedores, facilitando la gestión interna de la tienda, la visualización de reportes y la administración de boletas generadas automáticamente al despachar pedidos.

## Este repositorio contiene:
- `admin-react/` — SPA de administración en React + Vite (panel de administración, boletas, pedidos, productos, usuarios, reportes, etc.)
- `public/cliente/` — versiones estáticas del sitio cliente (productos, misCompras.html, etc.) que comparten estilos y plantillas

El objetivo es centralizar la gestión de la tienda y mantener la coherencia visual y funcional entre el panel de administración y la experiencia del cliente.


## Objetivo
--------
Aplicación de e-commerce didáctica donde:
- Los clientes pueden navegar, añadir al carrito, pagar y ver sus compras ("Mis compras").
- El admin gestiona productos, pedidos, usuarios y boletas a través del panel React.

## Estructura relevante
--------------------
- `admin-react/` — aplicación React (Vite)
  - `src/` — código fuente React
    - `components/` — paneles: `Boleta`, `Pedidos`, `Productos`, `Usuario`, `Dashboard`, etc.
    - `site/` — scripts usados por las páginas estáticas del cliente (ej. `app.js` contiene la lógica cliente: carrito, boletas, impresión, descuentos).
    - `utils/storage.js` — helpers para `localStorage` (obtener/guardar, usuarios, pedidos, boletas, etc.).
  - `public/cliente/` — páginas cliente estáticas (ej. `misCompras.html`) con la plantilla de boleta/modales.
  - `package.json` — scripts (dev, build, preview).

## Principales comportamientos (boletas)
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


## Tecnologías Utilizadas
---------------------
- React 19 (SPA de administración)
- Vite (dev server y build)
- JavaScript (ES6+)
- HTML5 y CSS3 (componentes y páginas estáticas)
- LocalStorage (persistencia en navegador)
- @testing-library/react y @testing-library/jest-dom (tests de componentes)
- Jasmine y Karma (suite de testing, integración y cobertura)
- Node.js y npm (gestión de dependencias y scripts)

## Requisitos previos
------------------
- Node.js v16 o superior
- npm (incluido con Node.js)
- Navegador web moderno (Chrome, Firefox, Edge, etc.)
- (Opcional) Visual Studio Code para edición
- (Opcional) Extensión Live Server para desarrollo rápido de las páginas estáticas

## Para desarrollo y testing:
- Ejecutar `npm install` en `admin-react/` para instalar dependencias
- Usar `npm run dev` para entorno de desarrollo (Vite)
- Usar `npm run test:karma` para correr los tests unitarios y de integración




