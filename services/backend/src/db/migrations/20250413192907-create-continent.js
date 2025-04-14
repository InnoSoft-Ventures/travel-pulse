'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('continents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      alias_list: {
        allowNull: false,
        type: Sequelize.JSON,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('continents');
  },
};
