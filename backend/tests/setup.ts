import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

// Setup test database
beforeAll(async () => {
  // Create test database if it doesn't exist
  try {
    execSync('createdb kaayjob_test', { stdio: 'ignore' });
  } catch (error) {
    // Database might already exist
  }

  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL = process.env.DATABASE_URL?.replace('kaayjob', 'kaayjob_test') || 'postgresql://localhost:5432/kaayjob_test';

  // Reset database schema
  execSync('cd ../.. && npx prisma migrate reset --force', { stdio: 'ignore' });
});

afterAll(async () => {
  // Clean up test database
  try {
    execSync('dropdb kaayjob_test', { stdio: 'ignore' });
  } catch (error) {
    // Database might not exist
  }
});