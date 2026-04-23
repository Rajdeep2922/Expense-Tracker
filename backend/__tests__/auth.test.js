// backend/__tests__/auth.test.js
// Integration tests for auth routes using Supertest + in-memory MongoDB
const request = require('supertest');
const mongoose = require('mongoose');

// Set test env vars before app loads (prevents fail-fast env check issues in CI)
process.env.MONGODB_URI = 'mongodb://localhost:27017/expense_tracker_test';
process.env.JWT_SECRET = 'test_secret_key_for_jest';
process.env.NODE_ENV = 'test';

const app = require('../app');

const TEST_USER = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'Password1',
};

let token;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('POST /api/auth/register', () => {
  it('should register a new user and return a token', async () => {
    const res = await request(app).post('/api/auth/register').send(TEST_USER);
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.email).toBe(TEST_USER.email);
  });

  it('should reject duplicate email', async () => {
    const res = await request(app).post('/api/auth/register').send(TEST_USER);
    expect(res.statusCode).toBe(409);
  });

  it('should reject weak passwords', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Another',
      email: 'another@example.com',
      password: 'weak',
    });
    expect(res.statusCode).toBe(422);
  });
});

describe('POST /api/auth/login', () => {
  it('should log in with correct credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: TEST_USER.email,
      password: TEST_USER.password,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.token).toBeDefined();
    token = res.body.data.token;
  });

  it('should reject wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: TEST_USER.email,
      password: 'wrongpassword',
    });
    expect(res.statusCode).toBe(401);
  });
});

describe('GET /api/auth/me', () => {
  it('should return current user with valid token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.user.email).toBe(TEST_USER.email);
  });

  it('should reject request without token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.statusCode).toBe(401);
  });
});
