const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files for your Pomodoro app
app.use(express.static('public'));

// Serve chat app files
app.use('/chat', express.static('chat_app'));

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
