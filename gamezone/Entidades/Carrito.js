const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Carrito = sequelize.define('Carrito', {
  ID_Carrito: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  ID_Usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Usuarios',
      key: 'ID_Usuario',
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

module.exports = Carrito;
