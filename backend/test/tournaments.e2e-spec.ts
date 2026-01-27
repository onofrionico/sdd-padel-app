import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

describe('Tournament Management (US1) - E2E Tests', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;
  let authToken: string;
  let userId: string;
  let associationId: string;
  let tournamentId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    await app.init();

    dataSource = moduleFixture.get<DataSource>(DataSource);

    // Register and login a test user
    const registerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'test-tournament@example.com',
        password: 'Test123!@#',
        firstName: 'Tournament',
        lastName: 'Organizer',
      });

    userId = registerResponse.body.id;

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'test-tournament@example.com',
        password: 'Test123!@#',
      });

    authToken = loginResponse.body.access_token;

    // Create an association for tournaments
    const associationResponse = await request(app.getHttpServer())
      .post('/associations')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Tournament Test Association',
        description: 'Association for tournament testing',
      });

    associationId = associationResponse.body.id;
  });

  afterAll(async () => {
    // Clean up test data
    if (dataSource && dataSource.isInitialized) {
      await dataSource.query('DELETE FROM tournaments WHERE "associationId" = $1', [associationId]);
      await dataSource.query('DELETE FROM associations WHERE id = $1', [associationId]);
      await dataSource.query('DELETE FROM "users" WHERE id = $1', [userId]);
    }
    await app.close();
  });

  describe('T001 [P] [US1] Create tournament with valid data', () => {
    it('should create a tournament with all required fields', async () => {
      const startDate = new Date('2024-08-15T10:00:00.000Z');
      const endDate = new Date('2024-08-17T18:00:00.000Z');

      const response = await request(app.getHttpServer())
        .post('/tournaments')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Summer Padel Championship',
          description: 'Annual summer padel tournament',
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          type: 'single_elimination',
          settings: {
            maxTeams: 16,
            minTeams: 8,
            teamSize: 2,
            pointsDistribution: {
              winner: 100,
              finalist: 70,
              semiFinalist: 50,
              quarterFinalist: 30,
            },
          },
          isPublic: true,
          associationId: associationId,
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Summer Padel Championship');
      expect(response.body.description).toBe('Annual summer padel tournament');
      expect(response.body.type).toBe('single_elimination');
      expect(response.body.status).toBe('upcoming');
      expect(response.body.isPublic).toBe(true);
      expect(response.body.settings).toHaveProperty('maxTeams', 16);
      expect(response.body.settings).toHaveProperty('minTeams', 8);
      expect(response.body.settings).toHaveProperty('teamSize', 2);
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('updatedAt');

      tournamentId = response.body.id;
    });

    it('should create a round-robin tournament', async () => {
      const response = await request(app.getHttpServer())
        .post('/tournaments')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Round Robin Tournament',
          startDate: new Date('2024-09-01T10:00:00.000Z').toISOString(),
          type: 'round_robin',
          settings: {
            maxTeams: 8,
            minTeams: 4,
            teamSize: 2,
          },
          associationId: associationId,
        })
        .expect(201);

      expect(response.body.type).toBe('round_robin');
      expect(response.body.status).toBe('upcoming');

      // Clean up
      await dataSource.query('DELETE FROM tournaments WHERE id = $1', [response.body.id]);
    });

    it('should fail to create tournament without required fields', async () => {
      await request(app.getHttpServer())
        .post('/tournaments')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Incomplete Tournament',
        })
        .expect(400);
    });

    it('should fail to create tournament with invalid association', async () => {
      const fakeAssociationId = '00000000-0000-0000-0000-000000000000';
      
      await request(app.getHttpServer())
        .post('/tournaments')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Invalid Association Tournament',
          startDate: new Date('2024-10-01T10:00:00.000Z').toISOString(),
          type: 'single_elimination',
          settings: {
            maxTeams: 16,
            minTeams: 8,
            teamSize: 2,
          },
          associationId: fakeAssociationId,
        })
        .expect(404);
    });
  });

  describe('T002 [P] [US1] Update tournament settings', () => {
    it('should update tournament name and description', async () => {
      const response = await request(app.getHttpServer())
        .put(`/tournaments/${tournamentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated Summer Championship',
          description: 'Updated description for the tournament',
        })
        .expect(200);

      expect(response.body.name).toBe('Updated Summer Championship');
      expect(response.body.description).toBe('Updated description for the tournament');
    });

    it('should update tournament settings', async () => {
      const response = await request(app.getHttpServer())
        .put(`/tournaments/${tournamentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          settings: {
            maxTeams: 32,
            minTeams: 16,
            teamSize: 2,
            pointsDistribution: {
              winner: 150,
              finalist: 100,
              semiFinalist: 75,
              quarterFinalist: 50,
            },
          },
        })
        .expect(200);

      expect(response.body.settings.maxTeams).toBe(32);
      expect(response.body.settings.minTeams).toBe(16);
      expect(response.body.settings.pointsDistribution.winner).toBe(150);
    });

    it('should update tournament dates', async () => {
      const newStartDate = new Date('2024-08-20T10:00:00.000Z');
      const newEndDate = new Date('2024-08-22T18:00:00.000Z');

      const response = await request(app.getHttpServer())
        .put(`/tournaments/${tournamentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          startDate: newStartDate.toISOString(),
          endDate: newEndDate.toISOString(),
        })
        .expect(200);

      expect(new Date(response.body.startDate).toISOString()).toBe(newStartDate.toISOString());
      expect(new Date(response.body.endDate).toISOString()).toBe(newEndDate.toISOString());
    });

    it('should update tournament status', async () => {
      const response = await request(app.getHttpServer())
        .put(`/tournaments/${tournamentId}/status?status=in_progress`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.status).toBe('in_progress');

      // Reset status for other tests
      await request(app.getHttpServer())
        .put(`/tournaments/${tournamentId}/status?status=upcoming`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });

    it('should fail to update non-existent tournament', async () => {
      const fakeTournamentId = '00000000-0000-0000-0000-000000000000';
      
      await request(app.getHttpServer())
        .put(`/tournaments/${fakeTournamentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Should Fail',
        })
        .expect(404);
    });
  });

  describe('T003 [P] [US1] Validate tournament constraints', () => {
    it('should retrieve tournament by ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/tournaments/${tournamentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.id).toBe(tournamentId);
      expect(response.body.name).toBe('Updated Summer Championship');
    });

    it('should list all tournaments', async () => {
      const response = await request(app.getHttpServer())
        .get('/tournaments')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('tournaments');
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('limit');
      expect(Array.isArray(response.body.tournaments)).toBe(true);
      expect(response.body.tournaments.length).toBeGreaterThan(0);
    });

    it('should filter tournaments by status', async () => {
      const response = await request(app.getHttpServer())
        .get('/tournaments?status=upcoming')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.tournaments.every((t: any) => t.status === 'upcoming')).toBe(true);
    });

    it('should paginate tournaments', async () => {
      const response = await request(app.getHttpServer())
        .get('/tournaments?page=1&limit=5')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.page).toBe(1);
      expect(response.body.limit).toBe(5);
      expect(response.body.tournaments.length).toBeLessThanOrEqual(5);
    });

    it('should fail with invalid pagination parameters', async () => {
      await request(app.getHttpServer())
        .get('/tournaments?page=0&limit=5')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);
    });

    it('should fail with invalid status value', async () => {
      const response = await request(app.getHttpServer())
        .put(`/tournaments/${tournamentId}/status?status=invalid_status`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);
    });

    it('should delete a tournament', async () => {
      // Create a temporary tournament to delete
      const createResponse = await request(app.getHttpServer())
        .post('/tournaments')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Tournament to Delete',
          startDate: new Date('2024-11-01T10:00:00.000Z').toISOString(),
          type: 'single_elimination',
          settings: {
            maxTeams: 8,
            minTeams: 4,
            teamSize: 2,
          },
          associationId: associationId,
        })
        .expect(201);

      const tempTournamentId = createResponse.body.id;

      await request(app.getHttpServer())
        .delete(`/tournaments/${tempTournamentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verify deletion
      await request(app.getHttpServer())
        .get(`/tournaments/${tempTournamentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });
});
