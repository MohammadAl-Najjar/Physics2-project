import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../server.js';
import { db } from '../db/openDbConnection.js';
import bcrypt from 'bcryptjs';

// Mock the database pool
vi.mock('../db/openDbConnection.js', () => {
  return {
    db: {
      query: vi.fn(),
    }
  };
});

describe('Auth Endpoints', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        delete process.env.ZEROBOUNCE_API_KEY; 
        process.env.JWT_SECRET = 'testsecret';
    });

    describe('POST /api/auth/register', () => {
        it('should return 400 if fields are missing', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test',
                    email: 'test@example.com'
                    // Missing parameters
                });
            expect(res.status).toBe(400);
            expect(res.body.err).toBe('All fields are required');
        });
        
        it('should return 400 if email already exists', async () => {
            db.query.mockResolvedValueOnce({ rows: [{ id: 1 }] }); 
            
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test',
                    email: 'test@example.com',
                    password: 'password123',
                    role: 'student'
                });
            expect(res.status).toBe(400);
            expect(res.body.err).toBe('An account with this email already exists');
        });
        
        it('should return 201 and create user on success', async () => {
            db.query.mockResolvedValueOnce({ rows: [] }); 
            db.query.mockResolvedValueOnce({ rows: [{ id: 99 }] });

            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'validname',
                    email: 'test@example.com',
                    password: 'password123',
                    role: 'student'
                });
            
            expect(res.status).toBe(201);
            expect(res.body.message).toBe('User registered successfully');
            expect(res.headers['set-cookie']).toBeDefined();
        });
    });

    describe('POST /api/auth/login', () => {
        it('should return 404 if user not found', async () => {
            db.query.mockResolvedValueOnce({ rows: [] });
            
            const res = await request(app)
                .post('/api/auth/login')
                .send({ email: 'none@example.com', password: 'password' });
            
            expect(res.status).toBe(404);
            expect(res.body.err).toBe('Account with this email is not found');
        });

        it('should return 201 and a cookie if credentials are correct', async () => {
            const hash = await bcrypt.hash('password123', 1);
            db.query.mockResolvedValueOnce({ rows: [{ id: 1, email: 'test@example.com', password_hash: hash }] });

            const res = await request(app)
                .post('/api/auth/login')
                .send({ email: 'test@example.com', password: 'password123' });
            
            expect(res.status).toBe(201);
            expect(res.body.message).toBe('Logged in');
            expect(res.headers['set-cookie']).toBeDefined();
        });
    });

    describe('GET /api/auth/session', () => {
        it('should return 401 if no token provided', async () => {
            const res = await request(app).get('/api/auth/session');
            expect(res.status).toBe(401);
            expect(res.body.session).toBeNull();
        });
    });

    describe('GET /api/auth/logout', () => {
        it('should clear cookie and return 200', async () => {
            const res = await request(app).get('/api/auth/logout');
            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Logged out');
        });
    });
});
