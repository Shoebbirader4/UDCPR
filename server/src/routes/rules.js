import express from 'express';
import Rule from '../models/Rule.js';

const router = express.Router();

// Search rules with AI-powered semantic search
router.get('/search', async (req, res) => {
  try {
    const { query, chapter, section } = req.query;
    let filter = {};
    
    if (chapter) filter.chapter = chapter;
    if (section) filter.section = section;
    
    if (query) {
      filter.$text = { $search: query };
    }
    
    const rules = await Rule.find(filter).limit(20);
    res.json(rules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get rule by ID
router.get('/:id', async (req, res) => {
  try {
    const rule = await Rule.findById(req.params.id);
    if (!rule) return res.status(404).json({ error: 'Rule not found' });
    res.json(rule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
