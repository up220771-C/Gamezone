const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Compras = sequelize.define('Compras', {
  T_C_ID_Compra: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  T_C_ID_Usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Usuarios',
      key: 'ID_Usuario',
    },
  },
});

module.exports = Compras;
