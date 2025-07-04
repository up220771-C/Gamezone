const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const DetalleCompra = sequelize.define('DetalleCompra', {
  ID_Detalle: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  ID_Compra: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Compras',
      key: 'ID_Compra',
    },
  },
  ID_Juego: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Juegos',
      key: 'ID_Juego',
    },
  },
});

module.exports = DetalleCompra;
