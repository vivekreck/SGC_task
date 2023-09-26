const Sequelize = require('sequelize');
const { databaseConstants } = require('../configs/constants');

const sequelize = new Sequelize(
  databaseConstants.db,
  databaseConstants.username,
  databaseConstants.password,
  {
    dialect: databaseConstants.dialect,
    host: databaseConstants.host
  });

module.exports = sequelize;
