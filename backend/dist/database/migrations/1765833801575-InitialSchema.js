"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialSchema1765833801575 = void 0;
class InitialSchema1765833801575 {
    async up(queryRunner) {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM ('user','admin','organizer')`);
        await queryRunner.query(`CREATE TYPE "public"."users_gender_enum" AS ENUM ('male','female','other','prefer_not_to_say')`);
        await queryRunner.query(`CREATE TABLE "users" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "email" character varying NOT NULL,
            "password" character varying NOT NULL,
            "firstName" character varying NOT NULL,
            "lastName" character varying NOT NULL,
            "phoneNumber" character varying,
            "role" "public"."users_role_enum" NOT NULL DEFAULT 'user',
            "gender" "public"."users_gender_enum",
            "dateOfBirth" date,
            "profilePicture" character varying,
            "isVerified" boolean NOT NULL DEFAULT false,
            "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            CONSTRAINT "PK_users_id" PRIMARY KEY ("id"),
            CONSTRAINT "UQ_users_email" UNIQUE ("email")
          )`);
        await queryRunner.query(`CREATE TABLE "associations" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "name" character varying NOT NULL,
            "description" text,
            "logoUrl" character varying,
            "website" character varying,
            "isActive" boolean NOT NULL DEFAULT true,
            "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            CONSTRAINT "PK_associations_id" PRIMARY KEY ("id")
          )`);
        await queryRunner.query(`CREATE TYPE "public"."association_memberships_role_enum" AS ENUM ('admin','organizer','member')`);
        await queryRunner.query(`CREATE TABLE "association_memberships" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "userId" uuid NOT NULL,
            "associationId" uuid NOT NULL,
            "role" "public"."association_memberships_role_enum" NOT NULL,
            "category" integer,
            "points" integer NOT NULL DEFAULT 0,
            "joinedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            CONSTRAINT "PK_association_memberships_id" PRIMARY KEY ("id"),
            CONSTRAINT "FK_association_memberships_user" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE,
            CONSTRAINT "FK_association_memberships_association" FOREIGN KEY ("associationId") REFERENCES "associations" ("id") ON DELETE CASCADE
          )`);
        await queryRunner.query(`CREATE TYPE "public"."categories_level_enum" AS ENUM ('beginner','intermediate','advanced','professional')`);
        await queryRunner.query(`CREATE TABLE "categories" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "name" character varying NOT NULL,
            "level" "public"."categories_level_enum" NOT NULL,
            "minPoints" integer NOT NULL,
            "maxPoints" integer NOT NULL,
            "description" text,
            "isActive" boolean NOT NULL DEFAULT true,
            "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            CONSTRAINT "PK_categories_id" PRIMARY KEY ("id")
          )`);
        await queryRunner.query(`CREATE TABLE "tournaments" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "name" character varying NOT NULL,
            "description" text,
            "startDate" TIMESTAMP WITH TIME ZONE NOT NULL,
            "endDate" TIMESTAMP WITH TIME ZONE,
            "status" character varying(50) NOT NULL,
            "type" character varying(50) NOT NULL,
            "settings" jsonb NOT NULL DEFAULT '{}'::jsonb,
            "isPublic" boolean NOT NULL DEFAULT false,
            "associationId" uuid NOT NULL,
            "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            CONSTRAINT "PK_tournaments_id" PRIMARY KEY ("id"),
            CONSTRAINT "FK_tournaments_association" FOREIGN KEY ("associationId") REFERENCES "associations" ("id") ON DELETE CASCADE
          )`);
        await queryRunner.query(`CREATE TABLE "tournament_teams" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "name" character varying NOT NULL,
            "tournamentId" uuid NOT NULL,
            "points" integer NOT NULL DEFAULT 0,
            "matchesWon" integer NOT NULL DEFAULT 0,
            "matchesLost" integer NOT NULL DEFAULT 0,
            "setsWon" integer NOT NULL DEFAULT 0,
            "setsLost" integer NOT NULL DEFAULT 0,
            "gamesWon" integer NOT NULL DEFAULT 0,
            "gamesLost" integer NOT NULL DEFAULT 0,
            "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "seed" character varying,
            "isEliminated" boolean NOT NULL DEFAULT false,
            CONSTRAINT "PK_tournament_teams_id" PRIMARY KEY ("id"),
            CONSTRAINT "FK_tournament_teams_tournament" FOREIGN KEY ("tournamentId") REFERENCES "tournaments" ("id") ON DELETE CASCADE
          )`);
        await queryRunner.query(`CREATE TABLE "tournament_players" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "userId" uuid NOT NULL,
            "teamId" uuid NOT NULL,
            "category" integer,
            "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            CONSTRAINT "PK_tournament_players_id" PRIMARY KEY ("id"),
            CONSTRAINT "FK_tournament_players_user" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE NO ACTION,
            CONSTRAINT "FK_tournament_players_team" FOREIGN KEY ("teamId") REFERENCES "tournament_teams" ("id") ON DELETE CASCADE
          )`);
        await queryRunner.query(`CREATE TABLE "tournament_registrations" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "tournamentId" uuid NOT NULL,
            "teamId" uuid NOT NULL,
            "status" character varying(20) NOT NULL DEFAULT 'pending',
            "rejectionReason" text,
            "registeredAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            CONSTRAINT "PK_tournament_registrations_id" PRIMARY KEY ("id"),
            CONSTRAINT "FK_tournament_registrations_tournament" FOREIGN KEY ("tournamentId") REFERENCES "tournaments" ("id") ON DELETE CASCADE,
            CONSTRAINT "FK_tournament_registrations_team" FOREIGN KEY ("teamId") REFERENCES "tournament_teams" ("id") ON DELETE CASCADE
          )`);
        await queryRunner.query(`CREATE TABLE "tournament_matches" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "tournamentId" uuid NOT NULL,
            "round" integer,
            "matchNumber" integer,
            "homeTeamId" uuid,
            "awayTeamId" uuid,
            "status" character varying(20) NOT NULL DEFAULT 'scheduled',
            "score" jsonb,
            "scheduledTime" TIMESTAMP WITH TIME ZONE,
            "courtId" uuid,
            "winnerTeamId" uuid,
            "notes" text,
            "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            CONSTRAINT "PK_tournament_matches_id" PRIMARY KEY ("id"),
            CONSTRAINT "FK_tournament_matches_tournament" FOREIGN KEY ("tournamentId") REFERENCES "tournaments" ("id") ON DELETE CASCADE,
            CONSTRAINT "FK_tournament_matches_home_team" FOREIGN KEY ("homeTeamId") REFERENCES "tournament_teams" ("id") ON DELETE SET NULL,
            CONSTRAINT "FK_tournament_matches_away_team" FOREIGN KEY ("awayTeamId") REFERENCES "tournament_teams" ("id") ON DELETE SET NULL,
            CONSTRAINT "FK_tournament_matches_winner_team" FOREIGN KEY ("winnerTeamId") REFERENCES "tournament_teams" ("id") ON DELETE SET NULL
          )`);
        await queryRunner.query(`CREATE TYPE "public"."notifications_type_enum" AS ENUM (
            'tournament_invitation',
            'team_invitation',
            'match_scheduled',
            'match_result',
            'tournament_update',
            'association_invitation',
            'general'
          )`);
        await queryRunner.query(`CREATE TYPE "public"."notifications_status_enum" AS ENUM ('unread','read','archived')`);
        await queryRunner.query(`CREATE TABLE "notifications" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "type" "public"."notifications_type_enum" NOT NULL,
            "message" text NOT NULL,
            "metadata" jsonb,
            "status" "public"."notifications_status_enum" NOT NULL DEFAULT 'unread',
            "userId" uuid NOT NULL,
            "isRead" boolean NOT NULL DEFAULT false,
            "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "readAt" TIMESTAMP WITH TIME ZONE,
            CONSTRAINT "PK_notifications_id" PRIMARY KEY ("id"),
            CONSTRAINT "FK_notifications_user" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE
          )`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "notifications"`);
        await queryRunner.query(`DROP TYPE "public"."notifications_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."notifications_type_enum"`);
        await queryRunner.query(`DROP TABLE "tournament_matches"`);
        await queryRunner.query(`DROP TABLE "tournament_registrations"`);
        await queryRunner.query(`DROP TABLE "tournament_players"`);
        await queryRunner.query(`DROP TABLE "tournament_teams"`);
        await queryRunner.query(`DROP TABLE "tournaments"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TYPE "public"."categories_level_enum"`);
        await queryRunner.query(`DROP TABLE "association_memberships"`);
        await queryRunner.query(`DROP TYPE "public"."association_memberships_role_enum"`);
        await queryRunner.query(`DROP TABLE "associations"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_gender_enum"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }
}
exports.InitialSchema1765833801575 = InitialSchema1765833801575;
//# sourceMappingURL=1765833801575-InitialSchema.js.map