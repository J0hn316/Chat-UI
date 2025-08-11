import type { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

import Message from '../models/messageModel';

type Presence = {
  sockets: Set<string>; // sockets for that user
  lastSeen?: Date | null; // when they were last online
};

const presence = new Map<string, Presence>();

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
    let currentUserId: string | null = null;

    // Client joins its own user room after connect
    socket.on('join', (userId: string) => {
      if (!userId) return;

      currentUserId = userId;
      socket.join(userId);
      console.log(`🔵 Client ${socket.id} joined room: ${userId}`);

      // Mark online
      const entry = presence.get(userId) ?? {
        sockets: new Set(),
        lastSeen: null,
      };

      entry.sockets.add(socket.id);
      entry.lastSeen = null; // online
      presence.set(userId, entry);

      // broadcast presence to everyone (or to friends/contacts if you have that)
      io.emit('presence:online', { userId });
    });

    // --- Typing indicators ---
    // Forward "typing" to the recipient's room
    socket.on('typing', ({ to, from }: { to: string; from: string }) => {
      if (!to || !from) return;
      io.to(to).emit('userTyping', { from });
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
        await newMessage.populate('sender', 'username');
        await newMessage.populate('recipient', 'username');

        console.log('📩 Message created:', newMessage);

        // Emit the new message to both sender and recipient
        io.to(senderId).emit('message:new', newMessage);
        io.to(recipientId).emit('message:new', newMessage);
      } catch (err) {
        console.error('❌ Error creating message:', err);
      }
    });

    socket.on('disconnect', () => {
      if (!currentUserId) return;

      const entry = presence.get(currentUserId);
      if (!entry) return;
      entry.sockets.delete(socket.id);

      if (entry.sockets.size === 0) {
        // user fully offline
        entry.lastSeen = new Date();
        presence.set(currentUserId, entry);
        io.emit('presence:offline', {
          userId: currentUserId,
          lastSeen: entry.lastSeen?.toISOString() ?? null,
        });
      }
      console.log(`🔴 Client disconnected: ${socket.id}`);
    });
  });

  // expose helper for routes/controllers
  (io as any).presence = presence;

  return io;
}
