const request = require('supertest');
const mongoose = require('mongoose');
dotenv.config();
const dotenv = require('dotenv');
const app = require('../server');
const User = require('../models/User');

jest.setTimeout(10000);

describe('Auth API', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_PARTY, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe('POST /register', () => {
    it('should register a new user', async () => {
      const response = await request(app).post('/api/auth/register').send({
        email: 'unitTest@example.com',
        name: 'unitTest',
        password: 'UnitTest12@!',
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty(
        'message',
        'User registered successfully'
      );
    });

    it('should not register a user with an existing email', async () => {
      const response = await request(app).post('/api/auth/register').send({
        email: 'unitTest@example.com',
        name: 'unitTest',
        password: 'UnitTest12@!',
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Email already in use');
    });
  });

  describe('POST /login', () => {
    it('should log in a user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'unitTest@example.com', password: 'UnitTest12@!' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Login successful');
      expect(response.body).toHaveProperty('userId');
    });

    it('should not log in with incorrect credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'unitTest@example.com', password: 'WrongPassword' });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty(
        'message',
        'Invalid email or password'
      );
    });
  });

  describe('GET /check-session', () => {
    let agent = request.agent(app);

    beforeAll(async () => {
      await agent
        .post('/api/auth/login')
        .send({ email: 'unitTest@example.com', password: 'UnitTest12@!' });
    });

    it('should return the session data if logged in', async () => {
      const response = await agent.get('/api/auth/check-session');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('userId');
      expect(response.body).toHaveProperty('email', 'unitTest@example.com');
    });

    it('should return no active session if not logged in', async () => {
      const response = await request(app).get('/api/auth/check-session');
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'No active session');
    });
  });
});
