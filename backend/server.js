const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const messageRoutes = require("./routes/messageRoutes");
const Message = require("./models/Message");

dotenv.config();

connectDB();

const app = express();
const server = http.createServer(app);

// CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  })
);

app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "Vedaz Chat API is running",
  });
});

// REST API routes
app.use("/api/messages", messageRoutes);

// Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Keep track of connected users
// username -> Set of socket IDs
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // User joins chat
  socket.on("join-chat", (username) => {
    if (!username) {
      return;
    }

    socket.username = username;

    // Create socket set for this username
    if (!onlineUsers.has(username)) {
      onlineUsers.set(username, new Set());
    }

    // Add this socket
    onlineUsers.get(username).add(socket.id);

    console.log(`${username} joined the chat`);

    // Get unique online usernames
    const users = Array.from(onlineUsers.keys());

    console.log("Online users:", users);

    // Send online users list to everyone
    io.emit("online-users", {
      count: users.length,
      users,
    });

    // Notify other users
    socket.broadcast.emit("user-joined", {
      username,
    });
  });

  // User sends a message
  socket.on("send-message", async (data) => {
    try {
      const { username, message } = data;

      if (!username || !message?.trim()) {
        return;
      }

      // Save message to MongoDB
      const newMessage = await Message.create({
        username,
        message: message.trim(),
      });

      // Send message to everyone
      io.emit("receive-message", newMessage);
    } catch (error) {
      console.error("Socket message error:", error);

      socket.emit("message-error", {
        message: "Failed to send message",
      });
    }
  });

  // User starts typing
  socket.on("typing", ({ username }) => {
    socket.broadcast.emit("user-typing", {
      username,
    });
  });

  // User stops typing
  socket.on("stop-typing", ({ username }) => {
    socket.broadcast.emit("user-stop-typing", {
      username,
    });
  });

  // User disconnects
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    // Only remove if this socket joined the chat
    if (socket.username && onlineUsers.has(socket.username)) {
      const userSockets = onlineUsers.get(socket.username);

      // Remove this socket
      userSockets.delete(socket.id);

      // If this user has no other connected sockets,
      // remove the username completely
      if (userSockets.size === 0) {
        onlineUsers.delete(socket.username);

        console.log(`${socket.username} left the chat`);

        // Notify other users
        socket.broadcast.emit("user-left", {
          username: socket.username,
        });
      }
    }

    // Send updated online users list
    const users = Array.from(onlineUsers.keys());

    console.log("Online users:", users);

    io.emit("online-users", {
      count: users.length,
      users,
    });
  });
});

// Start server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});