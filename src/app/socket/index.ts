// src/app/socket/index.ts
import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import config from "../config";
import { getActiveUserCount, registerActiveUserHandlers } from "./activeUsers";

let io: Server;

export const initSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:3000",
        "https://www.genvoice.news",
        "https://gen-voice.codersrabbi.workers.dev",
      ],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    const userId = registerActiveUserHandlers(socket);
    if (!userId) return; // unauthenticated hole already disconnect kora hoyeche

    io.emit("activeUserCount", getActiveUserCount());
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
