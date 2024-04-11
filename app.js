const express = require('express');
app.use(express.json());
const { dbConnectMySql } = require('./source/mysql.js');
const userController = require('./source/controller/UserController.js');
const app = express();
const port = 3000;

app.use('/', userController);

// ...
dbConnectMySql().then(() => {
  app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
  });
}).catch((error) => {
  console.error("Unable to start the server:", error);
});