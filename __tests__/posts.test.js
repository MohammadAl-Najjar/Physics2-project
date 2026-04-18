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

describe('Posts Endpoints', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.JWT_SECRET = 'testsecret';
    });

    const generateToken = () => jwt.sign({ id: 1, email: 'test@example.com' }, 'testsecret');

    describe('GET /api/posts', () => {
        it('should return 200 and a list of posts', async () => {
            const mockPosts = [
                { id: 1, title: 'Post 1', author: 'Alice', answers_count: 2 },
                { id: 2, title: 'Post 2', author: 'Bob', answers_count: 0 }
            ];
            db.query.mockResolvedValueOnce({ rows: mockPosts });

            const res = await request(app).get('/api/posts');
            
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockPosts);
            expect(db.query).toHaveBeenCalledTimes(1);
        });
    });

    describe('POST /api/posts', () => {
        it('should return 401 if not authenticated', async () => {
            const res = await request(app)
                .post('/api/posts')
                .send({ title: 'T', body: 'B', category: 'C' });
            
            expect(res.status).toBe(401); 
        });

        it('should return 400 if missing fields', async () => {
            const token = generateToken();
            const res = await request(app)
                .post('/api/posts')
                .set('Cookie', [`jwt=${token}`])
                .send({ title: 'Title only' });

            expect(res.status).toBe(400);
            expect(res.body.message).toBe('All fields are required');
        });

        it('should return 201 on success', async () => {
            db.query.mockResolvedValueOnce({}); 
            const token = generateToken();

            const res = await request(app)
                .post('/api/posts')
                .set('Cookie', [`jwt=${token}`])
                .send({ title: 'New Post', body: 'Content', category: 'Physics' });

            expect(res.status).toBe(201);
            expect(res.body.message).toBe('Post created successfully');
            expect(db.query).toHaveBeenCalledTimes(1);
        });
    });
});
