require('dotenv').config();
const express = require('express');
const { AppDataSource } = require('./config/db');


const app = express(); // Usa el puerto del .env, y si falla, usa el 3000 por defecto
const port = process.env.PORT || 3000; 

app.use(express.json()); // Permite que el servidor entienda datos en formato JSON

// Iniciar la conexión a la base de datos
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