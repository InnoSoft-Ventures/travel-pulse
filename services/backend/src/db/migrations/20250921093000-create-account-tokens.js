'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('account_tokens', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.BIGINT,
			},
			user_id: {
				allowNull: false,
				type: Sequelize.INTEGER,
				references: {
					model: 'users',
					key: 'id',
				},
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			},
			token_hash: {
				allowNull: false,
				type: Sequelize.STRING(128),
				unique: true,
			},
			token_type: {
				allowNull: false,
				type: Sequelize.STRING(32),
			},
			expires_at: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			consumed_at: {
				allowNull: true,
				type: Sequelize.DATE,
			},
			created_at: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.fn('NOW'),
			},
			updated_at: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.fn('NOW'),
			},
		});

		await queryInterface.addIndex('account_tokens', ['user_id']);
		await queryInterface.addIndex('account_tokens', ['token_type']);
		await queryInterface.addIndex('account_tokens', ['expires_at']);
	},

	async down(queryInterface) {
		await queryInterface.dropTable('account_tokens');
	},
};
