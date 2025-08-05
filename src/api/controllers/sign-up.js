// POST /api/auth/signup
import bcrypt from 'bcrypt';
import userModel from '../models/user.model.js';

export const signUpHandler = async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: "All fields required" });
  }

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

  return res.status(201).json({ message: "User created", userId: user._id });
};
