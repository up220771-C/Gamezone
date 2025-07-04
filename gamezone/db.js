const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('nombre_base_datos', 'usuario', 'contraseña', {
  host: 'localhost',
  dialect: 'postgres',
});

module.exports = sequelize;
