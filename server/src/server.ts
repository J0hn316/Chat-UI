import express from 'express';
import cors from 'cors';

import userRoutes from './routes/userRoutes';
import messageRoutes from './routes/messageRoutes';

const app = express();

// Middleware
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);
app.use(express.json());

// Use user routes
app.use('/api/users', userRoutes);

// Use message routes
app.use('/api/messages', messageRoutes);

export default app;
