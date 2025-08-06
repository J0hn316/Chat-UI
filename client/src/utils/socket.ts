import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

export const socket: Socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: false, // Connect manually when needed
});

// Helper to join a room for the logged-in user
export const joinUserRoom = (userId: string): void => {
  if (socket.connected) {
    socket.emit('join', userId);
  } else {
    socket.connect();
    socket.on('connect', () => {
      socket.emit('join', userId);
    });
  }
};
