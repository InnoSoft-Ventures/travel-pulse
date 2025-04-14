'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('operators', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      external_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      country_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'countries',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      continent_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'continents',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      provider: {
        allowNull: false,
        type: Sequelize.STRING(100),
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING(255),
      },
      type: {
        allowNull: true,
        type: Sequelize.STRING(50),
      },
      is_prepaid: {
        allowNull: true,
        type: Sequelize.BOOLEAN,
      },
      esim_type: {
        allowNull: true,
        type: Sequelize.STRING(50),
      },
      warning: {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      apn_type: {
        allowNull: true,
        type: Sequelize.STRING(50),
      },
      apn_value: {
        allowNull: true,
        type: Sequelize.STRING(255),
      },
      apn: {
        allowNull: false,
        type: Sequelize.JSON,
      },
      info: {
        allowNull: false,
        type: Sequelize.JSON,
      },
      is_roaming: {
        allowNull: true,
        type: Sequelize.BOOLEAN,
      },
      plan_type: {
        allowNull: true,
        type: Sequelize.STRING(50),
      },
      activation_policy: {
        allowNull: true,
        type: Sequelize.STRING(50),
      },
      is_kyc_verify: {
        allowNull: true,
        type: Sequelize.BOOLEAN,
      },
      rechargeability: {
        allowNull: true,
        type: Sequelize.BOOLEAN,
      },
      other_info: {
        allowNull: true,
        type: Sequelize.TEXT,
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
    await queryInterface.dropTable('operators');
  },
};
