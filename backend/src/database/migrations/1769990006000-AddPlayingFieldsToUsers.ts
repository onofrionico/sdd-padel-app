import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPlayingFieldsToUsers1769990006000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN "playingHand" character varying(20)`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN "playingStyle" character varying(20)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "playingStyle"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "playingHand"`,
    );
  }
}
