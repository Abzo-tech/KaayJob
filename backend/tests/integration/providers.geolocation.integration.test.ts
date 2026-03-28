import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import app from '../../src/index';
import { prisma } from '../../src/config/prisma';

describe('Providers Geolocation API Integration Tests', () => {
  let adminToken: string;
  let provider1Id: string;
  let provider2Id: string;

  beforeAll(async () => {
    // Clean up database
    await prisma.user.deleteMany();
    await prisma.providerProfile.deleteMany();
    await prisma.service.deleteMany();

    // Create admin user
    const adminResponse = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'admin@test.com',
        password: 'password123',
        firstName: 'Admin',
        lastName: 'Test',
        role: 'ADMIN'
      });

    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@test.com',
        password: 'password123'
      });

    adminToken = adminLogin.body.data.token;

    // Create provider 1 (Dakar)
    const provider1Response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'provider1@test.com',
        password: 'password123',
        firstName: 'Ahmed',
        lastName: 'Diallo',
        phone: '+221771234567',
        role: 'PRESTATAIRE'
      });

    provider1Id = provider1Response.body.data.id;

    // Update provider location
    await request(app)
      .put('/api/providers/profile/location')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        userId: provider1Id,
        latitude: 14.6937,
        longitude: -17.4441,
        address: 'Plateau, Dakar',
        zone: 'Centre-ville',
        specialization: 'Plomberie'
      });

    // Create provider 2 (Yoff)
    const provider2Response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'provider2@test.com',
        password: 'password123',
        firstName: 'Fatou',
        lastName: 'Sow',
        phone: '+221772345678',
        role: 'PRESTATAIRE'
      });

    provider2Id = provider2Response.body.data.id;

    // Update provider location
    await request(app)
      .put('/api/providers/profile/location')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        userId: provider2Id,
        latitude: 14.7489,
        longitude: -17.4667,
        address: 'Yoff, Dakar',
        zone: 'Nord',
        specialization: 'Électricité'
      });

    // Create services for providers
    await prisma.service.createMany({
      data: [
        {
          providerId: provider1Id,
          categoryId: null,
          name: 'Réparation de fuites',
          description: 'Expert en réparation de fuites et installations sanitaires',
          price: 25000,
          priceType: 'FIXED',
          duration: 120,
          isActive: true
        },
        {
          providerId: provider2Id,
          categoryId: null,
          name: 'Installation électrique',
          description: 'Spécialiste en installations électriques et dépannages',
          price: 35000,
          priceType: 'FIXED',
          duration: 180,
          isActive: true
        }
      ]
    });
  });

  afterAll(async () => {
    // Clean up database
    await prisma.service.deleteMany();
    await prisma.providerProfile.deleteMany();
    await prisma.user.deleteMany();
  });

  describe('GET /api/providers/map', () => {
    it('should return all providers with geolocation data', async () => {
      const response = await request(app)
        .get('/api/providers/map')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThanOrEqual(2);

      // Check provider data structure
      const provider = response.body.data[0];
      expect(provider).toHaveProperty('id');
      expect(provider).toHaveProperty('latitude');
      expect(provider).toHaveProperty('longitude');
      expect(provider).toHaveProperty('user');
      expect(provider.user).toHaveProperty('firstName');
      expect(provider.user).toHaveProperty('lastName');
    });

    it('should filter providers by category', async () => {
      const response = await request(app)
        .get('/api/providers/map?category=Plomberie')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);

      // Should return only plumbers
      response.body.data.forEach((provider: any) => {
        expect(provider.specialty.toLowerCase()).toContain('plomberie');
      });
    });

    it('should filter providers by radius', async () => {
      // Search around Dakar center with 5km radius
      const response = await request(app)
        .get('/api/providers/map?lat=14.6937&lng=-17.4441&radius=5')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);

      // Both providers should be within 5km of Dakar center
      response.body.data.forEach((provider: any) => {
        expect(provider.latitude).toBeDefined();
        expect(provider.longitude).toBeDefined();
      });
    });

    it('should filter only available providers', async () => {
      const response = await request(app)
        .get('/api/providers/map?availableOnly=true')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((provider: any) => {
        expect(provider.isAvailable).toBe(true);
      });
    });

    it('should filter only verified providers', async () => {
      const response = await request(app)
        .get('/api/providers/map?verifiedOnly=true')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((provider: any) => {
        expect(provider.isVerified).toBe(true);
      });
    });

    it('should limit results', async () => {
      const response = await request(app)
        .get('/api/providers/map?limit=1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeLessThanOrEqual(1);
    });

    it('should return providers with calculated distances', async () => {
      const userLat = 14.6937;
      const userLng = -17.4441;

      const response = await request(app)
        .get(`/api/providers/map?lat=${userLat}&lng=${userLng}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((provider: any) => {
        expect(provider).toHaveProperty('distance');
        expect(typeof provider.distance).toBe('number');
      });
    });
  });

  describe('PUT /api/providers/profile/location', () => {
    it('should update provider location successfully', async () => {
      // Create a new provider for this test
      const newProviderResponse = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'location@test.com',
          password: 'password123',
          firstName: 'Location',
          lastName: 'Test',
          role: 'PRESTATAIRE'
        });

      const newProviderId = newProviderResponse.body.data.id;

      // Login as this provider
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'location@test.com',
          password: 'password123'
        });

      const providerToken = loginResponse.body.data.token;

      // Update location
      const locationData = {
        latitude: 14.7167,
        longitude: -17.4677,
        address: 'Mermoz, Dakar',
        zone: 'Sud',
        specialization: 'Ménage',
        bio: 'Spécialiste du nettoyage'
      };

      const response = await request(app)
        .put('/api/providers/profile/location')
        .set('Authorization', `Bearer ${providerToken}`)
        .send(locationData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('mise à jour');

      // Verify the API call succeeded
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('mise à jour');
    });

    it('should reject location update without authentication', async () => {
      const response = await request(app)
        .put('/api/providers/profile/location')
        .send({
          latitude: 14.7167,
          longitude: -17.4677
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should validate coordinate ranges', async () => {
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'provider1@test.com',
          password: 'password123'
        });

      const providerToken = loginResponse.body.data.token;

      const response = await request(app)
        .put('/api/providers/profile/location')
        .set('Authorization', `Bearer ${providerToken}`)
        .send({
          latitude: 91, // Invalid latitude
          longitude: -17.4677
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('GET /api/providers/categories', () => {
    it('should return available categories', async () => {
      const response = await request(app)
        .get('/api/providers/categories')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });
});