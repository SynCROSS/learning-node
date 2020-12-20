const SocketIO = require('socket.io');

module.exports = server => {
  const io = new SocketIO.Server(server, { path: '/socket.io' });

  // * If Client Connects to WebSocket
  io.on('connection', socket => {
    const req = socket.request;
    // * Famous Way To get Client's IP. localhost's ip = ::1
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    console.log('New Client Connection:', ip, socket.id, req.ip);

    socket.on('disconnect', () => {
      console.log('Disconnect Client', ip, socket.id);
      clearInterval(socket.interval);
    });

    socket.on('error', error => {
      console.error(error);
    });

    // * If Server get Message from Client
    socket.on('reply', data => {
      console.log(data);
    });

    socket.interval = setInterval(() => {
      socket.emit('news', 'Hello Socket.IO');
    }, 3000);
  });
};
