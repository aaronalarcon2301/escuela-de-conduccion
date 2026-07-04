const { DataSource } = require('typeorm');
require('dotenv').config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres', 
  password: process.env.DB_PASSWORD || 'A@ronAlarcon1197', 
  database: process.env.DB_NAME || 'escuela_conduccion_db',
  synchronize: true, 
  logging: false,
  entities: [__dirname + '/../entities/*.js'], 
});

module.exports = { AppDataSource };