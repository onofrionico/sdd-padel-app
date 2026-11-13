import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

describe('Player Registration (US2) - E2E Tests', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;
  let authToken: string;
  let userId: string;
  let associationId: string;
  let playerEmail: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    await app.init();

    dataSource = moduleFixture.get<DataSource>(DataSource);

    // Create an association for player registration
    const adminRegisterResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'admin-player@example.com',
        password: 'Admin123!@#',
        firstName: 'Admin',
        lastName: 'User',
      });

    const adminLoginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'admin-player@example.com',
        password: 'Admin123!@#',
      });

    const adminToken = adminLoginResponse.body.access_token;

    const associationResponse = await request(app.getHttpServer())
      .post('/associations')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Player Registration Association',
        description: 'Association for player registration testing',
      });

    associationId = associationResponse.body.id;
  });

  afterAll(async () => {
    // Clean up test data
    if (dataSource && dataSource.isInitialized) {
      await dataSource.query('DELETE FROM association_memberships WHERE "associationId" = $1', [associationId]);
      await dataSource.query('DELETE FROM associations WHERE id = $1', [associationId]);
      if (userId) {
        await dataSource.query('DELETE FROM "users" WHERE id = $1', [userId]);
      }
    }
    await app.close();
  });

  describe('T009 [P] [US2] Register new player', () => {
    it('should register a new player with complete profile', async () => {
      const uniqueEmail = `newplayer-${Date.now()}@example.com`;
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: uniqueEmail,
          password: 'Player123!@#',
          firstName: 'New',
          lastName: 'Player',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe(uniqueEmail);
      expect(response.body.firstName).toBe('New');
      expect(response.body.lastName).toBe('Player');
      expect(response.body).not.toHaveProperty('password');

      userId = response.body.id;

      // Login to get auth token
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: playerEmail,
          password: 'Player123!@#',
        })
        .expect(200);

      authToken = loginResponse.body.access_token;
      expect(loginResponse.body).toHaveProperty('access_token');
    });

    it('should register player in an association', async () => {
      const response = await request(app.getHttpServer())
        .post('/users/me/player-registration')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          associationId: associationId,
          category: 5,
        })
        .expect(201);

      expect(response.body.associationId).toBe(associationId);
      expect(response.body.userId).toBe(userId);
      expect(response.body.category).toBe(5);
      expect(response.body.role).toBe('member');
    });

    it('should fail to register same player twice in same association', async () => {
      await request(app.getHttpServer())
        .post('/users/me/player-registration')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          associationId: associationId,
          category: 5,
        })
        .expect(400);
    });

    it('should fail to register with invalid category', async () => {
      // Create another association
      const tempRegisterResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'temp-admin@example.com',
          password: 'Temp123!@#',
          firstName: 'Temp',
          lastName: 'Admin',
        });

      const tempLoginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'temp-admin@example.com',
          password: 'Temp123!@#',
        });

      const tempToken = tempLoginResponse.body.access_token;

      const tempAssocResponse = await request(app.getHttpServer())
        .post('/associations')
        .set('Authorization', `Bearer ${tempToken}`)
        .send({
          name: 'Temp Association',
        });

      const tempAssocId = tempAssocResponse.body.id;

      await request(app.getHttpServer())
        .post('/users/me/player-registration')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          associationId: tempAssocId,
          category: 10,
        })
        .expect(400);

      // Clean up
      await dataSource.query('DELETE FROM associations WHERE id = $1', [tempAssocId]);
      await dataSource.query('DELETE FROM "users" WHERE email = $1', ['temp-admin@example.com']);
    });
  });

  describe('T010 [P] [US2] Update player category per association', () => {
    it('should update player category for an association', async () => {
      const response = await request(app.getHttpServer())
        .put(`/users/me/associations/${associationId}/category`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          category: 4,
        })
        .expect(200);

      expect(response.body.category).toBe(4);
    });

    it('should verify category was updated', async () => {
      const response = await request(app.getHttpServer())
        .get('/users/me/player-profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const membership = response.body.associationMemberships.find(
        (m: any) => m.associationId === associationId
      );

      expect(membership).toBeDefined();
      expect(membership.category).toBe(4);
    });

    it('should update category multiple times', async () => {
      await request(app.getHttpServer())
        .put(`/users/me/associations/${associationId}/category`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          category: 3,
        })
        .expect(200);

      const response = await request(app.getHttpServer())
        .put(`/users/me/associations/${associationId}/category`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          category: 2,
        })
        .expect(200);

      expect(response.body.category).toBe(2);
    });

    it('should fail to update with invalid category', async () => {
      await request(app.getHttpServer())
        .put(`/users/me/associations/${associationId}/category`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          category: 0,
        })
        .expect(400);

      await request(app.getHttpServer())
        .put(`/users/me/associations/${associationId}/category`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          category: 9,
        })
        .expect(400);
    });
  });

  describe('T011 [P] [US2] View player profile', () => {
    it('should view complete player profile', async () => {
      const response = await request(app.getHttpServer())
        .get('/users/me/player-profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.id).toBe(userId);
      expect(response.body.email).toBe(playerEmail);
      expect(response.body.firstName).toBe('New');
      expect(response.body.lastName).toBe('Player');
      expect(response.body).toHaveProperty('associationMemberships');
      expect(Array.isArray(response.body.associationMemberships)).toBe(true);
      expect(response.body.associationMemberships.length).toBeGreaterThan(0);
    });

    it('should view player profile with association details', async () => {
      const response = await request(app.getHttpServer())
        .get('/users/me/player-profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const membership = response.body.associationMemberships.find(
        (m: any) => m.associationId === associationId
      );

      expect(membership).toBeDefined();
      expect(membership.category).toBe(2);
      expect(membership).toHaveProperty('association');
      expect(membership.association.name).toBe('Player Registration Association');
    });

    it('should update player profile information', async () => {
      const response = await request(app.getHttpServer())
        .put('/users/me/player-profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          playingHand: 'right',
          playingStyle: 'offensive',
        })
        .expect(200);

      expect(response.body.playingHand).toBe('right');
      expect(response.body.playingStyle).toBe('offensive');
    });

    it('should view updated profile information', async () => {
      const response = await request(app.getHttpServer())
        .get('/users/me/player-profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.playingHand).toBe('right');
      expect(response.body.playingStyle).toBe('offensive');
    });

    it('should view player statistics', async () => {
      const response = await request(app.getHttpServer())
        .get('/users/me/statistics')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('playerId');
      expect(response.body).toHaveProperty('totalPoints');
      expect(response.body).toHaveProperty('totalTournaments');
      expect(response.body).toHaveProperty('totalMatches');
      expect(response.body).toHaveProperty('matchesWon');
      expect(response.body).toHaveProperty('matchesLost');
      expect(response.body).toHaveProperty('winRate');
      expect(response.body).toHaveProperty('categoriesPlayed');
      expect(Array.isArray(response.body.categoriesPlayed)).toBe(true);
    });

    it('should fail to view profile without authentication', async () => {
      await request(app.getHttpServer())
        .get('/users/me/player-profile')
        .expect(401);
    });
  });
});
