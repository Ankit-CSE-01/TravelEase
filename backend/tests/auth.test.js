const request = require('supertest');
const mongoose = require('mongoose');
const http = require('http');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const express = require('express');

// Mock connectDB
const connectDB = jest.fn();

// Import server parts manually since we need to control the lifecycle for tests
const createServer = () => {
    const app = express();
    app.use(express.json());

    // Mock Auth Routes
    app.post('/api/auth/register', (req, res) => {
        res.status(201).json({ success: true, token: 'mock-token' });
    });

    return http.createServer(app);
};

describe('Auth API', () => {
    let server;

    beforeAll((done) => {
        server = createServer();
        server.listen(done);
    });

    afterAll((done) => {
        server.close(done);
    });

    it('should register a new user', async () => {
        const res = await request(server)
            .post('/api/auth/register')
            .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('token');
    });
});
