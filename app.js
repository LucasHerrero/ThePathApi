const express = require('express');
const cors = require('cors');

const { dbConnectMySql } = require('./source/mysql.js');
const userController = require('./source/controller/UserController.js');
const ejercicioController = require('./source/controller/EjerciciosController.js'); // Importa el nuevo controlador

const app = express();
const port = 3000;
app.use(express.json());
app.use(cors()); // Asegúrate de que esta línea está antes de tus rutas

app.use('/', userController);
app.use('/', ejercicioController); // Usa el nuevo controlador


// ...
dbConnectMySql().then(() => {
  app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
  });
}).catch((error) => {
  console.error("Unable to start the server:", error);
});