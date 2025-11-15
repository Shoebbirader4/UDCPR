import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { 
    type: String, 
    enum: ['Architect', 'StructuralEngineer', 'Developer', 'Authority'],
    required: true 
  },
  subscriptionStatus: { 
    type: String, 
    enum: ['free', 'pro', 'enterprise'],
    default: 'free'
  },
  organization: String,
  subscriptionExpiry: Date
}, { timestamps: true });

export default mongoose.model('User', userSchema);
