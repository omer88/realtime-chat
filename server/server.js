const path = require('path');
const http = require('http');

const express = require('express');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/message');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', socket => {
  console.log('New user connected');
  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });
  socket.emit(
    'newMessage',
    generateMessage('Admin', 'Welcome to the chat app')
  );
  socket.broadcast.emit(
    'newMessage',
    generateMessage('Admin', 'A new user joined to the chat app')
  );

  socket.on('createMessage', (message, callback) => {
    const { from, text } = message;
    console.log('create message', message);
    io.emit('newMessage', generateMessage(from, text));
    if (callback) {
      callback({ message: 'This is from the server' });
    }
  });

  socket.on('createLocationMessage', coords => {
    io.emit(
      'newLocationMessage',
      generateLocationMessage('Admin', coords.latitude, coords.longitude)
    );
  });
});
const port = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, '../public')));

server.listen(port, () => {
  console.log(`listening to port ${port}`);
});
