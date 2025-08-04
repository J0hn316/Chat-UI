import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

import app from './server';

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || '';

// Create HTTP server
const httpServer = createServer(app);

// Initialize Socket.IO
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: 'http://localhost:5173', // Adjust this to your client URL
    credentials: true,
  },
});

app.set('io', io);

// Listen for Socket.IO connections
io.on('connection', (socket) => {
  console.log(`🟢 New client connected: ${socket.id}`);

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`🔴 Client disconnected: ${socket.id}`);
  });
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });
