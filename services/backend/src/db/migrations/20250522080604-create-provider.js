'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('providers', {
			id: {
				type: Sequelize.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			identity_name: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
			},
			enabled: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: true,
			},
			access_token: {
				type: Sequelize.JSON,
				allowNull: true,
			},
			expires_in: {
				type: Sequelize.INTEGER,
				allowNull: true,
			},
			token_type: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			grant_type: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			client_id: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			client_secret: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			issued_at: {
				type: Sequelize.DATE,
				allowNull: true,
			},
			created_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.fn('NOW'),
			},
		});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('providers');
	},
};
