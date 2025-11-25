# Especificación de Requisitos de Software (ERS) — LevelUpGamer

## 1. Propósito
Este documento define la Especificación de Requisitos de Software (ERS) para el sistema LevelUpGamer, siguiendo el estándar IEEE 830. Está dirigido a desarrolladores, docentes evaluadores, usuarios administrativos y clientes interesados. El objetivo es establecer el marco funcional y no funcional previo al desarrollo del frontend (React) y backend (Spring Boot).

## 1.2 Ámbito del Sistema
LevelUpGamer es un sistema web que permite:
- Gestión de productos
- Compras simuladas
- Carrito de compras
- Boletas
- Usuarios y roles
- Solicitudes
- Panel administrativo en React

El sistema no procesa pagos reales ni envía correos automáticos. La persistencia es en MySQL/PostgreSQL (backend) y localStorage (frontend).

## 1.3 Definiciones, Acrónimos y Abreviaturas
- ERS: Especificación de Requerimientos
- UI: Interfaz de Usuario
- CRUD: Crear, Leer, Actualizar, Eliminar
- JWT: Token Web JSON
- API: Interfaz de Programación de Aplicaciones
- SPA: Single Page Application
- Swagger: Documentación visual de API

## 1.4 Referencias
- IEEE 830 (Requerimientos de Software)
- Documentación API LevelUpGamer
- Repositorio Git: https://github.com/v1ct0r-ops/proyecto_Semestral_full_stack_2.git
- Tablas de requisitos y casos de uso

## 1.5 Visión General del Documento
Este informe integra:
- Requerimientos funcionales y no funcionales
- Desarrollo en React (frontend)
- Backend + API + JWT (Spring Boot)

---

## 2. Descripción General del Sistema
### 2.1 Perspectiva del Producto
El sistema está compuesto por dos módulos:
- **Cliente**: Páginas estáticas y SPA React para usuarios finales.
- **Administrativo**: Panel SPA en React con rutas protegidas y gestión avanzada.

Integraciones:
- Interfaz Cliente–Admin
- Integración con API REST
- Impresión de boletas
- Validación de sesiones y roles

### 2.2 Funciones del Producto
**Cliente:**
- Registro e inicio de sesión
- Carrito y compras
- Boletas
- Reseñas
- Solicitudes

**Administrador / Vendedor:**
- CRUD de productos
- CRUD de usuarios
- Gestión de pedidos
- Gestión de boletas
- Gestión de solicitudes
- Reportes

### 2.3 Características de Usuarios
- Cliente: habilidades básicas de navegación
- Vendedor: experiencia en paneles administrativos
- Administrador: conocimientos generales de gestión de sistemas

### 2.4 Restricciones
- Persistencia en MySQL/PostgreSQL (backend) y localStorage (frontend)
- Sin pagos reales
- SPA React requiere navegador moderno
- JWT obligatorio para llamadas a la API

### 2.5 Suposiciones y Dependencias
- Usuario tiene acceso a navegador moderno
- Conexión estable
- No hay integraciones externas obligatorias

---

## 3. Requisitos Específicos
### 3.1 Requisitos Funcionales
| ID  | Requisito |
|-----|-----------|
| RF1 | El sistema permite registrar usuarios. |
| RF2 | El sistema muestra productos por categoría. |
| RF3 | Permite agregar productos al carrito. |
| RF4 | Genera boletas. |
| RF5 | Permite CRUD completo de productos. |
| RF6 | Permite login con JWT. |
| RF7 | Permite gestión de usuarios y roles. |
| RF8 | Permite realizar pedidos y ver historial. |
| RF9 | Permite enviar solicitudes y ver reportes. |

### 3.2 Requisitos No Funcionales
| ID   | Tipo         | Requisito                                 |
|------|--------------|-------------------------------------------|
| RNF1 | Rendimiento  | Carga de páginas < 2 segundos             |
| RNF2 | Seguridad    | Validación básica + JWT                   |
| RNF3 | Usabilidad   | Interfaz responsiva y accesible           |
| RNF4 | Portabilidad | Uso en Chrome/Firefox/Edge                |
| RNF5 | Mantenibilidad| Código modular en React y Spring Boot     |

### 3.3 Casos de Uso (Resumen)
- CU01 Registrar usuario
- CU02 Iniciar sesión
- CU03 Comprar producto
- CU04 Generar boleta
- CU05 Enviar solicitud
- CU06 Administrar productos
- CU07 Administrar usuarios
- CU08 Revisar pedidos

---

## 4. Evaluación Parcial 2 (EP2) — FRONTEND REACT + BOOTSTRAP + TESTING
### 4.1 Arquitectura React
Estructura SPA:
- src/components/
- src/pages/
- src/hooks/
- src/context/
- src/services/
- src/router/

Incluye:
- useState, useEffect
- ProtectedRoute
- React Router DOM
- Servicios de API
- Componentización

### 4.2 Uso de Bootstrap (Responsivo)
- Grid System
- Cards
- Navbars
- Modals
- Formulario responsivo
- Contenedores fluidos

### 4.3 Testing (Jasmine + Karma)
Ejemplo:
```js
describe('LoginComponent', () => {
  it('debe validar correo correctamente', () => {
    const valido = validarCorreo('test@duoc.cl');
    expect(valido).toBeTrue();
  });
});
```
- Documento de cobertura
- Porcentaje de archivos probados
- Lista de componentes testeados
- Resultado de ejecución

---

## 5. Evaluación Parcial 3 (EP3) — Backend + API + Integración
### 5.1 Arquitectura Backend
- Spring Boot
- Controller–Service–Repository
- DTO
- Autenticación JWT
- application.yml / application-dev.yml
- Swagger UI

### 5.2 Endpoints documentados
Incluye endpoints de:
- Usuarios
- Productos
- Pedidos
- Boletas
- Autenticación
- Filtros por categoría, stock, dominio de correo, puntos, etc.

### 5.3 Manejo de Errores
- 400, 401, 403, 404, 500

### 5.4 Integración Frontend–Backend
El frontend usa `apiService.js` para:
- Peticiones
- Token JWT
- Manejo de errores
- Headers

**Proceso:**
1. Usuario inicia sesión
2. Backend retorna JWT
3. React guarda JWT
4. Cada petición incluye el token en Authorization
5. ProtectedRoute controla vistas

---

*Este documento está basado en la implementación real del proyecto LevelUpGamer y puede usarse como ERS, informe técnico o anexo para la evaluación.*
