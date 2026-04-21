/**
 * Tests End-to-End - Toutes les endpoints de l'API KaayJob
 * Utilise supertest pour tester les routes HTTP
 */

import request from 'supertest';
import { app } from '../../index';
import { prisma } from '../../config/prisma';
import { pool } from '../../config/database';
import bcrypt from 'bcryptjs';

const API_BASE = '/api';

const agent = request.agent(app);
let createdSubscriptionPlan = false;

interface TestUser {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  token?: string;
}

interface TestData {
  admin: TestUser | null;
  client: TestUser | null;
  provider: TestUser | null;
  providerProfile: any;
  category: any;
  service: any;
  booking: any;
  subscriptionPlan: any;
}

const testData: TestData = {
  admin: null,
  client: null,
  provider: null,
  providerProfile: null,
  category: null,
  service: null,
  booking: null,
  subscriptionPlan: null,
};

function generateTestEmail(prefix: string): string {
  return `${prefix}.${Date.now()}.${Math.random().toString(36).substring(7)}@test.com`;
}

async function createTestUser(role: string, roleSpecificData: any = {}): Promise<TestUser> {
  const email = generateTestEmail(role);
  const hashedPassword = await bcrypt.hash('TestPassword123!', 10);
  
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName: 'Test',
      lastName: role,
      phone: '+221771234567',
      role,
      isVerified: true,
      isActive: true,
      ...roleSpecificData,
    },
  });

  return {
    id: user.id,
    email: user.email,
    password: 'TestPassword123!',
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
  };
}

async function loginUser(email: string, password: string): Promise<string> {
  const response = await agent
    .post(`${API_BASE}/auth/login`)
    .send({ email, password });
  
  return response.body.data?.token || response.body.token;
}

async function cleanupUser(email: string) {
  try {
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { email } });
      if (!user) return;

      if (user.role === 'PRESTATAIRE') {
        await tx.providerProfile.deleteMany({ where: { userId: user.id } });
        await tx.service.deleteMany({ 
          where: { providerId: user.id }
        }).catch(() => {});
      }
      
      await tx.booking.deleteMany({ where: { clientId: user.id } }).catch(() => {});
      await tx.review.deleteMany({ where: { clientId: user.id } });
      await tx.payment.deleteMany({ where: { userId: user.id } });
      await tx.notification.deleteMany({ where: { userId: user.id } });
      await tx.user.delete({ where: { id: user.id } });
    });
  } catch (error) {
    console.log(`⚠️ Cleanup warning for ${email}:`, error);
  }
}

async function cleanupCategory(slug: string) {
  try {
    await prisma.category.delete({ where: { slug } }).catch(() => {});
  } catch (error) {
    // Ignore
  }
}

