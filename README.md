# Level-Up Gamer Store - Proyecto Semestral Full Stack 2

## Descripción
Level-Up Gamer Store es una plataforma web para la venta de productos gamers, con funcionalidades para usuarios y administradores. Permite registro, autenticación, gestión de productos, blogs, carrito de compras, contacto y panel de administración.

## Estructura del Proyecto

```
proyecto_Semestral_full_stack_2/
│   index.html                # Página principal
│   blogs.html                # Listado de blogs/novedades
│   blog-detalle-1.html       # Detalle de blog 1
│   blog-detalle-2.html       # Detalle de blog 2
│   contacto.html             # Formulario de contacto
│   login.html                # Login de usuario
│   registro.html             # Registro de usuario
│   nosotros.html             # Información de la empresa
│   README.md                 # Documentación del proyecto
│
├── admin/                    # Sección de administración
│     HomeAdminstrador-1.html
│     ProductoAdministrador-2.html
│
├── css/                      # Hojas de estilo
│     estilos.css
│     blogs.css
│     contactos.css
│     nosotros.css
│     admin.css/
│
├── img/                      # Imágenes y recursos gráficos
│     LOGO.png
│     ...
│
├── js/                       # Scripts JavaScript
│     app.js
│     contacto.js
│     datos.js
│     jsAdmin/
```

## Principales Funcionalidades

- Registro y autenticación de usuarios
- Visualización y filtrado de catálogo de productos
- Carrito de compras persistente (localStorage)
- Gestión de productos (CRUD, solo administrador)
- Publicación y visualización de blogs/novedades
- Formulario de contacto validado y persistente (localStorage)
- Panel de administración exclusivo
- Edición de perfil de usuario (pendiente)
- Recuperación de contraseña (pendiente)


## Detalles Técnicos

### Tecnologías Utilizadas
- HTML5, CSS3 (estructura modular, responsive, fuentes Google Fonts)
- JavaScript (validación de formularios, manejo de eventos, localStorage, manipulación DOM)
- Estructura de carpetas para separación de vistas, estilos, scripts y recursos

### Organización de Archivos
- **/admin/**: Vistas y scripts para administración de productos y blogs
- **/css/**: Hojas de estilo separadas por sección
- **/img/**: Recursos gráficos y logotipos
- **/js/**: Scripts generales y específicos (contacto, datos, administración)

### Principales Scripts
- `app.js`: Lógica general de la aplicación (navegación, carrito, autenticación)
- `contacto.js`: Validación y almacenamiento de mensajes del formulario de contacto
- `datos.js`: Manejo de datos de productos y blogs
- `/js/jsAdmin/`: Scripts para funcionalidades administrativas

### Persistencia Local
- Uso de localStorage para carrito de compras y mensajes de contacto
- Los datos persisten entre sesiones del usuario

### Estilos
- Uso de CSS modular para mantener el código organizado y facilitar el mantenimiento
- Responsive design para adaptarse a distintos dispositivos

### Ejecución del Proyecto
1. Clona el repositorio:
	```
	git clone <url-del-repositorio>
	```
2. Abre la carpeta en Visual Studio Code.
3. Abre `index.html` con Live Server o tu navegador preferido.

### Notas de Desarrollo
- El proyecto está preparado para ser extendido fácilmente (nuevas vistas, scripts o estilos)
- Se recomienda mantener la estructura modular para futuras mejoras

---
Desarrollado por el equipo Level-Up Gamer — 2025.

## Instalación y Ejecución

1. Clona el repositorio:
	```
	git clone <url-del-repositorio>
	```
2. Abre la carpeta en Visual Studio Code.
3. Abre `index.html` con Live Server o tu navegador preferido.

## Créditos

Desarrollado por el equipo Level-Up Gamer — 2025.