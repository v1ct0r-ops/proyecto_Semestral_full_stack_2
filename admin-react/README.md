# admin-react

This is a React admin panel.
## Admin React Panel (Level-Up Gamer)

This app migrates the legacy `/admin/*.html` screens to React, keeping the same localStorage so both (HTML site and React admin) share session and data.

## Run locally

1) Start the HTML site at `http://localhost:5500` (for example with Live Server or any static server). Open any page under `/admin` once to register the window name for syncing.

2) Start React at `http://localhost:5173`:

```bash
cd admin-react
npm install
npm run dev
```

Open both in the browser:
- HTML: http://localhost:5500/admin/admin.html (or login.html to sign in)
- React: http://localhost:5173/

The apps will try to sync localStorage across origins using a simple `postMessage` bridge.

## Storage keys
Shared keys between HTML and React:
- `sesion`
- `usuarios`
- `productos`
- `pedidos`
- `carrito`
- `resenas`
- `solicitudes` (used by solicitudes pages)

React will not overwrite existing data; it only seeds `productos` from base data if missing.

## Routes (React)

- `/` → Dashboard
- `/productos` → Listado de productos
- `/productos/nuevo` → Crear producto (solo Admin)
- `/productos/editar/:codigo` → Editar producto (solo Admin)
- `/usuarios` → Listado de usuarios (solo Admin)
- `/usuarios/nuevo` → Crear usuario (solo Admin)
- `/pedidos` → Pedidos
- `/pedidos/:id` → Detalle de pedido
- `/solicitudes` → Solicitudes
- `/solicitudes/:id` → Detalle de solicitud

All routes are protected: only `admin` and `vendedor` can enter. Some pages enforce admin-only inside the component.

## Notes

- If you cannot or don't want to run both servers at once, the ProtectedRoute includes temporary buttons to sign in as Admin/Vendedor and to attempt a manual sync.
- The HTML app includes `/js/crossDomainStorageBridge.js` which listens/sends changes via `postMessage`.
- The React app sets its window name to `react-app`, and the HTML names itself as `html-app` to find each other.
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