describe('🔴 Tests End-to-End - API KaayJob', () => {
  beforeAll(async () => {
    console.log('\n========================================');
    console.log('🧪 Tests E2E - Toutes les Endpoints');
    console.log('========================================\n');

    // Créer un admin
    testData.admin = await createTestUser('ADMIN');
    testData.admin.token = await loginUser(testData.admin.email, testData.admin.password);

    // Créer un client
    testData.client = await createTestUser('CLIENT');
    testData.client.token = await loginUser(testData.client.email, testData.client.password);

    // Créer un prestataire
    testData.provider = await createTestUser('PRESTATAIRE');
    
    // Créer le profil prestataire
    const profile = await prisma.providerProfile.create({
      data: {
        userId: testData.provider.id,
        businessName: 'Test Business',
        specialty: 'Plomberie',
        bio: 'Test provider',
        hourlyRate: 15000,
        yearsExperience: 5,
        location: 'Dakar',
        address: '123 Rue Test',
        city: 'Dakar',
        region: 'Dakar',
        postalCode: '12000',
        serviceRadius: 15,
        latitude: 14.7167,
        longitude: -17.4677,
        isAvailable: true,
        rating: 4.5,
        totalReviews: 0,
        totalBookings: 0,
        isVerified: true,
      },
    });
    testData.providerProfile = profile;
    testData.provider.token = await loginUser(testData.provider.email, testData.provider.password);

    // Créer une catégorie
    const category = await prisma.category.create({
      data: {
        name: 'Test Category',
        slug: `test-category-${Date.now()}`,
        description: 'Test category description',
        icon: '🧪',
        isActive: true,
      },
    });
    testData.category = category;

    testData.subscriptionPlan = await prisma.subscriptionPlan.findFirst({
      where: { isActive: true },
      orderBy: { price: 'asc' },
    });

    if (!testData.subscriptionPlan) {
      createdSubscriptionPlan = true;
      testData.subscriptionPlan = await prisma.subscriptionPlan.create({
        data: {
          name: 'Plan E2E',
          slug: `plan-e2e-${Date.now()}`,
          description: 'Plan de test E2E',
          price: 9900,
          duration: 30,
          features: ['support', 'featured-profile'],
          isActive: true,
          displayOrder: 999,
        },
      });
    }

    console.log('✅ Test data created');
  });

  afterAll(async () => {
    console.log('\n========================================');
    console.log('🧹 Nettoyage des données de test');
    console.log('========================================\n');

    if (testData.booking) {
      await prisma.booking.deleteMany({ 
        where: { id: testData.booking.id } 
      }).catch(() => {});
    }
    if (testData.service) {
      await prisma.service.deleteMany({ 
        where: { id: testData.service.id } 
      }).catch(() => {});
    }
    const provider = testData.provider;
    if (testData.providerProfile && provider) {
      await prisma.providerProfile.deleteMany({ 
        where: { userId: provider.id } 
      }).catch(() => {});
    }
    if (testData.category) {
      await prisma.category.delete({ 
        where: { id: testData.category.id } 
      }).catch(() => {});
    }
    if (createdSubscriptionPlan && testData.subscriptionPlan) {
      await prisma.subscriptionPlan.deleteMany({
        where: { id: testData.subscriptionPlan.id },
      }).catch(() => {});
    }
    if (testData.provider) await cleanupUser(testData.provider.email);
    if (testData.client) await cleanupUser(testData.client.email);
    if (testData.admin) await cleanupUser(testData.admin.email);

    await prisma.$disconnect();
    await pool.end().catch(() => {});
  });

  // ========================================
  // HEALTH & PUBLIC ENDPOINTS
  // ========================================

  describe('1. Health & Public Routes', () => {
    it('GET / - Racine', async () => {
      const response = await agent.get('/');
      expect(response.status).toBe(200);
      expect(response.text).toContain('KaayJob');
    });

    it('GET /api/health - Health check', async () => {
      const response = await agent.get(`${API_BASE}/health`);
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  // ========================================
  // AUTH ENDPOINTS
  // ========================================

  describe('2. Auth Endpoints', () => {
    it('POST /api/auth/register - Inscription client', async () => {
      const email = generateTestEmail('new-client');
      const response = await agent
        .post(`${API_BASE}/auth/register`)
        .send({
          email,
          password: 'Password123!',
          firstName: 'New',
          lastName: 'Client',
          phone: '+221771234567',
          role: 'client',
        });

      expect([201, 400]).toContain(response.status);
      
      await cleanupUser(email);
    });

    it('POST /api/auth/login - Connexion', async () => {
      const response = await agent
        .post(`${API_BASE}/auth/login`)
        .send({
          email: testData.client!.email,
          password: testData.client!.password,
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data?.token).toBeDefined();
    });

    it('POST /api/auth/login - Mauvais mot de passe', async () => {
      const response = await agent
        .post(`${API_BASE}/auth/login`)
        .send({
          email: testData.client!.email,
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
    });

    it('GET /api/auth/me - Profil connecté (avec token)', async () => {
      const response = await agent
        .get(`${API_BASE}/auth/me`)
        .set('Authorization', `Bearer ${testData.client!.token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('PUT /api/auth/password - Changer mot de passe', async () => {
      const response = await agent
        .put(`${API_BASE}/auth/password`)
        .set('Authorization', `Bearer ${testData.client!.token}`)
        .send({
          currentPassword: testData.client!.password,
          newPassword: 'NewPassword123!',
        });

      expect(response.status).toBe(200);
    });

    it('POST /api/auth/logout - Déconnexion', async () => {
      const response = await agent
        .post(`${API_BASE}/auth/logout`)
        .set('Authorization', `Bearer ${testData.client!.token}`);

      expect(response.status).toBe(200);
    });
  });

  // ========================================
  // CATEGORIES ENDPOINTS
  // ========================================

  describe('3. Categories Endpoints', () => {
    it('GET /api/categories - Liste catégories', async () => {
      const response = await agent.get(`${API_BASE}/categories`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('GET /api/categories/:id - Une catégorie', async () => {
      const response = await agent.get(`${API_BASE}/categories/${testData.category!.id}`);
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('POST /api/categories - Créer catégorie (admin)', async () => {
      const slug = `new-cat-${Date.now()}`;
      const response = await agent
        .post(`${API_BASE}/categories`)
        .set('Authorization', `Bearer ${testData.admin!.token}`)
        .send({
          name: 'New Category',
          slug,
          description: 'Description',
          icon: '⭐',
          isActive: true,
        });

      expect(response.status).toBe(201);
      await cleanupCategory(slug);
    });

    it('PUT /api/categories/:id - Modifier catégorie (admin)', async () => {
      const response = await agent
        .put(`${API_BASE}/categories/${testData.category!.id}`)
        .set('Authorization', `Bearer ${testData.admin!.token}`)
        .send({
          name: 'Updated Category',
        });

      expect(response.status).toBe(200);
    });
  });

  // ========================================
  // PROVIDERS ENDPOINTS
  // ========================================

  describe('4. Providers Endpoints', () => {
    it('GET /api/providers - Liste prestataires', async () => {
      const response = await agent.get(`${API_BASE}/providers`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(
        response.body.data.some((provider: any) => provider.userId === testData.provider!.id),
      ).toBe(true);
    });

    it('GET /api/providers/map - Prestataires pour la carte', async () => {
      const response = await agent.get(`${API_BASE}/providers/map`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(
        response.body.data.some((provider: any) => provider.userId === testData.provider!.id),
      ).toBe(true);
    });

    it('GET /api/providers/:id - Détails prestataire', async () => {
      const response = await agent.get(
        `${API_BASE}/providers/${testData.providerProfile!.id}`,
      );
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('GET /api/providers/me - Mon profil prestataire', async () => {
      const response = await agent
        .get(`${API_BASE}/providers/me`)
        .set('Authorization', `Bearer ${testData.provider!.token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('GET /api/providers/profile - ProfilPrestataire', async () => {
      const response = await agent
        .get(`${API_BASE}/providers/profile`)
        .set('Authorization', `Bearer ${testData.provider!.token}`);

      expect(response.status).toBe(200);
    });

    it('PUT /api/providers/profile - Mettre à jour profil', async () => {
      const response = await agent
        .put(`${API_BASE}/providers/profile`)
        .set('Authorization', `Bearer ${testData.provider!.token}`)
        .send({
          bio: 'Updated bio',
        });

      expect(response.status).toBe(200);
    });

    it('PUT /api/providers/profile/availability - Disponibilité', async () => {
      const response = await agent
        .put(`${API_BASE}/providers/profile/availability`)
        .set('Authorization', `Bearer ${testData.provider!.token}`)
        .send({ isAvailable: false });

      expect(response.status).toBe(200);
    });
  });

  // ========================================
  // SERVICES ENDPOINTS
  // ========================================

  describe('5. Services Endpoints', () => {
    it('GET /api/services - Liste services', async () => {
      const response = await agent.get(`${API_BASE}/services`);
      expect(response.status).toBe(200);
    });

    it('POST /api/services - Créer service (prestataire)', async () => {
      const response = await agent
        .post(`${API_BASE}/services`)
        .set('Authorization', `Bearer ${testData.provider!.token}`)
        .send({
          name: 'Test Service',
          description: 'Test service description',
          price: 5000,
          categoryId: testData.category!.id,
          providerId: testData.provider!.id,
          duration: 60,
          isActive: true,
        });

      expect(response.status).toBe(201);
      
      if (response.body.data?.id) {
        testData.service = response.body.data;
      }
    });

    it('GET /api/services/provider/:providerId - Services prestataire', async () => {
      const response = await agent
        .get(`${API_BASE}/services/provider/${testData.provider!.id}`);
      expect(response.status).toBe(200);
    });
  });

  // ========================================
  // BOOKINGS ENDPOINTS
  // ========================================

  describe('6. Bookings Endpoints', () => {
    let serviceId: string;
    const tomorrow = new Date(Date.now() + 86400000);
    const bookingDate = tomorrow.toISOString().slice(0, 10);

    beforeAll(() => {
      serviceId = testData.service!.id;
    });

    it('GET /api/bookings/me - Mes réservations (client)', async () => {
      const response = await agent
        .get(`${API_BASE}/bookings/me`)
        .set('Authorization', `Bearer ${testData.client!.token}`);

      expect(response.status).toBe(200);
    });

    it('POST /api/bookings - Créer réservation', async () => {
      const response = await agent
        .post(`${API_BASE}/bookings`)
        .set('Authorization', `Bearer ${testData.client!.token}`)
        .send({
          serviceId,
          date: bookingDate,
          time: '10:30',
          address: 'Test Address',
          city: 'Dakar',
          phone: '+221771234567',
          notes: 'Test notes',
        });

      expect(response.status).toBe(201);
      
      if (response.body.data?.id) {
        testData.booking = response.body.data;
      }
    });

    it('GET /api/bookings/:id - Détails réservation', async () => {
      if (!testData.booking) {
        console.log('⚠️ Skip: No booking created');
        return;
      }
      
      const response = await agent
        .get(`${API_BASE}/bookings/${testData.booking.id}`)
        .set('Authorization', `Bearer ${testData.client!.token}`);

      expect(response.status).toBe(200);
    });

    it('PUT /api/bookings/:id/status - Statut réservation', async () => {
      if (!testData.booking) {
        console.log('⚠️ Skip: No booking created');
        return;
      }

      const response = await agent
        .put(`${API_BASE}/bookings/${testData.booking.id}/status`)
        .set('Authorization', `Bearer ${testData.provider!.token}`)
        .send({ status: 'CONFIRMED' });

      expect([200, 400]).toContain(response.status);
    });
  });

  // ========================================
  // REVIEWS ENDPOINTS
  // ========================================

  describe('7. Reviews Endpoints', () => {
    it('GET /api/reviews/service/:serviceId - Avis service', async () => {
      const response = await agent
        .get(`${API_BASE}/reviews/service/${testData.service!.id}`);
      expect(response.status).toBe(200);
    });

    it('GET /api/reviews/provider/:providerId - Avis prestataire', async () => {
      const response = await agent
        .get(`${API_BASE}/reviews/provider/${testData.provider!.id}`);
      expect(response.status).toBe(200);
    });
  });

  // ========================================
  // SUBSCRIPTIONS ENDPOINTS
  // ========================================

  describe('8. Subscriptions Endpoints', () => {
    it('GET /api/subscriptions/plans - Plans disponibles', async () => {
      const response = await agent.get(`${API_BASE}/subscriptions/plans`);
      expect(response.status).toBe(200);
    });

    it('GET /api/subscriptions/plans/:id - Détails plan', async () => {
      const response = await agent
        .get(`${API_BASE}/subscriptions/plans/${testData.subscriptionPlan!.id}`);
      expect(response.status).toBe(200);
    });
  });

  // ========================================
  // NOTIFICATIONS ENDPOINTS
  // ========================================

  describe('9. Notifications Endpoints', () => {
    it('GET /api/notifications - Liste notifications', async () => {
      const response = await agent
        .get(`${API_BASE}/notifications`)
        .set('Authorization', `Bearer ${testData.client!.token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('POST /api/notifications/test - Créer notification test', async () => {
      const response = await agent
        .post(`${API_BASE}/notifications/test`)
        .set('Authorization', `Bearer ${testData.client!.token}`)
        .send({
          title: 'Test',
          message: 'Test message',
        });

      expect(response.status).toBe(200);
    });
  });

  // ========================================
  // USERS ENDPOINTS
  // ========================================

  describe('10. Users Endpoints', () => {
    it('GET /api/users/profile - Profil utilisateur', async () => {
      const response = await agent
        .get(`${API_BASE}/users/profile`)
        .set('Authorization', `Bearer ${testData.client!.token}`);

      expect(response.status).toBe(200);
    });
  });

  // ========================================
  // PAYMENTS ENDPOINTS
  // ========================================

  describe('11. Payments Endpoints', () => {
    it('GET /api/payments/me - Mes paiements', async () => {
      const response = await agent
        .get(`${API_BASE}/payments/me`)
        .set('Authorization', `Bearer ${testData.provider!.token}`);

      expect(response.status).toBe(200);
    });
  });

  // ========================================
  // ADMIN ENDPOINTS
  // ========================================

  describe('12. Admin Endpoints', () => {
    it('GET /api/admin/users - Liste utilisateurs', async () => {
      const response = await agent
        .get(`${API_BASE}/admin/users`)
        .set('Authorization', `Bearer ${testData.admin!.token}`);

      expect(response.status).toBe(200);
    });

    it('PUT /api/admin/users/:id/verify - Vérification admin synchronise le statut public', async () => {
      const providerToVerify = await createTestUser('PRESTATAIRE', {
        isVerified: false,
      });

      await prisma.providerProfile.create({
        data: {
          userId: providerToVerify.id,
          businessName: 'Provider To Verify',
          specialty: 'Plomberie',
          bio: 'Prestataire à vérifier',
          hourlyRate: 12000,
          location: 'Dakar',
          latitude: 14.7167,
          longitude: -17.4677,
          isAvailable: true,
          isVerified: false,
        },
      });

      const response = await agent
        .put(`${API_BASE}/admin/users/${providerToVerify.id}/verify`)
        .set('Authorization', `Bearer ${testData.admin!.token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      const [updatedUser, updatedProfile] = await Promise.all([
        prisma.user.findUnique({ where: { id: providerToVerify.id } }),
        prisma.providerProfile.findUnique({ where: { userId: providerToVerify.id } }),
      ]);

      expect(updatedUser?.isVerified).toBe(true);
      expect(updatedProfile?.isVerified).toBe(true);

      await cleanupUser(providerToVerify.email);
    });

    it('GET /api/admin/services - Liste services', async () => {
      const response = await agent
        .get(`${API_BASE}/admin/services`)
        .set('Authorization', `Bearer ${testData.admin!.token}`);

      expect(response.status).toBe(200);
    });

    it('GET /api/admin/bookings - Liste réservations', async () => {
      const response = await agent
        .get(`${API_BASE}/admin/bookings`)
        .set('Authorization', `Bearer ${testData.admin!.token}`);

      expect(response.status).toBe(200);
    });

    it('GET /api/admin/categories - Liste catégories', async () => {
      const response = await agent
        .get(`${API_BASE}/admin/categories`)
        .set('Authorization', `Bearer ${testData.admin!.token}`);

      expect(response.status).toBe(200);
    });

    it('GET /api/admin/analytics - Statistiques', async () => {
      const response = await agent
        .get(`${API_BASE}/admin/analytics`)
        .set('Authorization', `Bearer ${testData.admin!.token}`);

      expect(response.status).toBe(200);
    });
  });

  // ========================================
  // ERROR HANDLING
  // ========================================

  describe('13. Error Handling', () => {
    it('GET /api/unknown - Route inexistante (404)', async () => {
      const response = await agent.get(`${API_BASE}/unknown`);
      expect(response.status).toBe(404);
    });

    it('GET /api/categories - Sans authentification admin (401)', async () => {
      const response = await agent
        .post(`${API_BASE}/categories`)
        .send({ name: 'Test' });

      expect(response.status).toBe(401);
    });
  });
});
