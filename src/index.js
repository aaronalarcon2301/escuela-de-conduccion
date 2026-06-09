require('dotenv').config();
const express = require('express');
const { AppDataSource } = require('./config/db');

// Importación de los enrutadores modulares
const alumnoRoutes = require('./routes/alumnoRoutes');
const reservaRoutes = require('./routes/reservaRoutes');

const app = express(); 
const port = process.env.PORT || 3000; 

app.use(express.json()); // para que el servidor entienda datos en formato JSON

// Vinculación de las rutas a la aplicación Express
app.use('/alumnos', alumnoRoutes);
app.use('/reservar-clase', reservaRoutes);

// conexión base de datos
AppDataSource.initialize()
  .then(() => {
    console.log('Base de datos PostgreSQL conectada con éxito');
    
    // se enciende el servidor solo si la base de datos se conecta
    app.listen(port, () => {
      console.log(`Backend corriendo en http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Error fatal al conectar con la base de datos:', error);
  });