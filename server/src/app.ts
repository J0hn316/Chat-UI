import express from 'express';
import cors from 'cors';

import userRoutes from './routes/userRoutes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Use user routes
app.use('/auth', userRoutes);

// Routes
app.get('/', (req, res) => {
  res.send('Chat-UI API is running!');
});

export default app;
