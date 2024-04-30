const Sequelize = require('sequelize');
const { sequelize } = require('../mysql.js');

const Ejercicio = sequelize.define('Ejercicio', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nombre: {
    type: Sequelize.STRING(100),
    allowNull: false
  },
  musculo: {
    type: Sequelize.STRING(50),
    allowNull: false
  },
  equipacion: {
    type: Sequelize.ENUM('Maquina', 'Mancuerna', 'Barra'),
    allowNull: false
  },
  dificultad: {
    type: Sequelize.ENUM('Principiante', 'Avanzado', 'Experto'),
    allowNull: false
  },
  instrucciones: {
    type: Sequelize.TEXT,
    allowNull: false
  },

}, {
  tableName: 'Ejercicios',
  timestamps: false
});

module.exports = Ejercicio;