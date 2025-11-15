import express from 'express';
import { generatePDFReport } from '../services/pdfService.js';

const router = express.Router();

router.post('/generate', async (req, res) => {
  try {
    const { projectData, complianceResult } = req.body;

    const reportHTML = await generatePDFReport(projectData, complianceResult);

    // Return HTML for now - can be converted to PDF on client side or using puppeteer
    res.setHeader('Content-Type', 'text/html');
    res.send(reportHTML);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/download', async (req, res) => {
  try {
    const { projectData, complianceResult } = req.body;

    const reportHTML = await generatePDFReport(projectData, complianceResult);

    // Set headers for download
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', `attachment; filename="UDCPR_Report_${Date.now()}.html"`);
    res.send(reportHTML);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
