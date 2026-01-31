import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePaymentEventsTable1738166500000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "payment_events" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "paymentId" uuid NOT NULL,
        "eventType" VARCHAR(50) NOT NULL,
        "eventData" JSONB DEFAULT '{}',
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_payment_events_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_payment_events_payment" FOREIGN KEY ("paymentId") REFERENCES "payments" ("id") ON DELETE CASCADE
      )`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_payment_events_paymentId" ON "payment_events" ("paymentId")`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_payment_events_eventType" ON "payment_events" ("eventType")`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_payment_events_createdAt" ON "payment_events" ("createdAt")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_payment_events_createdAt"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_payment_events_eventType"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_payment_events_paymentId"`);
    await queryRunner.query(`DROP TABLE "payment_events"`);
  }
}
