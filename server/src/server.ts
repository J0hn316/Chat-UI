import express from 'express';
import cors from 'cors';

import userRoutes from './routes/userRoutes';
import messageRoutes from './routes/messageRoutes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Use user routes
app.use('/api/users', userRoutes);

// Use message routes
app.use('/api/messages', messageRoutes);

export default app;
