import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { prisma } from '../../../src/config/prisma';
import { createUser, verifyProvider, getUserById } from '../../../src/services/userService';

describe('UserService', () => {
  beforeEach(async () => {
    // Clean up database before each test
    await prisma.user.deleteMany();
    await prisma.providerProfile.deleteMany();
  });

  afterEach(async () => {
    // Clean up after each test
    await prisma.user.deleteMany();
    await prisma.providerProfile.deleteMany();
  });

  describe('createUser', () => {
    it('should create a new client user', async () => {
      const userData = {
        email: 'client@example.com',
        password: 'hashedpassword123',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+221771234567',
        role: 'CLIENT'
      };

      const user = await createUser(userData);

      expect(user).toHaveProperty('id');
      expect(user.email).toBe(userData.email);
      expect(user.firstName).toBe(userData.firstName);
      expect(user.lastName).toBe(userData.lastName);
      expect(user.role).toBe(userData.role);
    });

    it('should create a new provider user', async () => {
      const userData = {
        email: 'provider@example.com',
        password: 'hashedpassword123',
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '+221772345678',
        role: 'PRESTATAIRE'
      };

      const user = await createUser(userData);

      expect(user).toHaveProperty('id');
      expect(user.role).toBe(userData.role);

      // Check if provider profile was created
      const profile = await prisma.providerProfile.findUnique({
        where: { userId: user.id }
      });
      expect(profile).toBeTruthy();
    });

    it('should throw error for duplicate email', async () => {
      const userData = {
        email: 'duplicate@example.com',
        password: 'hashedpassword123',
        firstName: 'Test',
        lastName: 'User',
        role: 'CLIENT'
      };

      // Create first user
      await createUser(userData);

      // Try to create duplicate
      await expect(createUser(userData)).rejects.toThrow('Email déjà utilisé');
    });

    it('should default role to CLIENT when not specified', async () => {
      const userData = {
        email: 'default@example.com',
        password: 'hashedpassword123',
        firstName: 'Default',
        lastName: 'User'
      };

      const user = await createUser(userData);
      expect(user.role).toBe('CLIENT');
    });
  });

  describe('verifyProvider', () => {
    it('should verify a provider successfully', async () => {
      // Create admin user
      const adminData = {
        email: 'admin@example.com',
        password: 'hashedpassword123',
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN'
      };
      const admin = await createUser(adminData);

      // Create provider user
      const providerData = {
        email: 'provider@example.com',
        password: 'hashedpassword123',
        firstName: 'Provider',
        lastName: 'User',
        role: 'PRESTATAIRE'
      };
      const provider = await createUser(providerData);

      // Verify provider
      const result = await verifyProvider(provider.id, admin.id);

      expect(result).toHaveProperty('id');
      expect(result.isVerified).toBe(true);

      // Check that provider profile is verified
      const updatedProfile = await prisma.providerProfile.findUnique({
        where: { userId: provider.id }
      });
      expect(updatedProfile?.isVerified).toBe(true);
    });

    it('should throw error for non-provider user', async () => {
      const adminData = {
        email: 'admin@example.com',
        password: 'hashedpassword123',
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN'
      };
      const admin = await createUser(adminData);

      const clientData = {
        email: 'client@example.com',
        password: 'hashedpassword123',
        firstName: 'Client',
        lastName: 'User',
        role: 'CLIENT'
      };
      const client = await createUser(clientData);

      await expect(verifyProvider(client.id, admin.id)).rejects.toThrow('Cet utilisateur n\'est pas un prestataire');
    });

    it('should throw error for non-existent user', async () => {
      const adminData = {
        email: 'admin@example.com',
        password: 'hashedpassword123',
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN'
      };
      const admin = await createUser(adminData);

      await expect(verifyProvider('non-existent-id', admin.id)).rejects.toThrow('Utilisateur non trouvé');
    });
  });

  describe('getUserById', () => {
    it('should return user with verification status', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'hashedpassword123',
        firstName: 'Test',
        lastName: 'User',
        role: 'PRESTATAIRE'
      };

      const createdUser = await createUser(userData);
      const retrievedUser = await getUserById(createdUser.id);

      expect(retrievedUser.id).toBe(createdUser.id);
      expect(retrievedUser.email).toBe(userData.email);
      expect(retrievedUser).toHaveProperty('isVerified');
    });

    it('should throw error for non-existent user', async () => {
      await expect(getUserById('non-existent-id')).rejects.toThrow('Utilisateur non trouvé');
    });
  });
});