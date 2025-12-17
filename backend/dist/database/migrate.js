"use strict";
require('ts-node/register');
require('reflect-metadata');
const { DataSource } = require('typeorm');
const { dataSourceOptions } = require('../config/typeorm.config');
async function migrate() {
    console.log('Starting migration...');
    const dataSource = new DataSource(dataSourceOptions);
    await dataSource.initialize();
    try {
        await dataSource.runMigrations();
        console.log('Migration completed successfully');
        process.exit(0);
    }
    catch (error) {
        console.error('Error during migration:', error);
        process.exit(1);
    }
}
migrate();
//# sourceMappingURL=migrate.js.map