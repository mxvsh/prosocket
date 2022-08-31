const { ProSocketClient } = require('../dist/packages/client/main');

const client = new ProSocketClient('ws://localhost:3000');

client.onConnect = async () => {
  console.log('connected');

  const user = await client.runService('user/fetch', {
    username: 'xencodes',
  });
  console.log(user);
};
