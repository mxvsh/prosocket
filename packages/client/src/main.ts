import {
  client as WebSocketClient,
  connection as WebSocketConnection,
} from 'websocket';

class ProSocketClient {
  ws: WebSocketClient;
  connection: WebSocketConnection;
  onConnect: () => void;
  queue: () => void[];

  constructor(host: string) {
    this.ws = new WebSocketClient();
    this.ws.connect(host);

    this.ws.on('connect', (connection) => {
      this.connection = connection;
      this.onConnect();
    });
  }

  async runService(name: string, payload: any) {
    if (!this.connection) {
      throw new Error('Connection is not active');
    }

    const data = {
      type: '__runService',
      value: {
        name,
        payload,
      },
    };

    this.connection.send(JSON.stringify(data));

    return new Promise((resolve) => {});
  }
}

export { ProSocketClient };
