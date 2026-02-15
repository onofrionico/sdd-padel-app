import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateRegistrationStatusEnum1769990005000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // First, add the new status values to the existing check constraint
    // We need to drop and recreate the constraint to include new values
    await queryRunner.query(
      `ALTER TABLE "tournament_registrations" DROP CONSTRAINT IF EXISTS "CHK_tournament_registrations_status"`,
    );

    // Update the column to allow new status values
    await queryRunner.query(
      `ALTER TABLE "tournament_registrations" 
       ADD CONSTRAINT "CHK_tournament_registrations_status" 
       CHECK ("status" IN ('pending', 'approved', 'payment_pending', 'confirmed', 'rejected', 'withdrawn', 'cancelled'))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert any payment_pending or confirmed statuses to approved before downgrading
    await queryRunner.query(
      `UPDATE "tournament_registrations" SET "status" = 'approved' WHERE "status" IN ('payment_pending', 'confirmed')`,
    );

    await queryRunner.query(
      `UPDATE "tournament_registrations" SET "status" = 'withdrawn' WHERE "status" = 'cancelled'`,
    );

    // Restore original constraint
    await queryRunner.query(
      `ALTER TABLE "tournament_registrations" DROP CONSTRAINT IF EXISTS "CHK_tournament_registrations_status"`,
    );

    await queryRunner.query(
      `ALTER TABLE "tournament_registrations" 
       ADD CONSTRAINT "CHK_tournament_registrations_status" 
       CHECK ("status" IN ('pending', 'approved', 'rejected', 'withdrawn'))`,
    );
  }
}
