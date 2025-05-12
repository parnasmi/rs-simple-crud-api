import { expect } from 'chai';
import request from 'supertest';
import { createServer } from '../src/server';

describe('Users API', () => {
  const server = createServer();

  let createdUserId: string;

  it('GET /api/users -> should return empty array', async () => {
    const res = await request(server).get('/api/users');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array').that.is.empty;
  });
});
