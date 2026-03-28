import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { app } from '../../src/index';
import { prisma } from '../../src/config/prisma';

describe('Auth API Integration Tests', () => {
  beforeAll(async () => {
    // Clean up database
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    // Clean up database
    await prisma.user.deleteMany();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new client successfully', async () => {
      const userData = {
        email: 'client@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+221771234567',
        role: 'CLIENT'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.email).toBe(userData.email);
      expect(response.body.data.firstName).toBe(userData.firstName);
      expect(response.body.data.role).toBe(userData.role);
    });

    it('should register a new provider successfully', async () => {
      const userData = {
        email: 'provider@example.com',
        password: 'password123',
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '+221772345678',
        role: 'PRESTATAIRE'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.role).toBe('PRESTATAIRE');

      // Check if provider profile was created
      const profile = await prisma.providerProfile.findUnique({
        where: { userId: response.body.data.id }
      });
      expect(profile).toBeTruthy();
    });

    it('should reject registration with existing email', async () => {
      const userData = {
        email: 'duplicate@example.com',
        password: 'password123',
        firstName: 'Duplicate',
        lastName: 'User',
        role: 'CLIENT'
      };

      // First registration
      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Duplicate registration
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Email déjà utilisé');
    });

    it('should validate required fields', async () => {
      const invalidData = {
        email: 'invalid',
        password: '123', // Too short
        firstName: '',
        lastName: 'Doe'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('POST /api/auth/login', () => {
    beforeAll(async () => {
      // Create a test user
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'login@example.com',
          password: 'password123',
          firstName: 'Login',
          lastName: 'Test',
          role: 'CLIENT'
        });
    });

    it('should login successfully with correct credentials', async () => {
      const loginData = {
        email: 'login@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user.email).toBe(loginData.email);
    });

    it('should reject login with wrong password', async () => {
      const loginData = {
        email: 'login@example.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Identifiants invalides');
    });

    it('should reject login with non-existent email', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/profile', () => {
    let authToken: string;

    beforeAll(async () => {
      // Create and login a user
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'profile@example.com',
          password: 'password123',
          firstName: 'Profile',
          lastName: 'Test',
          role: 'CLIENT'
        });

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'profile@example.com',
          password: 'password123'
        });

      authToken = loginResponse.body.data.token;
    });

    it('should return user profile with authentication', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe('profile@example.com');
      expect(response.body.data.firstName).toBe('Profile');
    });

    it('should reject profile access without authentication', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should reject profile access with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});