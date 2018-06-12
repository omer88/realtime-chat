const path = require('path');
const http = require('http');

const express = require('express');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', socket => {
  console.log('New user connected');
  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });
});
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '../public')));

server.listen(port, () => {
  console.log(`listening to port ${port}`);
});
