const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const TarjetasRegalo = sequelize.define('TarjetasRegalo', {
  T_T_ID_Tarjeta: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  T_T_Codigo: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  T_T_ID_Usuario: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Usuarios',
      key: 'ID_Usuario',
    },
  },
});

module.exports = TarjetasRegalo;
