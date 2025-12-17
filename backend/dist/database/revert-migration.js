"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const typeorm_config_1 = require("../config/typeorm.config");
async function revertMigration() {
    console.log('Reverting last migration...');
    const dataSource = new typeorm_1.DataSource(typeorm_config_1.dataSourceOptions);
    await dataSource.initialize();
    try {
        await dataSource.undoLastMigration();
        console.log('Successfully reverted last migration');
        process.exit(0);
    }
    catch (error) {
        console.error('Error reverting migration:', error);
        process.exit(1);
    }
}
revertMigration();
//# sourceMappingURL=revert-migration.js.map