const SSE = require('sse');

module.exports = server => {
  const sse = new SSE(server);
  sse.on('connection', client => {
    // * Server Sent Events Connection
    setInterval(() => {
      client.send(Date.now().toString());
    }, 1000);
  });
};
