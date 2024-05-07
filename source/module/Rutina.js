const Sequelize = require("sequelize");
const { sequelize } = require("../mysql.js");
const User = require("./user.js");

const Rutina = sequelize.define(
  "Rutinas",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    cantidadEj: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    userFk: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    Dia: {
      type: Sequelize.ENUM(
        "Lunes",
        "Martes",
        "Miercoles",
        "Jueves",
        "Viernes",
        "Sabado",
        "Domingo"
      ),
    },
  },
  {
    tableName: "Rutinas",
    timestamps: false,
  }
);

Rutina.belongsTo(User, { foreignKey: "userFk", targetKey: "user_id" });

module.exports = Rutina;
