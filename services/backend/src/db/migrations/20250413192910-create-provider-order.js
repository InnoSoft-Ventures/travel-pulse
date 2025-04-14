'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('provider_orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      order_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'orders',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      provider: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      external_request_id: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      external_order_id: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED'),
        defaultValue: 'PENDING',
      },
      currency: {
        allowNull: false,
        type: Sequelize.STRING(3),
      },
      package_id: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      quantity: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      type: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      description: {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      esim_type: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      validity: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 30,
      },
      package: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      data: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      data_amount: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      text: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      voice: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      net_price: {
        allowNull: true,
        type: Sequelize.DECIMAL(10, 2),
      },
      price: {
        allowNull: true,
        type: Sequelize.DECIMAL(10, 2),
      },
      manual_installation: {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      qrcode_installation: {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      installation_guides: {
        allowNull: true,
        type: Sequelize.JSON,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('provider_orders');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_provider_orders_status";');
  },
};
