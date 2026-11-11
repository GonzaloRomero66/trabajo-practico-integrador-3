# Trabajo Práctico Integrador N° III

API REST para gestionar usuarios, eventos y categorías con Node.js, Express, MongoDB y Mongoose.

## Tecnologías

- Express 5 y ESModules
- MongoDB con Mongoose
- JWT guardado en cookie `httpOnly`
- bcrypt para hashear contraseñas
- express-validator para las validaciones

## Instalación

```bash
npm install
cp .env.example .env
npm run dev
```

## Variables de entorno

| Variable | Descripción |
| --- | --- |
| `PORT` | Puerto del servidor |
| `MONGODB_URI` | URI de conexión a MongoDB |
| `JWT_SECRET` | Clave secreta para firmar los tokens |
| `JWT_EXPIRES_IN` | Duración del token (por ejemplo `1d`) |
| `NODE_ENV` | `production` activa la cookie `secure` |

## Estructura

```
src/
  config/       conexión a MongoDB
  models/       esquemas de Mongoose
  routes/       definición de rutas
  controllers/  controladores
  middlewares/  autenticación, autorización, validaciones y errores
  helpers/      utilidades (JWT, bcrypt)
```

## Relaciones

- User ↔ Profile: 1:1 embebida
- Event ↔ Location: 1:1 embebida
- User → Event: 1:N referenciada (`organizer`), con virtual populate `events` en User
- Event ↔ Category: N:M con array de referencias (`categories`), con virtual populate `events` en Category

## Eliminación

- **Lógica:** los usuarios se eliminan con `deletedAt`. Al eliminar un usuario se borran todos los eventos que organizó.
- **En cascada:** al eliminar una categoría se quita de todos los eventos que la tenían.
- **Física:** los eventos se eliminan definitivamente.

## Endpoints

### Auth

| Método | Ruta | Acceso |
| --- | --- | --- |
| POST | `/api/auth/register` | público |
| POST | `/api/auth/login` | público |
| GET | `/api/auth/profile` | autenticado |
| PUT | `/api/auth/profile` | autenticado |
| POST | `/api/auth/logout` | autenticado |

El registro recibe `username`, `email`, `password` y `profile` (`firstName`, `lastName`, `birthDate` y `phone` opcionales).
`PUT /api/auth/profile` recibe los campos del perfil directamente en el body.

### Users

| Método | Ruta | Acceso |
| --- | --- | --- |
| GET | `/api/users` | admin |
| GET | `/api/users/:id` | admin |
| PUT | `/api/users/:id` | admin |
| DELETE | `/api/users/:id` | admin |

### Events

| Método | Ruta | Acceso |
| --- | --- | --- |
| POST | `/api/events` | autenticado |
| GET | `/api/events` | autenticado |
| GET | `/api/events/my` | autenticado |
| GET | `/api/events/:id` | autenticado |
| PUT | `/api/events/:id` | organizador o admin |
| DELETE | `/api/events/:id` | organizador o admin |

### Categories

| Método | Ruta | Acceso |
| --- | --- | --- |
| POST | `/api/categories` | admin |
| GET | `/api/categories` | autenticado |
| GET | `/api/categories/:id` | autenticado |
| PUT | `/api/categories/:id` | admin |
| DELETE | `/api/categories/:id` | admin |

## Crear un admin

Todos los usuarios se registran con rol `user`. Para tener un admin, registrar un usuario y cambiar su campo `role` a `admin` directamente en la base de datos.
