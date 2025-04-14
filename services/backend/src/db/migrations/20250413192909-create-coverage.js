'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('coverages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      operator_id: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: {
          model: 'operators',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      data: {
        allowNull: true,
        type: Sequelize.JSON,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('coverages');
  },
};
