import express from 'express';
import DistrictRule from '../models/DistrictRule.js';

const router = express.Router();

// Get all districts
router.get('/districts', async (req, res) => {
  try {
    const districts = await DistrictRule.distinct('district');
    res.json(districts.sort());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search rules by district
router.get('/search', async (req, res) => {
  try {
    const { district, category, query, zone, region } = req.query;
    let filter = { status: 'Active' };
    
    if (district) filter.district = district;
    if (category) filter.category = category;
    if (zone) filter.applicableZones = zone;
    if (region) filter.region = region;
    
    if (query) {
      filter.$text = { $search: query };
    }
    
    const rules = await DistrictRule.find(filter)
      .sort({ chapter: 1, section: 1, clause: 1 })
      .limit(500); // Increased limit to show more rules
      
    res.json(rules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get rule by ID
router.get('/:id', async (req, res) => {
  try {
    const rule = await DistrictRule.findById(req.params.id);
    if (!rule) return res.status(404).json({ error: 'Rule not found' });
    res.json(rule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get rules by chapter
router.get('/chapter/:chapter', async (req, res) => {
  try {
    const { district } = req.query;
    const filter = { chapter: req.params.chapter, status: 'Active' };
    if (district) filter.district = district;
    
    const rules = await DistrictRule.find(filter)
      .sort({ section: 1, clause: 1 });
    res.json(rules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get rules by category
router.get('/category/:category', async (req, res) => {
  try {
    const { district } = req.query;
    const filter = { category: req.params.category, status: 'Active' };
    if (district) filter.district = district;
    
    const rules = await DistrictRule.find(filter)
      .sort({ district: 1, chapter: 1 });
    res.json(rules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Compare rules across districts
router.post('/compare', async (req, res) => {
  try {
    const { districts, clause } = req.body;
    
    const rules = await DistrictRule.find({
      district: { $in: districts },
      clause: clause,
      status: 'Active'
    }).sort({ district: 1 });
    
    res.json(rules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const { district } = req.query;
    const filter = district ? { district, status: 'Active' } : { status: 'Active' };
    
    const stats = await DistrictRule.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    const totalRules = await DistrictRule.countDocuments(filter);
    const districts = await DistrictRule.distinct('district', filter);
    
    res.json({
      totalRules,
      totalDistricts: districts.length,
      byCategory: stats
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
