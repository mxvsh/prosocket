import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { Serivces } from './services';
import { ServiceCallback } from './types';

const server = createServer();
const wsServer = new WebSocketServer({ server });

class ProSocket extends Serivces {
  constructor() {
    super(wsServer);
  }

  register(name: string, cb: ServiceCallback) {
    this.registerService(name, cb);
  }

  listen(port: number) {
    server.listen(port);
    console.log(`[prosocket] 🚀 Server running on port ${port}`);
  }
}

export { ProSocket };
