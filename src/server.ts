import http from 'http';
import { handleUserRoutes } from './routes/user.route';

export const createServer = () => {
  return http.createServer((req, res) => {
    try {
      if (!req.url?.startsWith('/api/users')) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Endpoint not found' }));
        return;
      }

      handleUserRoutes(req, res);
    } catch (error) {
      console.error('Unhandled server error:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Internal server error' }));
    }
  });
};
