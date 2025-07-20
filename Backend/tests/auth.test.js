const request = require('supertest');
const app = require('../app');
const { connectTestDB, clearTestCollections } = require('../utils/testSetup');

// Test data examples for authentication routes

// Signup test data
const signupData = {
  username: "testuser",
  email: "test@example.com",
  password: "password123"
};

// Login test data
const loginData = {
  email: "test@example.com",
  password: "password123"
};

describe('Auth Routes', () => {
  beforeAll(async () => await connectTestDB());
  afterEach(async () => await clearTestCollections());

  describe('POST /api/auth/signup', () => {
    it('should create a new user', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .field('username', 'testuser')
        .field('email', 'test@example.com')
        .field('password', 'Test123!')
        .attach('avatar', 'tests/fixtures/test-avatar.jpg');

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login existing user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Test123!'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });
  });
});

// Example cURL requests:
/*
1. Signup:
curl -X POST http://localhost:3000/api/auth/signup \
-H "Content-Type: application/json" \
-d '{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}'

2. Login:
curl -X POST http://localhost:3000/api/auth/login \
-H "Content-Type: application/json" \
-d '{
  "email": "test@example.com",
  "password": "password123"
}'

3. Auto Login:
curl -X GET http://localhost:3000/api/auth/auto-login \
-H "Authorization: Bearer YOUR_TOKEN_HERE"

4. Logout:
curl -X POST http://localhost:3000/api/auth/logout

// Expected Responses:

1. Successful Signup Response:
{
  "message": "User registered successfully",
  "user": {
    "id": "user_id",
    "username": "testuser",
    "email": "test@example.com"
  },
  "token": "jwt_token"
}

2. Successful Login Response:
{
  "message": "Login successful",
  "user": {
    "id": "user_id",
    "username": "testuser",
    "email": "test@example.com"
  },
  "token": "jwt_token"
}

3. Successful Auto Login Response:
{
  "id": "user_id",
  "username": "testuser",
  "email": "test@example.com"
}

4. Successful Logout Response:
{
  "message": "Logged out successfully"
}
*/

module.exports = {
  signupData,
  loginData
};
