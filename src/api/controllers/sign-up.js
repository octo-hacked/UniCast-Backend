// POST /api/auth/signup
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from '../models/user.model.js';
import { config } from '../../config/env.js';

export const signUpHandler = async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: "All fields required" });
  }

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      email,
      name,
      password: hashedPassword,
      onboardingStatus: "not_started",
      isVerified: false,
    });

    // Create JWT token for automatic login
    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        onboardingStatus: user.onboardingStatus,
        isVerified: user.isVerified,
      },
      config.auth.secret,
      { expiresIn: '7d' } // Token expires in 7 days
    );

    // Set session data (if using sessions)
    req.session.user = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      onboardingStatus: user.onboardingStatus,
      isVerified: user.isVerified,
    };

    return res.status(201).json({
      message: "User created and logged in successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        onboardingStatus: user.onboardingStatus,
        isVerified: user.isVerified,
      },
      token, // Include JWT token for client-side storage
    });

  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ error: "Internal server error" });
  }
};