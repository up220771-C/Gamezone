const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Usuarios = sequelize.define('Usuarios', {
  T_U_ID_Usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
});

module.exports = Usuarios;
