import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSeasons1769990000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "seasons" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "associationId" uuid NOT NULL,
        "name" character varying(120) NOT NULL,
        "startDate" TIMESTAMP WITH TIME ZONE NOT NULL,
        "endDate" TIMESTAMP WITH TIME ZONE NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_seasons_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_seasons_association" FOREIGN KEY ("associationId") REFERENCES "associations" ("id") ON DELETE CASCADE
      )`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_seasons_associationId" ON "seasons" ("associationId")`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_seasons_associationId_startDate_endDate" ON "seasons" ("associationId", "startDate", "endDate")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_seasons_associationId_startDate_endDate"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_seasons_associationId"`);
    await queryRunner.query(`DROP TABLE "seasons"`);
  }
}
