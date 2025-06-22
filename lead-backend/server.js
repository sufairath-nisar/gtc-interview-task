import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';

import leadRoutes from './routes/leadRoutes.js';
import rateLimiter from './middleware/rateLimiter.js';
import authMiddleware from './middleware/authMiddleware.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Apply both middlewares globally
app.use(rateLimiter);
app.use(authMiddleware);

app.use('/api/leads', leadRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch(err => console.error('DB error:', err));
