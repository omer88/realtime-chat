const path = require('path');
const http = require('http');

const express = require('express');
const socketIO = require('socket.io');
const { Users } = require('./utils/users');

const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const users = new Users();

io.on('connection', socket => {
  console.log('New user connected');

  socket.on('disconnect', () => {
    const user = users.removeUser(socket.id);
    io.to(user.room).emit('updateUserList', users.getUserList(user.room));
    io.to(user.room).emit(
      'newMessage',
      generateMessage('Admin', `${user.name} left the room`)
    );
  });

  socket.on('createMessage', (message, callback) => {
    const { text } = message;
    const user = users.getUser(socket.id);
    if (user && isRealString(text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, text));
    }
    if (callback) {
      callback();
    }
  });

  socket.on('createLocationMessage', coords => {
    const user = users.getUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        'newLocationMessage',
        generateLocationMessage(user.name, coords.latitude, coords.longitude)
      );
    }
  });

  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room name are required');
    }

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);
    io.to(params.room).emit('updateUserList', users.getUserList(params.room));

    socket.emit(
      'newMessage',
      generateMessage('Admin', `${params.name}, welcome to the chat app`)
    );
    socket.broadcast
      .to(params.room)
      .emit(
        'newMessage',
        generateMessage('Admin', `${params.name} joined to the chat app`)
      );
    callback();
  });
});
const port = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, '../public')));

server.listen(port, () => {
  console.log(`listening to port ${port}`);
});
