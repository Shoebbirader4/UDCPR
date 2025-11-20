import express from 'express';
import Rule from '../models/Rule.js';

const router = express.Router();

// GET /api/regulations/chapters - Get all chapters with rule counts
router.get('/chapters', async (req, res) => {
  try {
    const chapters = await Rule.aggregate([
      {
        $group: {
          _id: '$chapter',
          title: { $first: '$chapterTitle' },
          ruleCount: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          number: '$_id',
          title: '$title',
          ruleCount: 1
        }
      },
      { $sort: { number: 1 } }
    ]);

    res.json(chapters);
  } catch (error) {
    console.error('Error fetching chapters:', error);
    res.status(500).json({ error: 'Failed to fetch chapters' });
  }
});

// GET /api/regulations/chapter/:number/regulations - Get regulations for a chapter
router.get('/chapter/:number/regulations', async (req, res) => {
  try {
    const chapterNumber = parseInt(req.params.number);
    
    const regulations = await Rule.aggregate([
      { $match: { chapter: chapterNumber } },
      {
        $group: {
          _id: '$regulation',
          title: { $first: '$regulationTitle' },
          ruleCount: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          number: '$_id',
          title: '$title',
          ruleCount: 1
        }
      },
      { $sort: { number: 1 } }
    ]);

    res.json(regulations);
  } catch (error) {
    console.error('Error fetching regulations:', error);
    res.status(500).json({ error: 'Failed to fetch regulations' });
  }
});

// GET /api/regulations/regulation/:number - Get rules for a regulation
router.get('/regulation/:number', async (req, res) => {
  try {
    const regulationNumber = req.params.number;
    
    const rules = await Rule.find({ 
      regulation: regulationNumber 
    })
    .select('reference clause summary category applicableZones hasTable hasFormula')
    .sort({ clause: 1 });

    res.json(rules);
  } catch (error) {
    console.error('Error fetching rules:', error);
    res.status(500).json({ error: 'Failed to fetch rules' });
  }
});

// GET /api/regulations/stats - Get overall statistics
router.get('/stats', async (req, res) => {
  try {
    const totalRules = await Rule.countDocuments();
    
    const chapterCount = await Rule.distinct('chapter');
    const regulationCount = await Rule.distinct('regulation');
    
    const categories = await Rule.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat._id] = cat.count;
    });

    res.json({
      totalRules,
      totalChapters: chapterCount.length,
      totalRegulations: regulationCount.length,
      categories: categoryMap
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;
