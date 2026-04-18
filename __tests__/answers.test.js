import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../server.js';
import { db } from '../db/openDbConnection.js';
import jwt from 'jsonwebtoken';

vi.mock('../db/openDbConnection.js', () => {
  return {
    db: {
      query: vi.fn(),
    }
  };
});

describe('Answers Endpoints', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.JWT_SECRET = 'testsecret';
    });

    const generateToken = () => jwt.sign({ id: 1, email: 'test@example.com' }, 'testsecret');

    describe('GET /api/posts/:postId/answers', () => {
        it('should return 200 and list answers', async () => {
            const mockAnswers = [
                { id: 1, body: 'An answer', author: 'Dr. Phys' }
            ];
            db.query.mockResolvedValueOnce({ rows: mockAnswers });

            const res = await request(app).get('/api/posts/99/answers');
            
            expect(res.status).toBe(200);
            expect(res.body.answers).toEqual(mockAnswers);
        });
    });

    describe('POST /api/posts/:postId/answers', () => {
        it('should return 401 if untrusted', async () => {
            const res = await request(app)
                .post('/api/posts/99/answers')
                .send({ body: 'Some answer text' });
            
            expect(res.status).toBe(401);
        });

        it('should return 400 if body is missing', async () => {
            const token = generateToken();
            const res = await request(app)
                .post('/api/posts/99/answers')
                .set('Cookie', [`jwt=${token}`])
                .send({});
            
            expect(res.status).toBe(400);
            expect(res.body.err).toBe('All fields are required');
        });

        it('should return 201 on success', async () => {
            db.query.mockResolvedValueOnce({});
            const token = generateToken();

            const res = await request(app)
                .post('/api/posts/99/answers')
                .set('Cookie', [`jwt=${token}`])
                .send({ body: 'Valid answer text' });
            
            expect(res.status).toBe(201);
            expect(res.body.message).toBe('Answer created successfully');
            expect(db.query).toHaveBeenCalledTimes(1);
        });
    });
});
