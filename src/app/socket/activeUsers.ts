// src/app/socket/activeUser.ts
import { Socket } from "socket.io";

// userId => Set of socketId (ekjon user multiple tab/device diye connect korte pare)
const activeUsers = new Map<string, Set<string>>();

export const addActiveUser = (userId: string, socketId: string) => {
  if (!activeUsers.has(userId)) {
    activeUsers.set(userId, new Set());
  }
  activeUsers.get(userId)!.add(socketId);
};

export const removeActiveUser = (userId: string, socketId: string) => {
  const userSockets = activeUsers.get(userId);
  if (!userSockets) return;

  userSockets.delete(socketId);

  // user-er ar kono open connection na thakle map theke soriye dao
  if (userSockets.size === 0) {
    activeUsers.delete(userId);
  }
};

export const getActiveUserCount = () => activeUsers.size;

export const getActiveUserIds = () => Array.from(activeUsers.keys());

export const registerActiveUserHandlers = (socket: Socket) => {
  const userId = socket.handshake.auth?.userId as string;

  if (!userId) {
    socket.disconnect();
    return null;
  }

  addActiveUser(userId, socket.id);

  socket.on("disconnect", () => {
    removeActiveUser(userId, socket.id);
    socket.nsp.emit("activeUserCount", getActiveUserCount());
  });

  return userId;
};
