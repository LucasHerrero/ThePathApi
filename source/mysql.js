const Sequelize = require('sequelize');
require('dotenv').config();

const connectionString = `mysql://${process.env.MYSQL_USER}:${process.env.MYSQL_PASSWORD}@${process.env.MYSQL_HOST}/${process.env.MYSQL_DATABASE}`;
const sequelize = new Sequelize(connectionString);

async function dbConnectMySql() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}


module.exports = { dbConnectMySql, sequelize };