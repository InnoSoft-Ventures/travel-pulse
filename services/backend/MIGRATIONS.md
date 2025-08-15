# Database migrations

This project uses Sequelize CLI. Paths are configured via `.sequelizerc`:

-   Migrations: `src/db/migrations`
-   Models: `src/db/models`
-   Seeders: `src/db/seeders`
-   Config: `src/config/config.js`

Requirements

-   Ensure env vars in `services/backend/.env` are set (DB host, name, user, pass, dialect, port)
-   Use the workspace script wrapper: `pnpm --filter @travel-pulse/api sq-cli`

## Create a new migration

1. Generate a timestamped migration file

```bash
pnpm --filter @travel-pulse/api sq-cli migration:create --name <meaningful-name>
```

This creates a file under `src/db/migrations/<timestamp>-<meaningful-name>.js` with up/down stubs.

2. Edit the migration file

-   Implement the `up` function (apply changes)
-   Implement the `down` function (revert changes)
-   Use the configured dialect (default: `postgres` unless overridden via `.env`)

Example (add a column):

```js
'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn('Orders', 'orderNumber', {
			type: Sequelize.STRING,
			allowNull: false,
			unique: true,
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeColumn('Orders', 'orderNumber');
	},
};
```

## Run pending migrations

```bash
pnpm --filter @travel-pulse/api sq-cli db:migrate
```

## Revert the last batch

```bash
pnpm --filter @travel-pulse/api sq-cli db:migrate:undo
```

## Seed data (optional)

```bash
pnpm --filter @travel-pulse/api sq-cli db:seed:all
pnpm --filter @travel-pulse/api sq-cli db:seed:undo:all
```

## Tips

-   Name migrations clearly (e.g., `add-order-currency-and-number`)
-   Keep migrations idempotent and reversible
-   Review generated SQL on CI/staging before production
-   If you change the DB dialect, update `.env` and verify `src/config/config.js`
