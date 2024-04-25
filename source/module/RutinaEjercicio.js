const Sequelize = require('sequelize');
const { sequelize } = require('../mysql.js');
const Ejercicio = require('./Ejercicio.js');
const Rutina = require('./Rutina.js');


const RutinaEjercicio = sequelize.define('RutinaEjercicio', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  idRutina: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  idEjercicio: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
}, {
  tableName: 'RutinaEjercicio',
  timestamps: false
});

RutinaEjercicio.belongsTo(Ejercicio, { foreignKey: 'idEjercicio', targetKey: 'id' });
RutinaEjercicio.belongsTo(Rutina, { foreignKey: 'idRutina', targetKey: 'id' });

module.exports = RutinaEjercicio;