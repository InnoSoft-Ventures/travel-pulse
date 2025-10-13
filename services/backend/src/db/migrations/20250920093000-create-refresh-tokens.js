'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('refresh_tokens', {
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
			expires_at: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			created_by_ip: {
				allowNull: true,
				type: Sequelize.STRING(45),
			},
			user_agent: {
				allowNull: true,
				type: Sequelize.STRING(512),
			},
			revoked_at: {
				allowNull: true,
				type: Sequelize.DATE,
			},
			revoked_by_ip: {
				allowNull: true,
				type: Sequelize.STRING(45),
			},
			replaced_by_token: {
				allowNull: true,
				type: Sequelize.STRING(128),
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

		await queryInterface.addIndex('refresh_tokens', ['user_id']);
		await queryInterface.addIndex('refresh_tokens', ['token_hash']);
	},

	async down(queryInterface) {
		await queryInterface.dropTable('refresh_tokens');
	},
};
