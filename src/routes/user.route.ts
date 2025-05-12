import { IncomingMessage, ServerResponse } from 'http';
import {
  createUser,
  deleteUserById,
  getAllUsers,
  getUserById,
  updateUserById,
} from '../controllers/users.controller';

export const handleUserRoutes = (req: IncomingMessage, res: ServerResponse) => {
  const url = req.url || '';
  const method = req.method;

  // GET /api/users
  if (url === '/api/users' && method === 'GET') {
    return getAllUsers(req, res);
  }

  // POST /api/users
  if (url === '/api/users' && method === 'POST') {
    return createUser(req, res);
  }

  // PUT /api/users/:id
  if (url.startsWith('/api/users/') && method === 'PUT') {
    const userId = url.split('/')[3];
    console.log('userId', { userId, url });
    return updateUserById(req, res, userId);
  }

  // GET /api/users/:id
  const userIdMatch = url.match(/^\/api\/users\/([0-9a-fA-F-]{36})$/);
  if (userIdMatch && method === 'GET') {
    const userId = userIdMatch[1];
    return getUserById(req, res, userId);
  }

  // DELETE /api/users/:id
  if (url.startsWith('/api/users') && method === 'DELETE') {
    const userId = url.split('/')[3];
    return deleteUserById(req, res, userId);
  }

  //If no matching
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Route not found' }));
};
