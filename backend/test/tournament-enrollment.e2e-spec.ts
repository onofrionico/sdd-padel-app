import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

describe('Tournament Enrollment (US3) - E2E Tests', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;
  let player1Token: string;
  let player1Id: string;
  let player2Token: string;
  let player2Id: string;
  let organizerToken: string;
  let organizerId: string;
  let associationId: string;
  let tournamentId: string;
  let registrationId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    await app.init();

    dataSource = moduleFixture.get<DataSource>(DataSource);

    // Create organizer
    const organizerRegister = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'organizer-enrollment@example.com',
        password: 'Organizer123!@#',
        firstName: 'Tournament',
        lastName: 'Organizer',
      });

    organizerId = organizerRegister.body.id;

    const organizerLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'organizer-enrollment@example.com',
        password: 'Organizer123!@#',
      });

    organizerToken = organizerLogin.body.access_token;

    // Create association
    const associationResponse = await request(app.getHttpServer())
      .post('/associations')
      .set('Authorization', `Bearer ${organizerToken}`)
      .send({
        name: 'Enrollment Test Association',
        description: 'Association for enrollment testing',
      });

    associationId = associationResponse.body.id;

    // Create tournament
    const tournamentResponse = await request(app.getHttpServer())
      .post('/tournaments')
      .set('Authorization', `Bearer ${organizerToken}`)
      .send({
        name: 'Enrollment Test Tournament',
        startDate: new Date('2024-09-01T10:00:00.000Z').toISOString(),
        type: 'single_elimination',
        settings: {
          maxTeams: 16,
          minTeams: 8,
          teamSize: 2,
        },
        associationId: associationId,
      });

    tournamentId = tournamentResponse.body.id;

    // Create player 1
    const player1Register = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'player1-enrollment@example.com',
        password: 'Player123!@#',
        firstName: 'Player',
        lastName: 'One',
      });

    player1Id = player1Register.body.id;

    const player1Login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'player1-enrollment@example.com',
        password: 'Player123!@#',
      });

    player1Token = player1Login.body.access_token;

    // Register player 1 in association
    await request(app.getHttpServer())
      .post('/users/me/player-registration')
      .set('Authorization', `Bearer ${player1Token}`)
      .send({
        associationId: associationId,
        category: 4,
      });

    // Create player 2
    const player2Register = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'player2-enrollment@example.com',
        password: 'Player123!@#',
        firstName: 'Player',
        lastName: 'Two',
      });

    player2Id = player2Register.body.id;

    const player2Login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'player2-enrollment@example.com',
        password: 'Player123!@#',
      });

    player2Token = player2Login.body.access_token;

    // Register player 2 in association
    await request(app.getHttpServer())
      .post('/users/me/player-registration')
      .set('Authorization', `Bearer ${player2Token}`)
      .send({
        associationId: associationId,
        category: 4,
      });
  });

  afterAll(async () => {
    // Clean up test data
    if (dataSource && dataSource.isInitialized) {
      await dataSource.query('DELETE FROM tournament_registrations WHERE "tournamentId" = $1', [tournamentId]);
      await dataSource.query('DELETE FROM tournaments WHERE id = $1', [tournamentId]);
      await dataSource.query('DELETE FROM association_memberships WHERE "associationId" = $1', [associationId]);
      await dataSource.query('DELETE FROM associations WHERE id = $1', [associationId]);
      await dataSource.query('DELETE FROM "users" WHERE id IN ($1, $2, $3)', [player1Id, player2Id, organizerId]);
    }
    await app.close();
  });

  describe('T016 [P] [US3] Submit enrollment request', () => {
    it('should submit an enrollment request with partner', async () => {
      const response = await request(app.getHttpServer())
        .post(`/tournaments/${tournamentId}/enrollments`)
        .set('Authorization', `Bearer ${player1Token}`)
        .send({
          partnerId: player2Id,
          teamName: 'Dream Team',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.tournamentId).toBe(tournamentId);
      expect(response.body.status).toBe('pending');
      expect(response.body).toHaveProperty('team');
      expect(response.body.team.name).toBe('Dream Team');

      registrationId = response.body.id;
    });

    it('should fail to submit duplicate enrollment', async () => {
      await request(app.getHttpServer())
        .post(`/tournaments/${tournamentId}/enrollments`)
        .set('Authorization', `Bearer ${player1Token}`)
        .send({
          partnerId: player2Id,
          teamName: 'Another Team',
        })
        .expect(400);
    });

    it('should fail to submit enrollment without partner', async () => {
      await request(app.getHttpServer())
        .post(`/tournaments/${tournamentId}/enrollments`)
        .set('Authorization', `Bearer ${player1Token}`)
        .send({
          teamName: 'Solo Team',
        })
        .expect(400);
    });

    it('should fail to submit enrollment with non-existent partner', async () => {
      const fakePartnerId = '00000000-0000-0000-0000-000000000000';
      
      await request(app.getHttpServer())
        .post(`/tournaments/${tournamentId}/enrollments`)
        .set('Authorization', `Bearer ${player1Token}`)
        .send({
          partnerId: fakePartnerId,
          teamName: 'Fake Partner Team',
        })
        .expect(404);
    });

    it('should fail to submit enrollment without authentication', async () => {
      await request(app.getHttpServer())
        .post(`/tournaments/${tournamentId}/enrollments`)
        .send({
          partnerId: player2Id,
          teamName: 'Unauthorized Team',
        })
        .expect(401);
    });
  });

  describe('T017 [P] [US3] Approve/Reject enrollment', () => {
    it('should list pending enrollments', async () => {
      const response = await request(app.getHttpServer())
        .get(`/tournaments/${tournamentId}/enrollments?status=pending`)
        .set('Authorization', `Bearer ${organizerToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].status).toBe('pending');
    });

    it('should approve an enrollment request', async () => {
      const response = await request(app.getHttpServer())
        .put(`/tournaments/${tournamentId}/enrollments/${registrationId}/decision`)
        .set('Authorization', `Bearer ${organizerToken}`)
        .send({
          decision: 'approved',
        })
        .expect(200);

      expect(response.body.status).toBe('approved');
    });

    it('should verify enrollment was approved', async () => {
      const response = await request(app.getHttpServer())
        .get(`/tournaments/${tournamentId}/enrollments?status=approved`)
        .set('Authorization', `Bearer ${organizerToken}`)
        .expect(200);

      const approvedRegistration = response.body.find((r: any) => r.id === registrationId);
      expect(approvedRegistration).toBeDefined();
      expect(approvedRegistration.status).toBe('approved');
    });

    it('should create and reject an enrollment request', async () => {
      // Create another pair of players
      const player3Register = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'player3-enrollment@example.com',
          password: 'Player123!@#',
          firstName: 'Player',
          lastName: 'Three',
        });

      const player3Id = player3Register.body.id;

      const player3Login = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'player3-enrollment@example.com',
          password: 'Player123!@#',
        });

      const player3Token = player3Login.body.access_token;

      await request(app.getHttpServer())
        .post('/users/me/player-registration')
        .set('Authorization', `Bearer ${player3Token}`)
        .send({
          associationId: associationId,
          category: 3,
        });

      const player4Register = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'player4-enrollment@example.com',
          password: 'Player123!@#',
          firstName: 'Player',
          lastName: 'Four',
        });

      const player4Id = player4Register.body.id;

      await request(app.getHttpServer())
        .post('/users/me/player-registration')
        .set('Authorization', `Bearer ${player3Token}`)
        .send({
          associationId: associationId,
          category: 3,
        });

      // Submit enrollment
      const enrollResponse = await request(app.getHttpServer())
        .post(`/tournaments/${tournamentId}/enrollments`)
        .set('Authorization', `Bearer ${player3Token}`)
        .send({
          partnerId: player4Id,
          teamName: 'Team to Reject',
        })
        .expect(201);

      const rejectRegistrationId = enrollResponse.body.id;

      // Reject enrollment
      const response = await request(app.getHttpServer())
        .put(`/tournaments/${tournamentId}/enrollments/${rejectRegistrationId}/decision`)
        .set('Authorization', `Bearer ${organizerToken}`)
        .send({
          decision: 'rejected',
          rejectionReason: 'Tournament is full',
        })
        .expect(200);

      expect(response.body.status).toBe('rejected');

      // Clean up
      await dataSource.query('DELETE FROM tournament_registrations WHERE id = $1', [rejectRegistrationId]);
      await dataSource.query('DELETE FROM association_memberships WHERE "userId" IN ($1, $2)', [player3Id, player4Id]);
      await dataSource.query('DELETE FROM "users" WHERE id IN ($1, $2)', [player3Id, player4Id]);
    });

    it('should fail to approve non-existent enrollment', async () => {
      const fakeRegistrationId = '00000000-0000-0000-0000-000000000000';
      
      await request(app.getHttpServer())
        .put(`/tournaments/${tournamentId}/enrollments/${fakeRegistrationId}/decision`)
        .set('Authorization', `Bearer ${organizerToken}`)
        .send({
          decision: 'approved',
        })
        .expect(404);
    });

    it('should list all enrollments without status filter', async () => {
      const response = await request(app.getHttpServer())
        .get(`/tournaments/${tournamentId}/enrollments`)
        .set('Authorization', `Bearer ${organizerToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('T018 [P] [US3] View tournament participants', () => {
    it('should view tournament participants (approved teams)', async () => {
      const response = await request(app.getHttpServer())
        .get(`/tournaments/${tournamentId}/participants`)
        .set('Authorization', `Bearer ${player1Token}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      
      const team = response.body.find((t: any) => t.name === 'Dream Team');
      expect(team).toBeDefined();
      expect(team.name).toBe('Dream Team');
    });

    it('should view participants with team details', async () => {
      const response = await request(app.getHttpServer())
        .get(`/tournaments/${tournamentId}/participants`)
        .set('Authorization', `Bearer ${player1Token}`)
        .expect(200);

      const team = response.body.find((t: any) => t.name === 'Dream Team');
      expect(team).toHaveProperty('id');
      expect(team).toHaveProperty('name');
      expect(team).toHaveProperty('tournamentId');
      expect(team.tournamentId).toBe(tournamentId);
    });

    it('should view participants without authentication', async () => {
      const response = await request(app.getHttpServer())
        .get(`/tournaments/${tournamentId}/participants`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return empty array for tournament with no participants', async () => {
      // Create a new tournament without participants
      const newTournamentResponse = await request(app.getHttpServer())
        .post('/tournaments')
        .set('Authorization', `Bearer ${organizerToken}`)
        .send({
          name: 'Empty Tournament',
          startDate: new Date('2024-10-01T10:00:00.000Z').toISOString(),
          type: 'single_elimination',
          settings: {
            maxTeams: 8,
            minTeams: 4,
            teamSize: 2,
          },
          associationId: associationId,
        });

      const emptyTournamentId = newTournamentResponse.body.id;

      const response = await request(app.getHttpServer())
        .get(`/tournaments/${emptyTournamentId}/participants`)
        .set('Authorization', `Bearer ${player1Token}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);

      // Clean up
      await dataSource.query('DELETE FROM tournaments WHERE id = $1', [emptyTournamentId]);
    });

    it('should fail to view participants of non-existent tournament', async () => {
      const fakeTournamentId = '00000000-0000-0000-0000-000000000000';
      
      await request(app.getHttpServer())
        .get(`/tournaments/${fakeTournamentId}/participants`)
        .set('Authorization', `Bearer ${player1Token}`)
        .expect(404);
    });

    it('should verify only approved teams are in participants list', async () => {
      const response = await request(app.getHttpServer())
        .get(`/tournaments/${tournamentId}/participants`)
        .set('Authorization', `Bearer ${player1Token}`)
        .expect(200);

      // All teams in participants should be from approved registrations
      expect(Array.isArray(response.body)).toBe(true);
      
      // Verify by checking enrollments
      const enrollmentsResponse = await request(app.getHttpServer())
        .get(`/tournaments/${tournamentId}/enrollments?status=approved`)
        .set('Authorization', `Bearer ${organizerToken}`)
        .expect(200);

      const approvedCount = enrollmentsResponse.body.length;
      expect(response.body.length).toBe(approvedCount);
    });
  });
});
