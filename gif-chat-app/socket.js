const SocketIO = require('socket.io');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const cookie = require('cookie-signature');

module.exports = (server, app, sessionMiddleware) => {
  const io = new SocketIO.Server(server, { path: '/socket.io' });

  app.set('io', io);

  const room = io.of('/room');
  const chat = io.of('/chat');

  io.use((socket, next) => {
    cookieParser(process.env.COOKIE_SECRET)(
      socket.request,
      socket.request.res,
      next,
    );
    sessionMiddleware(socket.request, socket.request.res, next);
  });

  room.on('connection', socket => {
    console.log('Connect to Room Namespace');
    socket.on('disconnect', () => {
      console.log('Disconnect room namespace');
    });
  });

  chat.on('connection', () => {
    console.log('Connect to Chat Namespace');

    const req = socket.request;
    const {
      headers: { referer },
    } = req;
    const roomId = referer
      .split('/')
      [referer.split('/').length - 1].replace(/\?.+/, '');

    socket.join(roomId);
    socket.to(roomId).emit('join', {
      user: 'system',
      chat: `${req.session.color} joined the Room.`,
    });

    socket.on('disconnect', () => {
      console.log('Disconnect Chat Namespace');
      socket.leave(roomId);

      const currentRoom = socket.adapter.rooms[roomId];
      const userCount = currentRoom ? currentRoom.length : 0;

      if (userCount === 0) {
        const signedCookie = req.signedCookies['connect.sid'];
        const connectSID = cookie.sign(signedCookie, process.env.COOKIE_SECRET);

        axios
          .delete(`http://localhost:3000/room/${roomId}`, {
            headers: {
              Cookie: `connect.sid=s%3A${connectSID}`,
            },
          })
          .then(() => {
            console.log('Delete Room Request Successful');
          })
          .catch(error => {
            console.error(error);
          });
      } else {
        socket
          .to(roomId)
          .emit('exit', {
            user: 'system',
            chat: `${req.session.color} left the Room.`,
          });
      }
    });
  });
};
