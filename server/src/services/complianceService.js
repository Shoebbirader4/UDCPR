import { analyzeDrawingWithVision, parseDrawingAnalysis, validateAgainstUDCPR } from './drawingAnalysisService.js';
import Rule from '../models/Rule.js';

export async function checkCompliance(projectData, drawingFile) {
  const violations = [];
  const recommendations = [];
  const appliedRules = [];
  let drawingAnalysis = null;
  let extractedData = null;
  
  // Fetch relevant rules from database
  let relevantRules = [];
  try {
    const ruleCategories = ['FSI', 'Setback', 'Height', 'Parking'];
    relevantRules = await Rule.find({
      category: { $in: ruleCategories }
    })
    .select('reference clause summary category chapter regulation applicableZones')
    .limit(50)
    .lean();
    
    console.log(`Loaded ${relevantRules.length} relevant rules from database for compliance check`);
  } catch (error) {
    console.error('Error loading rules:', error);
  }
  
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
  
  // Enhanced validation using real rules from database
  if (projectData.proposedFSI && projectData.permissibleFSI) {
    // Find FSI rules
    const fsiRules = relevantRules.filter(r => r.category === 'FSI');
    
    if (projectData.proposedFSI > projectData.permissibleFSI) {
      const applicableRule = fsiRules.find(r => 
        r.summary.toLowerCase().includes('permissible') || 
        r.summary.toLowerCase().includes('maximum')
      );
      
      violations.push({
        type: 'FSI Exceeded',
        severity: 'high',
        message: `Proposed FSI ${projectData.proposedFSI} exceeds permissible ${projectData.permissibleFSI}`,
        ruleReference: applicableRule ? applicableRule.reference : 'UDCPR-5.2',
        ruleClause: applicableRule ? applicableRule.clause : 'Chapter 5 - FSI Regulations'
      });
      
      appliedRules.push({
        reference: applicableRule ? applicableRule.reference : 'UDCPR-5.2',
        clause: applicableRule ? applicableRule.clause : 'FSI Limits',
        result: 'violated'
      });
      
      recommendations.push('Reduce built-up area or apply for additional FSI through TDR (Refer UDCPR Chapter 5)');
    } else {
      appliedRules.push({
        reference: 'UDCPR-5.2',
        clause: 'FSI Compliance',
        result: 'compliant'
      });
    }
  }
  
  // Enhanced setback validation using real rules
  const requiredSetbacks = projectData.requiredSetbacks || {};
  const providedSetbacks = projectData.providedSetbacks || {};
  const setbackRules = relevantRules.filter(r => r.category === 'Setback');
  
  ['front', 'rear', 'side1', 'side2'].forEach(side => {
    if (providedSetbacks[side] && requiredSetbacks[side]) {
      const applicableRule = setbackRules.find(r => 
        r.summary.toLowerCase().includes(side) || 
        r.summary.toLowerCase().includes('margin')
      );
      
      if (providedSetbacks[side] < requiredSetbacks[side]) {
        violations.push({
          type: 'Setback Violation',
          severity: 'high',
          message: `${side} setback ${providedSetbacks[side]}m is less than required ${requiredSetbacks[side]}m`,
          ruleReference: applicableRule ? applicableRule.reference : 'UDCPR-6.2',
          ruleClause: applicableRule ? applicableRule.clause : `Chapter 6 - ${side} Setback Requirements`
        });
        
        appliedRules.push({
          reference: applicableRule ? applicableRule.reference : 'UDCPR-6.2',
          clause: `${side} Setback`,
          result: 'violated'
        });
      } else {
        appliedRules.push({
          reference: applicableRule ? applicableRule.reference : 'UDCPR-6.2',
          clause: `${side} Setback`,
          result: 'compliant'
        });
      }
    }
  });
  
  // Check parking requirements if provided
  if (projectData.requiredParking && projectData.providedParking) {
    const parkingRules = relevantRules.filter(r => r.category === 'Parking');
    const applicableRule = parkingRules[0];
    
    if (projectData.providedParking < projectData.requiredParking) {
      violations.push({
        type: 'Parking Deficiency',
        severity: 'high',
        message: `Provided parking ${projectData.providedParking} ECS is less than required ${projectData.requiredParking} ECS`,
        ruleReference: applicableRule ? applicableRule.reference : 'UDCPR-8.1',
        ruleClause: applicableRule ? applicableRule.clause : 'Chapter 8 - Parking Requirements'
      });
      
      appliedRules.push({
        reference: applicableRule ? applicableRule.reference : 'UDCPR-8.1',
        clause: 'Parking Requirements',
        result: 'violated'
      });
      
      recommendations.push('Increase parking spaces or apply for parking relaxation (Refer UDCPR Chapter 8)');
    } else {
      appliedRules.push({
        reference: applicableRule ? applicableRule.reference : 'UDCPR-8.1',
        clause: 'Parking Requirements',
        result: 'compliant'
      });
    }
  }
  
  // Check building height if provided
  if (projectData.proposedHeight && projectData.permissibleHeight) {
    const heightRules = relevantRules.filter(r => r.category === 'Height');
    const applicableRule = heightRules[0];
    
    if (projectData.proposedHeight > projectData.permissibleHeight) {
      violations.push({
        type: 'Height Exceeded',
        severity: 'medium',
        message: `Proposed height ${projectData.proposedHeight}m exceeds permissible ${projectData.permissibleHeight}m`,
        ruleReference: applicableRule ? applicableRule.reference : 'UDCPR-7.1',
        ruleClause: applicableRule ? applicableRule.clause : 'Chapter 7 - Height Restrictions'
      });
      
      appliedRules.push({
        reference: applicableRule ? applicableRule.reference : 'UDCPR-7.1',
        clause: 'Height Restrictions',
        result: 'violated'
      });
      
      recommendations.push('Reduce building height to comply with UDCPR Chapter 7 regulations');
    } else {
      appliedRules.push({
        reference: applicableRule ? applicableRule.reference : 'UDCPR-7.1',
        clause: 'Height Restrictions',
        result: 'compliant'
      });
    }
  }
  
  const status = violations.length === 0 ? 'pass' : 'fail';
  const compliantRules = appliedRules.filter(r => r.result === 'compliant').length;
  const violatedRules = appliedRules.filter(r => r.result === 'violated').length;
  
  return {
    status,
    violations,
    recommendations,
    appliedRules,
    summary: violations.length === 0 
      ? `✅ All ${compliantRules} checked rules are compliant` 
      : `❌ ${violatedRules} violations found (${compliantRules} rules compliant)`,
    drawingAnalysis,
    extractedData,
    hasDrawingAnalysis: !!drawingAnalysis,
    rulesChecked: appliedRules.length,
    databaseRulesAvailable: relevantRules.length,
    timestamp: new Date()
  };
}
