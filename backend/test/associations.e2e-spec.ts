import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

describe('Association System (US0) - E2E Tests', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;
  let authToken: string;
  let userId: string;
  let associationId: string;

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
        email: 'test-association@example.com',
        password: 'Test123!@#',
        firstName: 'Test',
        lastName: 'User',
      });

    userId = registerResponse.body.id;

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'test-association@example.com',
        password: 'Test123!@#',
      });

    authToken = loginResponse.body.access_token;
  });

  afterAll(async () => {
    // Clean up test data
    if (dataSource && dataSource.isInitialized) {
      await dataSource.query('DELETE FROM association_memberships WHERE "userId" = $1', [userId]);
      await dataSource.query('DELETE FROM associations WHERE id = $1', [associationId]);
      await dataSource.query('DELETE FROM "users" WHERE id = $1', [userId]);
    }
    await app.close();
  });

  describe('A001 [P] [US0] Create association with valid data', () => {
    it('should create an association with all required fields', async () => {
      const response = await request(app.getHttpServer())
        .post('/associations')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Padel Association',
          description: 'A test association for E2E testing',
          website: 'https://testpadel.com',
          isActive: true,
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Test Padel Association');
      expect(response.body.description).toBe('A test association for E2E testing');
      expect(response.body.website).toBe('https://testpadel.com');
      expect(response.body.isActive).toBe(true);
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('updatedAt');

      associationId = response.body.id;
    });

    it('should create an association with minimal required fields', async () => {
      const response = await request(app.getHttpServer())
        .post('/associations')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Minimal Association',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Minimal Association');
      expect(response.body.isActive).toBe(true); // Default value

      // Clean up
      await dataSource.query('DELETE FROM associations WHERE id = $1', [response.body.id]);
    });

    it('should fail to create association without name', async () => {
      await request(app.getHttpServer())
        .post('/associations')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          description: 'Missing name field',
        })
        .expect(400);
    });

    it('should retrieve the created association', async () => {
      const response = await request(app.getHttpServer())
        .get(`/associations/${associationId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.id).toBe(associationId);
      expect(response.body.name).toBe('Test Padel Association');
    });
  });

  describe('A002 [P] [US0] Add/remove player membership in an association', () => {
    it('should add a player as a member of the association', async () => {
      const response = await request(app.getHttpServer())
        .post(`/associations/${associationId}/memberships`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          userId: userId,
          role: 'member',
          category: 4,
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.associationId).toBe(associationId);
      expect(response.body.userId).toBe(userId);
      expect(response.body.role).toBe('member');
      expect(response.body.category).toBe(4);
      expect(response.body.points).toBe(0);
    });

    it('should fail to add the same player twice', async () => {
      await request(app.getHttpServer())
        .post(`/associations/${associationId}/memberships`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          userId: userId,
          role: 'member',
        })
        .expect(400);
    });

    it('should add a member without initial category', async () => {
      // Create another user
      const registerResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test-member2@example.com',
          password: 'Test123!@#',
          firstName: 'Member',
          lastName: 'Two',
        });

      const member2Id = registerResponse.body.id;

      const response = await request(app.getHttpServer())
        .post(`/associations/${associationId}/memberships`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          userId: member2Id,
          role: 'member',
        })
        .expect(201);

      expect(response.body.category).toBeNull();

      // Clean up
      await dataSource.query('DELETE FROM association_memberships WHERE "userId" = $1', [member2Id]);
      await dataSource.query('DELETE FROM "users" WHERE id = $1', [member2Id]);
    });

    it('should remove a player membership from the association', async () => {
      // First, create a temporary member
      const registerResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test-temp-member@example.com',
          password: 'Test123!@#',
          firstName: 'Temp',
          lastName: 'Member',
        });

      const tempUserId = registerResponse.body.id;

      await request(app.getHttpServer())
        .post(`/associations/${associationId}/memberships`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          userId: tempUserId,
          role: 'member',
        })
        .expect(201);

      // Now remove the membership
      await request(app.getHttpServer())
        .delete(`/associations/${associationId}/memberships/${tempUserId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verify membership is removed
      await request(app.getHttpServer())
        .get(`/associations/${associationId}/members/${tempUserId}/category`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      // Clean up
      await dataSource.query('DELETE FROM "users" WHERE id = $1', [tempUserId]);
    });

    it('should fail to remove non-existent membership', async () => {
      const fakeUserId = '00000000-0000-0000-0000-000000000000';
      await request(app.getHttpServer())
        .delete(`/associations/${associationId}/memberships/${fakeUserId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('A003 [P] [US0] Set/get player category per association', () => {
    it('should set a player category for an association', async () => {
      const response = await request(app.getHttpServer())
        .put(`/associations/${associationId}/members/${userId}/category`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          category: 3,
        })
        .expect(200);

      expect(response.body.category).toBe(3);
    });

    it('should get a player category for an association', async () => {
      const response = await request(app.getHttpServer())
        .get(`/associations/${associationId}/members/${userId}/category`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.category).toBe(3);
    });

    it('should update player category from 3 to 2', async () => {
      const response = await request(app.getHttpServer())
        .put(`/associations/${associationId}/members/${userId}/category`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          category: 2,
        })
        .expect(200);

      expect(response.body.category).toBe(2);

      // Verify the change
      const getResponse = await request(app.getHttpServer())
        .get(`/associations/${associationId}/members/${userId}/category`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(getResponse.body.category).toBe(2);
    });

    it('should fail to set invalid category (below 1)', async () => {
      await request(app.getHttpServer())
        .put(`/associations/${associationId}/members/${userId}/category`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          category: 0,
        })
        .expect(400);
    });

    it('should fail to set invalid category (above 8)', async () => {
      await request(app.getHttpServer())
        .put(`/associations/${associationId}/members/${userId}/category`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          category: 9,
        })
        .expect(400);
    });

    it('should fail to set non-integer category', async () => {
      await request(app.getHttpServer())
        .put(`/associations/${associationId}/members/${userId}/category`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          category: 3.5,
        })
        .expect(400);
    });

    it('should fail to get category for non-existent membership', async () => {
      const fakeUserId = '00000000-0000-0000-0000-000000000000';
      await request(app.getHttpServer())
        .get(`/associations/${associationId}/members/${fakeUserId}/category`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });
});
