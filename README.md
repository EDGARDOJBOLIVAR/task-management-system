# Task Management System

Sistema de gestión de tareas con frontend en React y backend en NestJS.

## Requisitos Previos

- Node.js (v16 o superior)
- Docker y Docker Compose (opcional)
- npm o yarn

## Configuración del Proyecto

### 1. Base de Datos (PostgreSQL)

En caso de no tener una base de datos disponible.
Para desarrollo local, inicia la base de datos usando Docker Compose:

```bash
docker-compose up -d
```

La base de datos estará disponible en:
- Host: localhost
- Puerto: 5454
- Usuario: admin
- Contraseña: admin123
- Base de datos: taskmanagement

### 2. Backend (NestJS)

#### Configuración del .env

Crea un archivo `.env` en la carpeta `backend` y llénelo con los datos correspondientes a su DB:

```env
DB_HOST=localhost
DB_PORT=5454
DB_NAME=taskmanagement
DB_USER=admin
DB_PASSWORD=admin123
```

#### Instalación y Ejecución

```bash
# Entrar al directorio backend
cd backend

# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm run start:dev
```

El backend estará disponible en `http://localhost:3000`

### 3. Frontend (React)

```bash
# Entrar al directorio frontend
cd frontend

# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

## API Endpoints

### Usuarios

#### Crear Usuario
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com"
  }'
```

#### Listar Usuarios
```bash
curl http://localhost:3000/users?page=1&limit=10
```

### Tareas

#### Crear Tarea
```bash
curl -X POST http://localhost:3000/users/1/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Nueva Tarea",
    "description": "Descripción de la tarea",
    "status": "PENDING"
  }'
```

#### Listar Tareas de Usuario
```bash
curl http://localhost:3000/users/1/tasks?page=1&limit=5
```

## Colección Postman

También puedes importar nuestra colección de Postman para probar la API:

[Descargar Colección Postman](./postman/task-management-api.postman_collection.json)

## Estructura del Proyecto

```
task-management-system/
├── backend/           # API NestJS
├── frontend/         # Aplicación React
├── docker-compose.yml
└── README.md
```