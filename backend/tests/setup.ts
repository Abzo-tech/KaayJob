import { execSync } from 'child_process';

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'kaayjob-test-secret';

const shouldRunDatabaseSetup = process.env.RUN_DB_TESTS === 'true';

beforeAll(async () => {
  if (!shouldRunDatabaseSetup) {
    return;
  }

  try {
    execSync('createdb kaayjob_test', { stdio: 'ignore' });
  } catch {
    // Database might already exist or PostgreSQL may be unavailable.
  }

  process.env.DATABASE_URL =
    process.env.DATABASE_URL?.replace('kaayjob', 'kaayjob_test') ||
    'postgresql://localhost:5432/kaayjob_test';

  try {
    execSync('npx prisma migrate reset --force', { stdio: 'ignore' });
  } catch (error) {
    console.warn('Database test setup skipped:', (error as Error).message);
  }
});

afterAll(async () => {
  if (!shouldRunDatabaseSetup) {
    return;
  }

  try {
    execSync('dropdb kaayjob_test', { stdio: 'ignore' });
  } catch {
    // Database might not exist.
  }
});
