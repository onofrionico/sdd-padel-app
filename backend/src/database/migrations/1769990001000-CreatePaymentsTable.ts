import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePaymentsTable1769990001000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "payments" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "enrollmentId" uuid NOT NULL,
        "amount" DECIMAL(10, 2) NOT NULL,
        "platformFee" DECIMAL(10, 2) NOT NULL DEFAULT 0,
        "gatewayFee" DECIMAL(10, 2) NOT NULL DEFAULT 0,
        "netAmount" DECIMAL(10, 2) NOT NULL,
        "currency" VARCHAR(3) NOT NULL DEFAULT 'ARS',
        "status" VARCHAR(30) NOT NULL DEFAULT 'pending',
        "paymentType" VARCHAR(20) NOT NULL DEFAULT 'full_team',
        "paidBy" uuid NOT NULL,
        "paymentMethod" VARCHAR(50),
        "paymentGateway" VARCHAR(50) NOT NULL,
        "externalTransactionId" VARCHAR(255),
        "paymentUrl" TEXT,
        "paidAt" TIMESTAMP WITH TIME ZONE,
        "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "metadata" JSONB DEFAULT '{}',
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_payments_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_payments_enrollment" FOREIGN KEY ("enrollmentId") REFERENCES "tournament_registrations" ("id") ON DELETE CASCADE,
        CONSTRAINT "FK_payments_paidBy" FOREIGN KEY ("paidBy") REFERENCES "users" ("id") ON DELETE RESTRICT,
        CONSTRAINT "CHK_payments_status" CHECK ("status" IN ('pending', 'processing', 'completed', 'failed', 'refunded', 'partially_refunded')),
        CONSTRAINT "CHK_payments_paymentType" CHECK ("paymentType" IN ('full_team', 'split', 'deposit', 'full_fee'))
      )`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_payments_enrollmentId" ON "payments" ("enrollmentId")`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_payments_status" ON "payments" ("status")`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_payments_externalTransactionId" ON "payments" ("externalTransactionId")`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_payments_paidBy" ON "payments" ("paidBy")`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_payments_expiresAt" ON "payments" ("expiresAt")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_payments_expiresAt"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_payments_paidBy"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_payments_externalTransactionId"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_payments_status"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_payments_enrollmentId"`);
    await queryRunner.query(`DROP TABLE "payments"`);
  }
}
