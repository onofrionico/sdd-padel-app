import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPaymentSettingsToTournaments1769990004000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tournaments" ADD "paymentSettings" JSONB DEFAULT '{}'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tournaments" DROP COLUMN "paymentSettings"`,
    );
  }
}
