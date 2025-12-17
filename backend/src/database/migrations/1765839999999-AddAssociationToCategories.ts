import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAssociationToCategories1765839999999 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "categories" ADD COLUMN "associationId" uuid`,
    );

    await queryRunner.query(
      `ALTER TABLE "categories" ADD CONSTRAINT "FK_categories_association" FOREIGN KEY ("associationId") REFERENCES "associations"("id") ON DELETE CASCADE`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_categories_associationId" ON "categories" ("associationId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_categories_associationId"`);
    await queryRunner.query(
      `ALTER TABLE "categories" DROP CONSTRAINT "FK_categories_association"`,
    );
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "associationId"`);
  }
}
