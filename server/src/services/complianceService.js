import { analyzeDrawingWithVision, parseDrawingAnalysis, validateAgainstUDCPR } from './drawingAnalysisService.js';

export async function checkCompliance(projectData, drawingFile) {
  const violations = [];
  const recommendations = [];
  let drawingAnalysis = null;
  let extractedData = null;
  
  // If drawing file is provided, analyze it with AI
  if (drawingFile && drawingFile.path) {
    try {
      console.log('Analyzing uploaded drawing with GPT-4 Vision...');
      
      // Analyze drawing with AI
      const analysisResult = await analyzeDrawingWithVision(drawingFile.path, {
        district: projectData.district,
        zone: projectData.zone,
        landUse: projectData.landUse
      });
      
      drawingAnalysis = analysisResult.analysis;
      
      // Parse the analysis to extract structured data
      extractedData = parseDrawingAnalysis(analysisResult.analysis);
      
      // Validate extracted data against UDCPR rules
      const validationResult = validateAgainstUDCPR(extractedData, {
        permissibleFSI: projectData.permissibleFSI,
        requiredSetbacks: projectData.requiredSetbacks,
        requiredParking: projectData.requiredParking
      });
      
      violations.push(...validationResult.violations);
      recommendations.push(...validationResult.recommendations);
      
      console.log('Drawing analysis complete:', validationResult.summary);
      
    } catch (error) {
      console.error('Drawing analysis error:', error);
      // Fall back to manual validation if AI analysis fails
      violations.push({
        type: 'Drawing Analysis Failed',
        severity: 'info',
        message: `Could not analyze drawing automatically: ${error.message}. Using manual data.`
      });
    }
  }
  
  // Manual validation (fallback or supplement to AI analysis)
  if (projectData.proposedFSI && projectData.permissibleFSI) {
    if (projectData.proposedFSI > projectData.permissibleFSI) {
      violations.push({
        type: 'FSI Exceeded (Manual Data)',
        severity: 'high',
        message: `Proposed FSI ${projectData.proposedFSI} exceeds permissible ${projectData.permissibleFSI}`
      });
      recommendations.push('Reduce built-up area or apply for additional FSI through TDR');
    }
  }
  
  // Check setback compliance from manual data
  const requiredSetbacks = projectData.requiredSetbacks || {};
  const providedSetbacks = projectData.providedSetbacks || {};
  
  ['front', 'rear', 'side1', 'side2'].forEach(side => {
    if (providedSetbacks[side] && requiredSetbacks[side]) {
      if (providedSetbacks[side] < requiredSetbacks[side]) {
        violations.push({
          type: 'Setback Violation (Manual Data)',
          severity: 'high',
          message: `${side} setback ${providedSetbacks[side]}m is less than required ${requiredSetbacks[side]}m`
        });
      }
    }
  });
  
  const status = violations.length === 0 ? 'pass' : 'fail';
  
  return {
    status,
    violations,
    recommendations,
    summary: `${violations.length} violations found`,
    drawingAnalysis,
    extractedData,
    hasDrawingAnalysis: !!drawingAnalysis,
    timestamp: new Date()
  };
}
