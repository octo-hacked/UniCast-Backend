// src/app.js
import express from 'express';
import session from 'express-session';
import mainRouter from './api/routes/index.js';
import { config } from './config/env.js';

const app = express();

app.use(express.json());
app.set("trust proxy", true)
app.use(express.urlencoded({ extended: true }));

// Session middleware required for Auth.js
app.use(session({
  secret: config.auth.secret,
  resave: false,
  saveUninitialized: true,
}));

// Main application routes
app.use('/api', mainRouter);

export default app;