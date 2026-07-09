# Escuela de Conducción API

API REST simple desarrollada en Node.js y Express para gestionar alumnos, instructores y evaluaciones prácticas de una escuela de conducción.

## ¿Qué ofrece esta API?

- CRUD de alumnos
- CRUD de instructores
- Registro de evaluaciones prácticas
- Cálculo automático de aprobación o reforzamiento
- Sistema de Autenticación (Login)
- Modo demo para probar la API sin PostgreSQL
- Consultas útiles para mostrar en presentación, como búsquedas por nombre, rut, email y resultado

## Requisitos previos

- Node.js 18 o superior
- npm
- Opcional: Docker Desktop si se quiere usar PostgreSQL real

## Instalación rápida

Ejecuta los siguientes comandos en tu terminal para instalar las dependencias generales, los módulos de seguridad para el Login y levantar el entorno:

```bash
npm install
npm install bcryptjs jsonwebtoken
npm run setup
npm run dev
```

Si no hay PostgreSQL disponible, el servidor arrancará en modo demo y mostrará un mensaje indicando que está usando almacenamiento local.

## Variables de entorno

Puedes usar el archivo [.env.example](.env.example) como referencia. Para una base de datos real, crea un archivo .env con valores como:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=metodologia_db
JWT_SECRET=tu_clave_secreta_aqui
```

## Endpoints principales

- GET /
- GET /consultas
- GET /alumnos
- POST /alumnos
- PATCH /alumnos/:id
- DELETE /alumnos/:id
- GET /instructores
- POST /instructores
- PATCH /instructores/:id
- DELETE /instructores/:id
- GET /evaluaciones-practicas
- POST /evaluaciones-practicas
- GET /alumnos/:id/evaluaciones

## Ejemplos útiles

### Crear un alumno

```http
POST http://localhost:3000/alumnos
Content-Type: application/json

{
  "nombre": "Carlos",
  "email": "carlos@example.com"
}
```

### Registrar una evaluación

```http
POST http://localhost:3000/evaluaciones-practicas
Content-Type: application/json

{
  "alumnoId": 1,
  "instructorId": 1,
  "estacionamiento": "Aprobado",
  "controlVehiculo": "Aprobado",
  "respetoSenales": "Aprobado",
  "observaciones": "Buen desempeño"
}
```

### Consultas para mostrar en presentación

```http
GET http://localhost:3000/consultas
GET http://localhost:3000/alumnos?nombre=Carlos
GET http://localhost:3000/instructores?rut=11111111-1
GET http://localhost:3000/instructores?email=daniel@example.com
GET http://localhost:3000/evaluaciones-practicas?resultado=aprobado
```

## Estructura del proyecto

- [src/index.js](src/index.js): levanta el servidor y conecta la API con los módulos de rutas.
- [src/routes/alumnos.js](src/routes/alumnos.js): gestiona las operaciones de alumnos.
- [src/routes/instructores.js](src/routes/instructores.js): gestiona las operaciones de instructores.
- [src/routes/evaluaciones.js](src/routes/evaluaciones.js): gestiona las operaciones de evaluaciones.
- [src/demoStore.js](src/demoStore.js): guarda los datos en modo demo cuando no hay PostgreSQL disponible.
- [src/entities/Alumno.js](src/entities/Alumno.js): define la estructura de la entidad alumno.
- [src/entities/Instructor.js](src/entities/Instructor.js): define la estructura de la entidad instructor.
- [src/entities/EvaluacionPractica.js](src/entities/EvaluacionPractica.js): define la estructura de la entidad evaluación.
- [src/utils/evaluacion.js](src/utils/evaluacion.js): contiene la lógica para calcular el resultado de una evaluación.
- [test/alumnos.test.js](test/alumnos.test.js): prueba la ruta para ver un alumno por ID.
- [test/evaluacion.test.js](test/evaluacion.test.js): prueba la lógica de evaluación y sus mensajes.
- [test/consultas.test.js](test/consultas.test.js): valida la ruta de resumen y los filtros de búsqueda.

## Pruebas automáticas

Para ejecutar las pruebas:

```bash
npm test
```

### Qué hacen los tests

- [test/alumnos.test.js](test/alumnos.test.js): comprueba que un alumno exista y pueda consultarse por ID.
- [test/evaluacion.test.js](test/evaluacion.test.js): valida si una evaluación se marca como aprobada o con reforzamiento.
- [test/consultas.test.js](test/consultas.test.js): verifica que la ruta de resumen y los filtros funcionen correctamente.

## Material de apoyo para presentación

En la carpeta [.presentacion](.presentacion) se incluyen resúmenes listos para repartir entre los integrantes del equipo.

## Herramientas recomendadas

- REST Client
- Postman
- ESLint
```
