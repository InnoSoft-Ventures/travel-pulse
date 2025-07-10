'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('countries', {
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
			slug: {
				type: Sequelize.STRING(100),
				allowNull: false,
				unique: true,
			},
			official_name: {
				allowNull: false,
				type: Sequelize.STRING,
			},
			iso2: {
				allowNull: false,
				type: Sequelize.STRING(2),
			},
			iso3: {
				allowNull: false,
				type: Sequelize.STRING(3),
			},
			timezone: {
				allowNull: false,
				type: Sequelize.STRING,
			},
			flag: {
				allowNull: false,
				type: Sequelize.STRING,
			},
			demonym: {
				allowNull: false,
				type: Sequelize.STRING,
			},
			currency_name: {
				allowNull: false,
				type: Sequelize.STRING,
			},
			currency_symbol: {
				allowNull: false,
				type: Sequelize.STRING,
			},
			continent_id: {
				allowNull: false,
				type: Sequelize.INTEGER,
				references: {
					model: 'continents',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('countries');
	},
};
