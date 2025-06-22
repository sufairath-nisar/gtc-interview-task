import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  source: String,
  submitted_at: Date,
  isActive: { type: Boolean, default: true }
});

export default mongoose.model('Lead', leadSchema);
