import mongoose from 'mongoose';

const webhookLogSchema = new mongoose.Schema({
  leadId: mongoose.Schema.Types.ObjectId,
  status: String,
  response: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('WebhookLog', webhookLogSchema);
