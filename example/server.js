const { ProSocket } = require('../dist/packages/core/main');

const server = new ProSocket();

const db = {
  findUser: async (username) => {
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            username,
          }),
        2000
      )
    );
  },
};

server.register('user/fetch', async (data) => {
  const user = await db.findUser(data.username);
  return user;
});

server.listen(3000);
