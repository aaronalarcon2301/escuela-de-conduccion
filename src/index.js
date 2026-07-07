require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { AppDataSource } = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

// Importación de rutas
const alumnoRoutes = require('./routes/alumnoRoutes');
const instructorRoutes = require('./routes/instructorRoutes');
const reservaRoutes = require('./routes/reservaRoutes');
const evaluacionRoutes = require('./routes/evaluacionRoutes');

const port = process.env.PORT || 3000;

app.use('/alumnos', alumnoRoutes);
app.use('/reservas', reservaRoutes);
app.use('/instructores', instructorRoutes);
app.use('/evaluaciones', evaluacionRoutes);

// Inicialización del servidor y BD
async function startServer() {
  try {
    await AppDataSource.initialize();
    console.log('Base de datos conectada con éxito');
    
    app.listen(port, () => {
      console.log(`Servidor backend corriendo en http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    process.exit(1); 
  }
}

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };