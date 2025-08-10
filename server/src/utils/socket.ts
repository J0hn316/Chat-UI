import type { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import Message from '../models/messageModel';

export function setupSocket(server: HttpServer): SocketIOServer {
  const io = new SocketIOServer(server, {
    cors: {
      origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // 🔁 Adjust if needed
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  io.on('connection', (socket) => {
    console.log(`🟢 New client connected: ${socket.id}`);

    // Client joins its own user room after connect
    socket.on('join', (userId: string) => {
      if (!userId) return;
      socket.join(userId);
      console.log(`🔵 Client ${socket.id} joined room: ${userId}`);
    });

    // --- Typing indicators ---
    // Forward "typing" to the recipient's room
    socket.on('typing', ({ to, from }: { to: string; from: string }) => {
      if (!to || !from) return;
      socket.to(to).emit('userTyping', { from });
    });

    // Forward "stopTyping" to the recipient's room
    socket.on('stopTyping', ({ to, from }: { to: string; from: string }) => {
      if (!to || !from) return;
      io.to(to).emit('userStopTyping', { from });
    });

    // 💬 Handle sending messages
    socket.on('message:create', async ({ senderId, recipientId, content }) => {
      try {
        const newMessage = new Message({
          sender: senderId,
          recipient: recipientId,
          content,
        });
        await newMessage.save();
        await newMessage.populate('sender, username');
        await newMessage.populate('recipient, username');

        console.log('📩 Message created:', newMessage);

        // Emit the new message to both sender and recipient
        io.to(senderId).emit('message', newMessage);
        io.to(recipientId).emit('message', newMessage);
      } catch (err) {
        console.error('❌ Error creating message:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log(`🔴 Client disconnected: ${socket.id}`);
    });
  });

  return io;
}
