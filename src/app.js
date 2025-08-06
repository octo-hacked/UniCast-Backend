// src/app.js
import express from 'express';
import session from 'express-session';
import mainRouter from './api/routes/index.js';
import { config } from './config/env.js';
import cors from 'cors';

const app = express();

app.use(express.json());
app.set("trust proxy", true)
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:8080', // specific origin
  credentials: true,              // allow credentials
}));

// Session middleware required for Auth.js
app.use(session({
  secret: config.auth.secret,
  resave: false,
  saveUninitialized: true,
}));

// Main application routes
app.use('/api', mainRouter);

export default app;