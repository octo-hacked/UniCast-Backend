import app from './app.js';
import mongoose from 'mongoose';
import { config } from './config/env.js';

const { port, mongoURI } = config;

mongoose.connect(mongoURI)
  .then(() => {
    console.log('MongoDB connected successfully');
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
  });