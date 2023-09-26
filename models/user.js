const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  profile_photo: Sequelize.STRING,
  name: Sequelize.STRING,
  email: Sequelize.STRING,
  password: Sequelize.STRING,
  about_artist: Sequelize.STRING,
  shop_banner: Sequelize.STRING,
  about_store: Sequelize.STRING,
  academics: Sequelize.STRING,
  exhibitions: Sequelize.STRING,
},
});

module.exports = User;
