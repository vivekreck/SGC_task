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
  exhibitions: {
    type: Sequelize.STRING,
    get: function () {
      const value = this.getDataValue("exhibitions");
      if (!value) {
        return value;
      } else {
        return JSON.parse(value);
      }
    },
    set: function (value) {
      return this.setDataValue("exhibitions", JSON.stringify(value));
    },
  },
});

module.exports = User;
