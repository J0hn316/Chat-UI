import { io, Socket } from 'socket.io-client';

const socket: Socket = io('http://localhost:5000', {
  withCredentials: true,
});

export default socket;
