import request from 'supertest';
import type { Server } from 'http';

import { closeDatabase, createTestServer } from '../utils/testsHelpers';
import Auth_controller from '../../src/controllers/auth_controller';

let server: Server;

beforeAll(async() => {
    server = await createTestServer();
});

afterAll(async () => {
    await closeDatabase();
    server.close();
});

describe('API', () => {
    test('Send "Server is up!"', async () => {
        const res = await request(server).get('/api/health');

        expect(res.statusCode).toEqual(200);
        expect(res.text).toEqual('Server is up!');
    });

    test('Send 404 if route does not exist', async () => {
        const res = await request(server).get('/api/fake');

        expect(res.statusCode).toEqual(404);
        expect(res.body.message).toEqual('Resource Not Found');
    });

    test('Handle unexpected errors', async () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        jest.spyOn(Auth_controller, 'validateLoginBody').mockImplementationOnce(_ => { throw 'User error'; });
        const res = await request(server).post('/api/auth/login');

        expect(res.statusCode).toEqual(500);
        expect(res.body.message).toEqual('Unexpected error');
    });
});
