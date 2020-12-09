const WebSocket = require('ws');

module.exports = server => {
  const WebSocketServer = new WebSocket.Server({ server });

  // * If Client Connects to WebSocket
  WebSocketServer.on('connection', (ws, req) => {
    // * Famous Way To get Client's IP. localhost's ip = ::1
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log('New Client Connection:', ip);

    // * If Server get Message from Client
    ws.on('message', message => {
      console.log(message);
    });

    ws.on('error', error => {
      console.error(error);
    });

    ws.on('close', () => {
      console.log('Disconnect Client', ip);
      clearInterval(ws.interval);
    });

    ws.interval = setInterval(() => {
      if (ws.readyState === ws.OPEN) {
        ws.send('Send Message from Server to Client.');
      }
    }, 3000);
  });
};
