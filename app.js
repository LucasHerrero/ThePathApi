const express = require('express');
const cors = require('cors');

const { dbConnectMySql } = require('./source/mysql.js');
const userController = require('./source/controller/UserController.js');
const ejercicioController = require('./source/controller/EjerciciosController.js'); // Importa el nuevo controlador
const rutinaController = require('./source/controller/RutinaController.js');

const app = express();
const port = 3000;
app.use(express.json());
app.use(cors()); 

app.use('/', userController);
app.use('/', ejercicioController); 
app.use('/', rutinaController);

// ...
dbConnectMySql().then(() => {
  app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
  });
}).catch((error) => {
  console.error("Unable to start the server:", error);
});