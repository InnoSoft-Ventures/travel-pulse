'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('payment_cards', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			user_id: {
				allowNull: false,
				type: Sequelize.INTEGER,
				references: { model: 'users', key: 'id' },
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			customer_code: {
				allowNull: true,
				type: Sequelize.STRING,
			},
			default: {
				allowNull: true,
				type: Sequelize.BOOLEAN,
				defaultValue: false,
			},
			provider: {
				allowNull: false,
				type: Sequelize.STRING,
			},
			brand: { allowNull: true, type: Sequelize.STRING },
			last4: { allowNull: true, type: Sequelize.STRING(4) },
			exp_month: { allowNull: true, type: Sequelize.INTEGER },
			exp_year: { allowNull: true, type: Sequelize.INTEGER },
			authorization_code: { allowNull: false, type: Sequelize.STRING },
			signature: { allowNull: true, type: Sequelize.STRING },
			bank: { allowNull: true, type: Sequelize.STRING },
			country_code: { allowNull: true, type: Sequelize.STRING(2) },
			card_type: { allowNull: true, type: Sequelize.STRING },
			reusable: { allowNull: true, type: Sequelize.BOOLEAN },
			account_name: { allowNull: true, type: Sequelize.STRING },
			metadata: { allowNull: true, type: Sequelize.JSON },
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

		await queryInterface.addIndex(
			'payment_cards',
			['user_id', 'provider', 'last4'],
			{
				name: 'idx_payment_cards_user_provider_last4',
			}
		);
	},

	async down(queryInterface) {
		await queryInterface.dropTable('payment_cards');
	},
};
