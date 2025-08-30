import express from 'express';
import cors from 'cors';

import userRoutes from './routes/userRoutes';
import statsRoutes from './routes/statsRoutes';
import messageRoutes from './routes/messageRoutes';
import passwordRoutes from './routes/passwordRoutes';

const app = express();

// Middleware
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);
app.use(express.json());

app.use('/api', passwordRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/messages', messageRoutes);

export default app;
