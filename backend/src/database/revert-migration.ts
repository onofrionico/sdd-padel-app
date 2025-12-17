import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { dataSourceOptions } from '../config/typeorm.config';

async function revertMigration() {
  console.log('Reverting last migration...');
  const dataSource = new DataSource(dataSourceOptions);
  await dataSource.initialize();
  try {
    await dataSource.undoLastMigration();
    console.log('Successfully reverted last migration');
    process.exit(0);
  } catch (error) {
    console.error('Error reverting migration:', error);
    process.exit(1);
  }
}

revertMigration();
