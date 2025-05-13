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

  it('POST /api/users -> should create user', async () => {
    const hobbies = ['reading', 'travelling'];
    const newUser = {
      username: 'Ivan',
      age: 25,
      hobbies,
    };

    const res = await request(server).post('/api/users').send(newUser);

    expect(res.status).to.equal(201);
    expect(res.body.username).to.equal(newUser.username);
    expect(res.body.age).to.equal(newUser.age);
    expect(res.body.hobbies).to.deep.equal(newUser.hobbies);
    expect(res.body).to.have.property('id');
    createdUserId = res.body.id;
  });

  it('GET /api/users/:id -> should return created user', async () => {
    const res = await request(server).get(`/api/users/${createdUserId}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('id', createdUserId);
  });

  it('PUT /api/users/:id -> should update user', async () => {
    const res = await request(server)
      .put(`/api/users/${createdUserId}`)
      .send({
        username: 'Alice Updated',
        age: 26,
        hobbies: ['coding'],
      });
    expect(res.status).to.equal(200);
    expect(res.body.username).to.equal('Alice Updated');
  });

  it('DELETE /api/users/:id → should delete user', async () => {
    const res = await request(server).delete(`/api/users/${createdUserId}`);
    expect(res.status).to.equal(204);
  });

  it('GET /api/users/:id → should return 404 after delete', async () => {
    const res = await request(server).get(`/api/users/${createdUserId}`);
    expect(res.status).to.equal(404);
  });
});
