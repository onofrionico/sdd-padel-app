import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRefundsTable1738166600000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "refunds" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "paymentId" uuid NOT NULL,
        "amount" DECIMAL(10, 2) NOT NULL,
        "reason" TEXT,
        "status" VARCHAR(30) NOT NULL DEFAULT 'pending',
        "externalRefundId" VARCHAR(255),
        "initiatedBy" uuid NOT NULL,
        "processedAt" TIMESTAMP WITH TIME ZONE,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_refunds_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_refunds_payment" FOREIGN KEY ("paymentId") REFERENCES "payments" ("id") ON DELETE CASCADE,
        CONSTRAINT "FK_refunds_initiatedBy" FOREIGN KEY ("initiatedBy") REFERENCES "users" ("id") ON DELETE RESTRICT,
        CONSTRAINT "CHK_refunds_status" CHECK ("status" IN ('pending', 'processing', 'completed', 'failed'))
      )`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_refunds_paymentId" ON "refunds" ("paymentId")`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_refunds_status" ON "refunds" ("status")`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_refunds_initiatedBy" ON "refunds" ("initiatedBy")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_refunds_initiatedBy"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_refunds_status"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_refunds_paymentId"`);
    await queryRunner.query(`DROP TABLE "refunds"`);
  }
}
