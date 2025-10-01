import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://dammuchat.vercel.app",
    credentials: true,
    methods: ["GET", "POST"]
  }
});


export const getReceiverSocketId = (userId) => {
  return onlineUsers[userId];
}

// used to store online users
const onlineUsers = {}; // {userId: socketId}

io.on("connection", (socket) => {
  
  const userId = socket.handshake.query.userId;
  console.log("A user connected", userId);
  if (userId) onlineUsers[userId] = socket.id;

  // io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(onlineUsers));

  socket.on("disconnect", () => {
    console.log("A user disconnected", userId);
    delete onlineUsers[userId];
    io.emit("getOnlineUsers", Object.keys(onlineUsers));
  });


});

export { io, app, server };

