import { WebSocket, WebSocketServer } from 'ws';
import Hashids from 'hashids';
import { ServiceCallback, ServicePayload } from './types';

const hashids = new Hashids('prosocket');

class Serivces {
  ws: WebSocketServer;
  services: Map<string, ServiceCallback>;
  clients: Map<string, WebSocket>;

  constructor(ws: WebSocketServer) {
    this.ws = ws;
    this.services = new Map();
    this.clients = new Map();

    this.ws.addListener('connection', (client) => {
      this.handleClientMessage(client);
    });
  }

  handleClientMessage(client: WebSocket) {
    client.on('message', async (message) => {
      const string = message.toString();
      const data = JSON.parse(string || '{}');

      console.log('data', data);

      const { type, value } = data;

      switch (type) {
        case '__clientId':
          if (!this.clients.has(value)) {
            // Generate new ID for the client
            const id = hashids.encode(this.clients.size);

            this.clients.set(id, client);
            client.send(
              JSON.stringify({
                type: '__clientId',
                value: id,
              })
            );
          }

          break;

        case '__runService':
          // Get service name and payload from the value
          const { name, payload } = value;
          const result = await this.runService(name, payload);

          break;
      }
    });
  }

  registerService(name: string, cb: ServiceCallback) {
    if (this.services.has(name)) {
      throw new Error('Service already exists');
    }

    this.services.set(name, cb);
  }

  async runService(name: string, payload: ServicePayload) {
    if (!this.services.has(name)) {
      throw new Error("Service doesn't exist");
    }

    const service = this.services.get(name);
    const result = await service(payload);
    return result;
  }
}
export { Serivces };
