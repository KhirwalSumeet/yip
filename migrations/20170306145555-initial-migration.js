'use strict';
var Promise = require('bluebird');
module.exports = {
  up: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.createTable('users', {
          id        : { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
          email     : { type: Sequelize.STRING, allowNull: false, unique: true },
          password  : { type: Sequelize.STRING, allowNull: false, unique: false },
          name      : { type: Sequelize.STRING, allowNull: false, unique: false },
          phone     : { type: Sequelize.STRING, allowNull: true, unique: false },
          address   : { type: Sequelize.STRING, allowNull: true, unique: false },
          emergency : { type: Sequelize.STRING, allowNull: true, unique: false },
          schoolId  : { type: Sequelize.UUID, allowNull: false, unique: true },
          isVerified: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false, unique: false },
          createdAt : { type: Sequelize.DATE, allowNull: false },
          updatedAt : { type: Sequelize.DATE, allowNull: true },
          deletedAt : { type: Sequelize.DATE, allowNull: true }
      }),
      queryInterface.createTable('schools', {
          id        : { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
          name      : { type: Sequelize.STRING, allowNull: false, unique: false },
          email     : { type: Sequelize.STRING, allowNull: true, unique: false },
          address   : { type: Sequelize.STRING(1000), allowNull: true, unique: false },
          phone     : { type: Sequelize.STRING, allowNull: true, unique: false },
          principal : { type: Sequelize.STRING, allowNull: true, unique: false },
          principalPhone : { type: Sequelize.STRING, allowNull: true, unique: false },
          createdAt : { type: Sequelize.DATE, allowNull: false },
          updatedAt : { type: Sequelize.DATE, allowNull: true },
          deletedAt : { type: Sequelize.DATE, allowNull: true }
      }),
      queryInterface.createTable('teams', {
          id        : { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
          name      : { type: Sequelize.STRING, allowNull: false, unique: false },
          schoolId  : { type: Sequelize.UUID, allowNull: false, unique: false },
          students  : { type: Sequelize.TEXT('tiny'), allowNull: true },
          createdAt : { type: Sequelize.DATE, allowNull: false },
          updatedAt : { type: Sequelize.DATE, allowNull: true },
          deletedAt : { type: Sequelize.DATE, allowNull: true }
      })
    ]);
  },

  down: function (queryInterface, Sequelize) {
    return Promise.all([queryInterface.dropTable('users'), queryInterface.dropTable('schools'), queryInterface.dropTable('teams') ]);
  }
};
