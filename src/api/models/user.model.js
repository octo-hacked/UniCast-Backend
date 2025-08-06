import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  password: String, // Added password field for credentials login
  emailVerified: Date,
  image: String, // Corresponds to profilePicture
  provider: { type: String, default: 'credentials' }, // Track auth provider
  isVerified: { type: Boolean, default: false },
  onboardingStatus: { type: String, default: 'not_started' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);