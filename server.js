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

    // Listen for chat messages
    socket.on('chat message', (msg) => {
        // Emit the message to all connected clients
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
