import jwt from 'jsonwebtoken';
import { config } from '../../config/env.js';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    // Check if user is logged in via session (Auth.js)
    if (req.session?.user) {
      req.user = req.session.user;
      return next();
    }
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, config.auth.secret, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    jwt.verify(token, config.auth.secret, (err, user) => {
      if (!err) {
        req.user = user;
      }
    });
  } else if (req.session?.user) {
    req.user = req.session.user;
  }

  next();
};