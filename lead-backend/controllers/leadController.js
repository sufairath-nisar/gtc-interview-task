import Lead from '../models/leadModel.js';
import WebhookLog from '../models/webhookLog.js';
import axios from 'axios';

export const createLead = async (req, res) => {
  try {
    const lead = await Lead.create(req.body);
    try {
      const response = await axios.post('https://fakecrm.com/api/leads', lead);
      await WebhookLog.create({ leadId: lead._id, status: 'success', response: JSON.stringify(response.data) });
    } catch (err) {
      await WebhookLog.create({ leadId: lead._id, status: 'failed', response: err.message });
    }
    res.status(201).json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getLeads = async (req, res) => {
  try {
    const { source, startDate, endDate, page = 1, limit = 10 } = req.query;
    const query = { isActive: true };
    if (source) query.source = source;
    if (startDate && endDate) {
      query.submitted_at = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const leads = await Lead.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    res.status(200).json(leads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead || !lead.isActive) return res.status(404).json({ message: 'Lead not found' });
    res.status(200).json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.status(200).json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteLead = async (req, res) => {
  try {
    await Lead.findByIdAndUpdate(req.params.id, { isActive: false });
    res.status(200).json({ message: 'Lead soft-deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
