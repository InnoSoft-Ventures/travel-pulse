'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'country_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'countries',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      // For Postgres, you may also want to add an index for faster lookups
    });

    await queryInterface.addIndex('users', ['country_id'], {
      name: 'users_country_id_idx',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('users', 'users_country_id_idx');
    await queryInterface.removeColumn('users', 'country_id');
  },
};
