'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
		 * Add currency and order number columns to orders table
		 */
		await queryInterface.addColumn('orders', 'currency', {
			type: Sequelize.STRING(3),
			allowNull: false,
			defaultValue: 'USD'
		});

		await queryInterface.addColumn('orders', 'order_number', {
			type: Sequelize.STRING,
			allowNull: false,
			unique: true,
		});
  },

  async down (queryInterface, Sequelize) {
    /**
		 * Remove currency and order number columns from orders table
		 */
		await queryInterface.removeColumn('orders', 'currency');
		await queryInterface.removeColumn('orders', 'order_number');
  }
};
