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
				type: Sequelize.STRING,
				allowNull: false,
			},
			expires_in: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			token_type: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			grant_type: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			client_id: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			client_secret: {
				type: Sequelize.STRING,
				allowNull: false,
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
