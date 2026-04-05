import http from "http";
import { Server } from "socket.io";
import app from "./src/app.js";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import Message from "./src/models/Message.js";

dotenv.config();
connectDB();

// Create HTTP server
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join user room
  socket.on("joinRoom", ({ userId }) => {
    socket.join(userId);
  });

  // Send message
  socket.on("sendMessage", async (data) => {
    try {
      const { senderId, receiverId, postId, messageText } = data;

      const newMessage = new Message({
        senderId,
        receiverId,
        postId,
        messageText
      });

      await newMessage.save();

      // Send to receiver
      io.to(receiverId).emit("receiveMessage", newMessage);

      // Send back to sender
      socket.emit("receiveMessage", newMessage);

    } catch (err) {
      console.error(err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});