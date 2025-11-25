# Level-Up Gamer Backend

Este es el backend para el sistema de e-commerce Level-Up Gamer. Está hecho con Spring Boot y usa MySQL como base de datos. Incluye autenticación con JWT, control de usuarios, productos, pedidos y boletas.

## Tecnologías principales
- Spring Boot 3.2.0
- Spring Security y JWT
- MySQL 8.0
- JPA/Hibernate
- Swagger/OpenAPI
- Maven
- Java 17 o superior

## Estructura del proyecto

```
backend-spring/
├── src/main/java/cl/duoc/levelup/
│   ├── LevelUpGamerApplication.java
│   ├── config/
│   ├── controller/
│   ├── entity/
│   ├── repository/
│   ├── security/
│   └── service/
├── src/main/resources/
│   ├── application.yml
│   ├── application-dev.yml
│   ├── application-prod.yml
│   └── application.properties
├── pom.xml
├── database-setup.sql
└── README.md
```

## Configuración de la base de datos

1. Crea la base de datos y el usuario en MySQL:

```sql
CREATE DATABASE levelup_gamer_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'levelup_user'@'localhost' IDENTIFIED BY 'levelup_password';
GRANT ALL PRIVILEGES ON levelup_gamer_db.* TO 'levelup_user'@'localhost';
FLUSH PRIVILEGES;
```

2. Configura el archivo `application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/levelup_gamer_db
    username: levelup_user
    password: levelup_password
  jpa:
    hibernate:
      ddl-auto: update
```

## Cómo ejecutar el backend

Requisitos:
- Java 17 o superior
- Maven
- MySQL 8.0 en el puerto 3306

Para iniciar:

**Windows:**
```
./start-backend.bat
```

**Linux/Mac:**
```
chmod +x start-backend.sh
./start-backend.sh
```

**Manual:**
```
mvn clean compile
mvn spring-boot:run
# O bien
mvn package
java -jar target/levelup-gamer-backend-1.0.0.jar
```

Accede a la API en http://localhost:8080
Swagger UI: http://localhost:8080/swagger-ui.html
Health Check: http://localhost:8080/actuator/health

## Autenticación y roles

El sistema usa JWT para autenticar usuarios. Los roles disponibles son:
- ADMIN: acceso total
- VENDEDOR: gestión de productos y stock
- CLIENTE: compras y perfil

Usuarios de ejemplo:

| RUN         | Correo                        | Password     | Rol      | Puntos |
|-------------|-------------------------------|--------------|----------|--------|
| 12345678-9  | admin@levelup.cl              | admin123     | ADMIN    | 0      |
| 98765432-1  | vendedor@levelup.cl           | vendedor123  | VENDEDOR | 0      |
| 11111111-1  | maria.estudiante@duocuc.cl    | duoc123      | CLIENTE  | 150    |
| 22222222-2  | pedro.cliente@gmail.com       | cliente123   | CLIENTE  | 50     |

## Endpoints principales

### Autenticación
- POST /api/v1/auth/login
- POST /api/v1/auth/register
- POST /api/v1/auth/logout

### Usuarios
- GET /api/v1/usuarios/me
- PUT /api/v1/usuarios/me
- POST /api/v1/usuarios/me/cambiar-password
- GET /api/v1/usuarios/puntos
- GET /api/v1/usuarios (admin)
- GET /api/v1/usuarios/activos (admin)
- GET /api/v1/usuarios/{run} (admin)
- PUT /api/v1/usuarios/{run} (admin)
- POST /api/v1/usuarios/{run}/puntos (admin)

### Productos
- GET /api/v1/productos
- GET /api/v1/productos/activos
- GET /api/v1/productos/{codigo}
- GET /api/v1/productos/categoria/{categoria}
- GET /api/v1/productos/buscar?nombre=X
- GET /api/v1/productos/categorias
- GET /api/v1/productos/stock-critico
- POST /api/v1/productos (admin/vendedor)
- PUT /api/v1/productos/{codigo} (admin/vendedor)
- DELETE /api/v1/productos/{codigo} (admin/vendedor)
- PUT /api/v1/productos/{codigo}/stock (admin/vendedor)

## Lógica de negocio

- Sistema de puntos: 1 punto equivale a $10 de descuento. Los puntos se acumulan con cada compra y se pueden usar en el checkout.
- Descuento DUOC: 20% de descuento automático para correos que terminan en `@duocuc.cl`.
- Control de stock: verificación automática, stock crítico configurable, reducción de stock al comprar y restauración si se cancela el pedido.
- Seguridad: autenticación JWT, CORS para React, validación de datos y contraseñas encriptadas.

## Configuración para desarrollo

Variables útiles:

```yaml
spring.security.jwt.secret-key: mySecretKeyForJWTTokensLevelUpGamer2024
spring.security.jwt.expiration: 86400000
spring.security.jwt.refresh-expiration: 604800000
app.cors.allowed-origins: http://localhost:5173,http://localhost:3000
```

Perfiles:
- dev: desarrollo local
- prod: producción

## Datos de prueba

El sistema inicializa 10 productos de ejemplo en distintas categorías y usuarios de prueba.

## Testing rápido

Ejemplos:

```
curl http://localhost:8080/actuator/health
curl -X POST http://localhost:8080/api/v1/auth/login -H "Content-Type: application/json" -d '{"correo":"admin@levelup.cl","password":"admin123"}'
curl http://localhost:8080/api/v1/productos/activos
```

Swagger UI te permite probar todos los endpoints desde el navegador.

## Integración con el frontend

El backend acepta peticiones desde React (`http://localhost:5173` y `http://localhost:3000`).

Ejemplo de servicio en React:

```js
const API_BASE = 'http://localhost:8080/api/v1';

export const authService = {
  login: (credentials) => fetch(`${API_BASE}/auth/login`, {...}),
  register: (userData) => fetch(`${API_BASE}/auth/register`, {...})
};

export const productService = {
  getAll: () => fetch(`${API_BASE}/productos/activos`),
  getById: (codigo) => fetch(`${API_BASE}/productos/${codigo}`)
};
```

## Próximos pasos

- Completar controllers de pedidos, boletas y reportes
- Agregar WebSockets para notificaciones
- Añadir tests unitarios y de integración
- Configurar Docker
- Automatizar despliegue (CI/CD)

## Notas importantes

- Cambia las contraseñas por defecto en producción
- Usa HTTPS para los tokens JWT
- Haz backups regulares de la base de datos
- Revisa los logs de seguridad
- Mantén las dependencias actualizadas

## Repositorio y soporte
- Repositorio: https://github.com/v1ct0r-ops/proyecto_Semestral_full_stack_2.git
- Issues: https://github.com/v1ct0r-ops/proyecto_Semestral_full_stack_2/issues

---

Desarrollado para el Proyecto Semestral Full-Stack Level-Up Gamer
Spring Boot 3 + JPA + Security JWT + MySQL + Swagger