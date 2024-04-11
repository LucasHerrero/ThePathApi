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
  user_password: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  },
  user_email: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  user_birthday: {
    type: Sequelize.DataTypes.DATE,
    allowNull: true
  },
  user_height: {
    type: Sequelize.DataTypes.FLOAT,
    allowNull: true
  },
  user_kg: {
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