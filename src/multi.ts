import cluster from 'cluster';
import os from 'os';
import http, { IncomingMessage, RequestOptions, ServerResponse } from 'http';
import { createServer } from './server';
import dotenv from 'dotenv';

dotenv.config();

const numCPUs = os.availableParallelism
  ? os.availableParallelism() - 1
  : os.cpus().length - 1;
const PORT = parseInt(process.env.PORT || '4000', 10);

if (cluster.isPrimary) {
  let currentWorker = 0;
  const workerPorts = Array.from({ length: numCPUs }, (_, i) => PORT + i + 1);

  console.log(`Master ${process.pid} is running`);
  console.log(`Spawning ${numCPUs} workers...`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork({ PORT: (PORT + i + 1).toString() });
  }

  // Round-robin load balancer on PORT
  const balancer = http.createServer(
    (req: IncomingMessage, res: ServerResponse) => {
      const workerPort = workerPorts[currentWorker];
      currentWorker = (currentWorker + 1) % workerPorts.length;

      const options: RequestOptions = {
        hostname: 'localhost',
        port: workerPort,
        path: req.url,
        method: req.method,
        headers: req.headers,
      };

      const proxy = http.request(options, (workerRes) => {
        res.writeHead(workerRes.statusCode || 500, workerRes.headers);
        workerRes.pipe(res, { end: true });
      });

      req.pipe(proxy, { end: true });

      proxy.on('error', (err) => {
        console.error('Proxy error:', err);
        res.writeHead(500);
        res.end('Load balancer error');
      });
    },
  );

  balancer.listen(PORT, () => {
    console.log(`Load balancer running on http://localhost:${PORT}`);
  });
} else {
  // Worker process
  const port = parseInt(process.env.PORT || '0', 10);
  const server = createServer();

  server.listen(port, () => {
    console.log(`Worker ${process.pid} running at http://localhost:${port}`);
  });
}
