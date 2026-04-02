import { io } from "socket.io-client";

// Connect to your backend
const socket = io("http://localhost:5000");

socket.on("connect", () => {
  console.log("Connected:", socket.id);

  const userId = "69ca2452b9fd2c7660de1620"; // replace with real MongoDB userId

  // Join room
  socket.emit("joinRoom", { userId });

  // Send test message (use SAME id for testing)
  socket.emit("sendMessage", {
    senderId: userId,
    receiverId: userId,
    postId: "69cbefe366d68227eb3f662f",
    messageText: "hiiiii" // replace with real postId
  });
});

// Listen for incoming messages
socket.on("receiveMessage", (msg) => {
  console.log("Received message:", msg);
});

socket.on("disconnect", () => {
  console.log("Disconnected");
});