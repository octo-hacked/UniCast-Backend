
import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  emailVerified: Date,
  image: String, // Corresponds to profilePicture
  isVerified: { type: Boolean, default: false },
  onboardingStatus: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);