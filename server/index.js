const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// // Serve the index.html file
// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/index.html');
// });

// Handle socket connections
io.on('connection', (socket) => {
    console.log('a user connected');
    
    // Handle incoming messages
    socket.on('message', (msg) => {
        console.log('message: ' + msg);
        io.emit('message', msg);
    });

    // Handle disconnections
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
