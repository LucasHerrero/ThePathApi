const Sequelize = require('sequelize');
const { sequelize } = require('../mysql.js');

const User = sequelize.define('User', {
  user_id: {
    type: Sequelize.DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  birthday: {
    type: Sequelize.DataTypes.DATE,
    allowNull: true
  },
  height: {
    type: Sequelize.DataTypes.FLOAT,
    allowNull: true
  },
  kg: {
    type: Sequelize.DataTypes.FLOAT,
    allowNull: true
  },
  registration_date: {
    type: Sequelize.DataTypes.DATE,
    allowNull: true
  },
  // ...
}, {
  // Opciones del modelo
  tableName: 'User',
  timestamps: false
});

module.exports = User;