require('dotenv').config();
const express = require('express');
const { AppDataSource } = require('./config/db');

const alumnoRoutes = require('./routes/alumnoRoutes');
const reservaRoutes = require('./routes/reservaRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/alumnos', alumnoRoutes);
app.use('/reservas', reservaRoutes);

async function startServer() {
  try {
    await AppDataSource.initialize();
    console.log('Base de datos conectada con éxito');
    
    app.listen(port, () => {
      console.log(`Servidor backend corriendo en http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    process.exit(1); // Detiene el servidor si no hay base de datos
  }
}

// Ejecutar la función de inicio
if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };