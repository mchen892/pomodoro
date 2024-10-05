const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://pomopals-seven.vercel.app", // Your front-end domain (Vercel domain)
    methods: ["GET", "POST"],
    credentials: true, // Enable credentials for cross-domain cookies if needed
  },
});

io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for messages from clients
  socket.on('message', (msg) => {
    console.log('Message received: ', msg);
    // Broadcast the message to all clients
    io.emit('message', msg);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start the server on port 3000 or the desired port
server.listen(3000, () => {
  console.log('Socket.io server running on port 3000');
});
