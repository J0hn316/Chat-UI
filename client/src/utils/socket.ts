import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

export const socket: Socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ['websocket', 'polling'],
  autoConnect: false, // Connect manually when needed
});

// Helper to join a room for the logged-in user
export const joinUserRoom = (userId: string): void => {
  if (!userId) return;

  if (!socket.connected) socket.connect();

  // If not yet connected, wait for connect then emit join once
  if (socket.connected) {
    socket.emit('join', userId);
  } else {
    socket.once('connect', () => {
      socket.emit('join', userId);
    });
  }
};
