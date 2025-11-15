import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { checkCompliance } from '../services/complianceService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const uploadsDir = path.join(__dirname, '../../uploads');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'drawing-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
  fileFilter: (req, file, cb) => {
    // Currently only JPG and PNG are fully supported for AI analysis
    const supportedTypes = ['.jpg', '.jpeg', '.png'];
    const plannedTypes = ['.pdf', '.dwg'];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (supportedTypes.includes(ext)) {
      cb(null, true);
    } else if (plannedTypes.includes(ext)) {
      // Allow upload but will show conversion message
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Supported: JPG, PNG. Coming soon: PDF, DWG'));
    }
  }
});

router.post('/check', upload.single('drawing'), async (req, res) => {
  try {
    const projectData = JSON.parse(req.body.projectData);
    const drawingFile = req.file;
    
    console.log('Compliance check requested');
    if (drawingFile) {
      console.log('Drawing file:', drawingFile.originalname, drawingFile.mimetype);
    }
    
    const result = await checkCompliance(projectData, drawingFile);
    
    res.json(result);
  } catch (error) {
    console.error('Compliance check error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Analyze drawing only (without compliance check)
router.post('/analyze-drawing', upload.single('drawing'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No drawing file provided' });
    }

    const { analyzeDrawingWithVision } = await import('../services/drawingAnalysisService.js');
    
    const context = req.body.context ? JSON.parse(req.body.context) : {};
    
    const result = await analyzeDrawingWithVision(req.file.path, context);
    
    res.json(result);
  } catch (error) {
    console.error('Drawing analysis error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
