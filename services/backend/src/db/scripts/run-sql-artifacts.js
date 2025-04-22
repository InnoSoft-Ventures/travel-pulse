const fs = require('fs');
const path = require('path');
const { sequelize } = require('../models');

const runSQLArtifacts = async () => {
	try {
		const artifactsDir = path.join(__dirname, '../artifacts');
		const files = fs
			.readdirSync(artifactsDir)
			.filter((f) => f.endsWith('.sql'));

		for (const file of files) {
			const filePath = path.join(artifactsDir, file);
			const sql = fs.readFileSync(filePath, 'utf-8');
			console.log(`Running ${file}...`);

			await sequelize.query(sql, {
				logging: false,
			});
		}

		console.log('✅ All SQL artifacts executed successfully.');
		process.exit(0);
	} catch (error) {
		console.error('❌ Error executing SQL artifacts:', error);
		process.exit(1);
	}
};

runSQLArtifacts();
