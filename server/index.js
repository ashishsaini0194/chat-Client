const { Server } = require("socket.io");

const io = new Server({
  cors: "*",
});

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  socket.on("joinRoom", ({ username, room }) => {
    socket.join(room);
    console.log(`${username} joined room ${room}`);

    // Welcome current user
    socket.emit("message", { text: "Welcome to the chat!" });

    // Broadcast when a user connects
    socket.broadcast
      .to(room)
      .emit("message", { text: `${username} has joined the chat` });

    // Listen for chat messages
    socket.on("chatMessage", (msg) => {
      io.to(room).emit("message", { user: username, text: msg.message });
    });

    // Runs when client disconnects
    socket.on("disconnect", () => {
      io.to(room).emit("message", { text: `${username} has left the chat` });
      console.log("Client disconnected");
    });
  });
});

// // Start the server
const PORT = process.env.PORT || 3001;
io.listen(PORT);
