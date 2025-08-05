import mongoose from 'mongoose';
import { createServer } from 'http';

import app from './server';
import { setupSocket } from './utils/socket';

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || '';

// Create HTTP server
const httpServer = createServer(app);

// Setup Socket.IO
const io = setupSocket(httpServer);

// Make io available in the app
app.set('io', io);

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
