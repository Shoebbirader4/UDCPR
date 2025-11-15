import express from 'express';
import { calculateAll } from '../services/comprehensiveCalculatorService.js';

const router = express.Router();

router.post('/calculate', async (req, res) => {
  try {
    const params = {
      district: req.body.district || 'Pune',
      zone: req.body.zone || 'Residential',
      plotArea: parseFloat(req.body.plotArea) || 0,
      roadWidth: parseFloat(req.body.roadWidth) || 9,
      landUse: req.body.landUse || 'Residential',
      floors: parseInt(req.body.floors) || 0,
      buildingHeight: parseFloat(req.body.buildingHeight) || 0,
      isTOD: req.body.isTOD === true || req.body.isTOD === 'true',
      hasHeritage: req.body.hasHeritage === true || req.body.hasHeritage === 'true',
      builtUpArea: parseFloat(req.body.builtUpArea) || 0,
      dwellingUnits: parseInt(req.body.dwellingUnits) || 0,
      carpetAreaPerUnit: parseFloat(req.body.carpetAreaPerUnit) || 0
    };
    
    const results = calculateAll(params);
    
    res.json(results);
  } catch (error) {
    console.error('Calculator error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
