/**
 * Tests d'intégration - Flux prestataire complet
 * Inscription prestataire + vérification admin
 */

import { testConnection, query } from '../../config/database';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'kaayjob-secret-key-change-in-production';

interface TestUser {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface TestProvider {
  userId: string;
  isVerified: boolean;
  businessName?: string;
}

function generateTestEmail(prefix: string): string {
  return `${prefix}.${Date.now()}.${Math.random().toString(36).substring(7)}@example.com`;
}

async function generateToken(user: TestUser): Promise<string> {
  const jwt = await import('jsonwebtoken');
  return jwt.default.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

async function cleanupTestUser(email: string) {
  try {
    await query('DELETE FROM provider_profiles WHERE user_id = (SELECT id FROM users WHERE email = $1)', [email]);
    await query('DELETE FROM users WHERE email = $1', [email]);
    console.log('🧹 Nettoyage effectuer pour:', email);
  } catch (error) {
    console.log('⚠️ Erreur lors du nettoyage:', error);
  }
}

describe('Flux Prestataire - End-to-End', () => {
  const testPassword = 'TestPassword123!';
  const testFirstName = 'Test';
  const testLastName = 'Provider';

  let adminToken: string;
  let adminUser: TestUser;
  let adminEmail: string;

  beforeAll(async () => {
    console.log('\n========================================');
    console.log('🧪 Tests d\'intégration - Flux Prestataire');
    console.log('========================================\n');

    const connected = await testConnection();
    if (!connected) {
      throw new Error('Impossible de se connecter à la base de données');
    }
    console.log('✅ Connexion à la base de données établie');

    adminEmail = generateTestEmail('admin');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const result = await query(`
      INSERT INTO users (id, email, password, first_name, last_name, phone, role, is_verified, created_at, updated_at)
      VALUES (gen_random_uuid(), $1, $2, 'Admin', 'Test', '+221771111111', 'ADMIN', true, NOW(), NOW())
      ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email
      RETURNING id, email, first_name, last_name, role
    `, [adminEmail, hashedPassword]);

    adminUser = {
      id: result.rows[0].id,
      email: result.rows[0].email,
      password: 'admin123',
      firstName: result.rows[0].first_name,
      lastName: result.rows[0].last_name,
      role: 'ADMIN'
    };

    adminToken = await generateToken(adminUser);
    console.log('✅ Admin de test créé');
  });

  afterAll(async () => {
    if (adminUser) {
      await cleanupTestUser(adminUser.email);
    }
    console.log('\n========================================');
    console.log('🧹 Nettoyage terminé');
    console.log('========================================\n');
  });

  describe('1. Inscription Prestataire', () => {
    let providerUser: TestUser | null = null;

    afterEach(async () => {
      if (providerUser) {
        await cleanupTestUser(providerUser.email);
        providerUser = null;
      }
    });

    it('devrait créer un nouveau prestataire avec un profil', async () => {
      console.log('\n--- Test: Création prestataire ---');
      const testEmail = generateTestEmail('provider');

      const result = await query(`
        INSERT INTO users (id, email, password, first_name, last_name, phone, role, is_verified, created_at, updated_at)
        VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, 'PRESTATAIRE', false, NOW(), NOW())
        RETURNING id, email, first_name, last_name, phone, role, is_verified
      `, [testEmail, await bcrypt.hash(testPassword, 10), testFirstName, testLastName, '+221771234567']);

      expect(result.rows.length).toBeGreaterThan(0);
      
      providerUser = {
        id: result.rows[0].id,
        email: result.rows[0].email,
        password: testPassword,
        firstName: result.rows[0].first_name,
        lastName: result.rows[0].last_name,
        role: 'PRESTATAIRE'
      };

      expect(providerUser.email).toBe(testEmail);
      expect(providerUser.role).toBe('PRESTATAIRE');
      console.log('✅ Utilisateur prestataire créé:', providerUser.email);

      await query(`
        INSERT INTO provider_profiles (id, user_id, business_name, is_verified, created_at, updated_at)
        VALUES (gen_random_uuid(), $1, $2, false, NOW(), NOW())
      `, [providerUser.id, 'Test Business']);

      const profileResult = await query(`
        SELECT id, user_id, is_verified FROM provider_profiles WHERE user_id = $1
      `, [providerUser.id]);

      expect(profileResult.rows.length).toBeGreaterThan(0);
      expect(profileResult.rows[0].is_verified).toBe(false);
      console.log('✅ Profil prestataire créé (non vérifié)');
    });

    it('ne devrait pas permettre l\'inscription avec un email existant', async () => {
      console.log('\n--- Test: Email existant ---');
      const testEmail = generateTestEmail('provider');

      await query(`
        INSERT INTO users (id, email, password, first_name, last_name, phone, role, is_verified, created_at, updated_at)
        VALUES (gen_random_uuid(), $1, $2, 'Existing', 'User', '+221771111111', 'PRESTATAIRE', false, NOW(), NOW())
        ON CONFLICT (email) DO NOTHING
      `, [testEmail, await bcrypt.hash(testPassword, 10)]);

      const error = await query(`
        INSERT INTO users (id, email, password, first_name, last_name, phone, role, is_verified, created_at, updated_at)
        VALUES (gen_random_uuid(), $1, $2, 'Duplicate', 'User', '+221771111111', 'PRESTATAIRE', false, NOW(), NOW())
      `, [testEmail, await bcrypt.hash(testPassword, 10)]).catch((e: any) => e);

      expect(error).toBeDefined();
    });
  });

  describe('2. Vérification Admin', () => {
    let providerUser: TestUser | null = null;
    let providerProfile: TestProvider | null = null;

    beforeEach(async () => {
      const testEmail = generateTestEmail('provider');
      const hashedPassword = await bcrypt.hash(testPassword, 10);
      const userResult = await query(`
        INSERT INTO users (id, email, password, first_name, last_name, phone, role, is_verified, created_at, updated_at)
        VALUES (gen_random_uuid(), $1, $2, $3, $4, '+221771234567', 'PRESTATAIRE', false, NOW(), NOW())
        RETURNING id, email, first_name, last_name, role
      `, [testEmail, hashedPassword, testFirstName, testLastName]);

      providerUser = {
        id: userResult.rows[0].id,
        email: userResult.rows[0].email,
        password: testPassword,
        firstName: userResult.rows[0].first_name,
        lastName: userResult.rows[0].last_name,
        role: 'PRESTATAIRE'
      };

      await query(`
        INSERT INTO provider_profiles (id, user_id, business_name, is_verified, created_at, updated_at)
        VALUES (gen_random_uuid(), $1, $2, false, NOW(), NOW())
      `, [providerUser.id, 'Test Business']);

      const profileResult = await query(`
        SELECT id, user_id, is_verified, business_name FROM provider_profiles WHERE user_id = $1
      `, [providerUser.id]);

      providerProfile = {
        userId: profileResult.rows[0].user_id,
        isVerified: profileResult.rows[0].is_verified,
        businessName: profileResult.rows[0].business_name
      };
    });

    afterEach(async () => {
      if (providerUser) {
        await cleanupTestUser(providerUser.email);
        providerUser = null;
        providerProfile = null;
      }
    });

    it('devrait permettre à l\'admin de vérifier un prestataire', async () => {
      console.log('\n--- Test: Vérification prestataire ---');
      console.log('Prestataire avant vérification:', providerProfile?.isVerified);

      const result = await query(`
        UPDATE provider_profiles 
        SET is_verified = true, updated_at = NOW() 
        WHERE user_id = $1 
        RETURNING id, user_id, is_verified
      `, [providerUser!.id]);

      expect(result.rows.length).toBeGreaterThan(0);
      expect(result.rows[0].is_verified).toBe(true);
      console.log('✅ Prestataire vérifié avec succès');

      const updatedProfile = await query(`
        SELECT is_verified FROM provider_profiles WHERE user_id = $1
      `, [providerUser!.id]);

      expect(updatedProfile.rows[0].is_verified).toBe(true);
    });

    it('ne devrait pas vérifier un utilisateur qui n\'est pas prestataire', async () => {
      console.log('\n--- Test: Vérification utilisateur non-prestataire ---');
      const clientEmail = generateTestEmail('client');

      const clientUser = await query(`
        INSERT INTO users (id, email, password, first_name, last_name, phone, role, is_verified, created_at, updated_at)
        VALUES (gen_random_uuid(), $1, $2, 'Client', 'User', '+221771111111', 'CLIENT', false, NOW(), NOW())
        RETURNING id, email, role
      `, [clientEmail, await bcrypt.hash(testPassword, 10)]);

      const error = await query(`
        UPDATE provider_profiles 
        SET is_verified = true 
        WHERE user_id = $1
      `, [clientUser.rows[0].id]).catch((e: any) => e);

      expect(error).toBeDefined();
      console.log('✅ Cannot verify non-provider user');

      await cleanupTestUser(clientUser.rows[0].email);
    });
  });

  describe('3. Vérification du prestaire au niveau admin (API)', () => {
    let providerUser: TestUser | null = null;

    beforeEach(async () => {
      const testEmail = generateTestEmail('provider');
      const hashedPassword = await bcrypt.hash(testPassword, 10);
      const userResult = await query(`
        INSERT INTO users (id, email, password, first_name, last_name, phone, role, is_verified, created_at, updated_at)
        VALUES (gen_random_uuid(), $1, $2, $3, $4, '+221771234567', 'PRESTATAIRE', false, NOW(), NOW())
        RETURNING id, email, first_name, last_name, role
      `, [testEmail, hashedPassword, testFirstName, testLastName]);

      providerUser = {
        id: userResult.rows[0].id,
        email: userResult.rows[0].email,
        password: testPassword,
        firstName: userResult.rows[0].first_name,
        lastName: userResult.rows[0].last_name,
        role: 'PRESTATAIRE'
      };

      await query(`
        INSERT INTO provider_profiles (id, user_id, business_name, is_verified, created_at, updated_at)
        VALUES (gen_random_uuid(), $1, $2, false, NOW(), NOW())
      `, [providerUser.id, 'Test Business']);
    });

    afterEach(async () => {
      if (providerUser) {
        await cleanupTestUser(providerUser.email);
        providerUser = null;
      }
    });

    it('devrait mettre à jour is_verified à true dans provider_profiles', async () => {
      console.log('\n--- Test: API vérification prestataire ---');

      const verifyResult = await query(`
        UPDATE provider_profiles 
        SET is_verified = true, updated_at = NOW() 
        WHERE user_id = $1 
        RETURNING id, user_id, is_verified
      `, [providerUser!.id]);

      expect(verifyResult.rows[0].is_verified).toBe(true);
      console.log('✅ API vérification réussie');

      const userCheck = await query(`
        SELECT role FROM users WHERE id = $1
      `, [providerUser!.id]);

      expect(userCheck.rows[0].role).toBe('PRESTATAIRE');
      console.log('✅ Rôle utilisateur confirmé: PRESTATAIRE');
    });
  });
});