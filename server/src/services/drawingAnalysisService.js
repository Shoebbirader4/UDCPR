import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Initialize OpenAI lazily - check when needed
function getOpenAIClient() {
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
    return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return null;
}

/**
 * Convert PDF first page to image using sharp
 */
async function convertPdfToImage(pdfPath) {
  // For now, we'll handle images directly
  // PDF conversion would require pdf2pic or similar
  return pdfPath;
}

/**
 * Prepare image for OpenAI Vision API
 */
async function prepareImageForVision(filePath) {
  try {
    // Check file extension
    const ext = path.extname(filePath).toLowerCase();
    
    // DWG files cannot be processed directly
    if (ext === '.dwg') {
      throw new Error('DWG files must be converted to PDF, JPG, or PNG format first. Please export your AutoCAD drawing as an image or PDF and upload again.');
    }
    
    // PDF files need special handling
    if (ext === '.pdf') {
      throw new Error('PDF support coming soon. For now, please convert your PDF to JPG or PNG format.');
    }
    
    // Read file and convert to base64
    const imageBuffer = await fs.promises.readFile(filePath);
    
    // Optimize image size if needed (max 20MB for OpenAI)
    const metadata = await sharp(imageBuffer).metadata();
    
    let processedBuffer = imageBuffer;
    
    // If image is too large, resize it
    if (imageBuffer.length > 20 * 1024 * 1024) {
      processedBuffer = await sharp(imageBuffer)
        .resize(2000, 2000, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toBuffer();
    }
    
    const base64Image = processedBuffer.toString('base64');
    const mimeType = metadata.format === 'png' ? 'image/png' : 'image/jpeg';
    
    return `data:${mimeType};base64,${base64Image}`;
  } catch (error) {
    console.error('Error preparing image:', error);
    throw error;
  }
}

/**
 * Analyze architectural drawing using GPT-4 Vision
 */
export async function analyzeDrawingWithVision(filePath, projectContext = {}) {
  const openai = getOpenAIClient();
  if (!openai) {
    throw new Error('OpenAI API key not configured');
  }

  try {
    console.log('Analyzing drawing:', filePath);
    
    // Prepare image
    const imageData = await prepareImageForVision(filePath);
    
    // Create detailed prompt for architectural analysis
    const prompt = `You are an expert architectural plan analyzer specializing in UDCPR 2020 compliance for Maharashtra, India.

Analyze this architectural drawing and extract the following information:

1. PLOT DETAILS:
   - Plot dimensions (length x width in meters)
   - Total plot area (in sq.m)
   - Plot shape and orientation
   - Road width (if visible)

2. BUILDING DETAILS:
   - Building footprint dimensions
   - Total built-up area (if multiple floors, specify per floor)
   - Number of floors/stories
   - Building height (if mentioned)

3. SETBACKS:
   - Front setback (distance from plot boundary to building)
   - Rear setback
   - Side setbacks (left and right)
   - All measurements in meters

4. FSI CALCULATION:
   - Calculate FSI = Total Built-up Area / Plot Area
   - Show the calculation

5. PARKING:
   - Number of parking spaces visible
   - Type of parking (open/covered/basement)
   - Parking area

6. OTHER FEATURES:
   - Amenity spaces (if any)
   - Open spaces
   - Any special features

7. SCALE & DIMENSIONS:
   - Drawing scale (if mentioned)
   - All dimensions visible on the drawing

Context provided:
- District: ${projectContext.district || 'Not specified'}
- Zone: ${projectContext.zone || 'Not specified'}
- Land Use: ${projectContext.landUse || 'Not specified'}

IMPORTANT:
- Extract ALL visible dimensions and measurements
- If something is not visible or unclear, mention "Not visible in drawing"
- Be precise with measurements
- Calculate FSI accurately
- Identify any potential UDCPR violations you can see

Provide the analysis in a structured JSON format with clear sections.`;

    // Call GPT-4 Vision API
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // GPT-4 with vision
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: imageData,
                detail: "high" // High detail for architectural drawings
              }
            }
          ]
        }
      ],
      max_tokens: 2000,
      temperature: 0.3 // Lower temperature for more precise analysis
    });

    const analysis = response.choices[0].message.content;
    
    console.log('Drawing analysis complete');
    
    return {
      success: true,
      analysis,
      rawResponse: analysis,
      usage: response.usage,
      model: "gpt-4o"
    };

  } catch (error) {
    console.error('Drawing analysis error:', error);
    throw new Error(`Drawing analysis failed: ${error.message}`);
  }
}

/**
 * Parse AI analysis and extract structured data
 */
export function parseDrawingAnalysis(analysisText) {
  try {
    // Try to parse as JSON first
    const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // If not JSON, parse text format
    const extracted = {
      plotArea: null,
      builtUpArea: null,
      calculatedFSI: null,
      setbacks: {
        front: null,
        rear: null,
        side1: null,
        side2: null
      },
      parkingSpaces: null,
      floors: null,
      height: null,
      notes: []
    };
    
    // Extract plot area
    const plotAreaMatch = analysisText.match(/plot area[:\s]+(\d+\.?\d*)\s*sq\.?m/i);
    if (plotAreaMatch) extracted.plotArea = parseFloat(plotAreaMatch[1]);
    
    // Extract built-up area
    const builtUpMatch = analysisText.match(/built-?up area[:\s]+(\d+\.?\d*)\s*sq\.?m/i);
    if (builtUpMatch) extracted.builtUpArea = parseFloat(builtUpMatch[1]);
    
    // Extract FSI
    const fsiMatch = analysisText.match(/FSI[:\s=]+(\d+\.?\d*)/i);
    if (fsiMatch) extracted.calculatedFSI = parseFloat(fsiMatch[1]);
    
    // Extract setbacks
    const frontMatch = analysisText.match(/front setback[:\s]+(\d+\.?\d*)\s*m/i);
    if (frontMatch) extracted.setbacks.front = parseFloat(frontMatch[1]);
    
    const rearMatch = analysisText.match(/rear setback[:\s]+(\d+\.?\d*)\s*m/i);
    if (rearMatch) extracted.setbacks.rear = parseFloat(rearMatch[1]);
    
    const sideMatch = analysisText.match(/side setback[:\s]+(\d+\.?\d*)\s*m/i);
    if (sideMatch) {
      extracted.setbacks.side1 = parseFloat(sideMatch[1]);
      extracted.setbacks.side2 = parseFloat(sideMatch[1]);
    }
    
    // Extract parking
    const parkingMatch = analysisText.match(/(\d+)\s*parking/i);
    if (parkingMatch) extracted.parkingSpaces = parseInt(parkingMatch[1]);
    
    // Extract floors
    const floorsMatch = analysisText.match(/(\d+)\s*floor|(\d+)\s*stor/i);
    if (floorsMatch) extracted.floors = parseInt(floorsMatch[1] || floorsMatch[2]);
    
    extracted.rawAnalysis = analysisText;
    
    return extracted;
    
  } catch (error) {
    console.error('Error parsing analysis:', error);
    return {
      rawAnalysis: analysisText,
      parseError: error.message
    };
  }
}

/**
 * Validate extracted data against UDCPR rules
 */
export function validateAgainstUDCPR(extractedData, requiredParams) {
  const violations = [];
  const recommendations = [];
  
  // FSI validation
  if (extractedData.calculatedFSI && requiredParams.permissibleFSI) {
    if (extractedData.calculatedFSI > requiredParams.permissibleFSI) {
      violations.push({
        type: 'FSI Exceeded',
        severity: 'high',
        message: `Calculated FSI ${extractedData.calculatedFSI.toFixed(2)} exceeds permissible ${requiredParams.permissibleFSI}`,
        extracted: extractedData.calculatedFSI,
        required: requiredParams.permissibleFSI
      });
      recommendations.push('Reduce built-up area or apply for additional FSI through TDR');
    }
  }
  
  // Setback validation
  if (requiredParams.requiredSetbacks) {
    const required = requiredParams.requiredSetbacks;
    const provided = extractedData.setbacks;
    
    ['front', 'rear', 'side1', 'side2'].forEach(side => {
      if (provided[side] !== null && required[side]) {
        if (provided[side] < required[side]) {
          violations.push({
            type: 'Setback Violation',
            severity: 'high',
            message: `${side} setback ${provided[side]}m is less than required ${required[side]}m`,
            extracted: provided[side],
            required: required[side]
          });
          recommendations.push(`Increase ${side} setback to minimum ${required[side]}m`);
        }
      }
    });
  }
  
  // Parking validation
  if (extractedData.parkingSpaces !== null && requiredParams.requiredParking) {
    if (extractedData.parkingSpaces < requiredParams.requiredParking) {
      violations.push({
        type: 'Insufficient Parking',
        severity: 'medium',
        message: `Provided ${extractedData.parkingSpaces} parking spaces, required ${requiredParams.requiredParking}`,
        extracted: extractedData.parkingSpaces,
        required: requiredParams.requiredParking
      });
      recommendations.push(`Add ${requiredParams.requiredParking - extractedData.parkingSpaces} more parking spaces`);
    }
  }
  
  const status = violations.length === 0 ? 'pass' : 'fail';
  
  return {
    status,
    violations,
    recommendations,
    summary: `${violations.length} violations found from drawing analysis`,
    extractedData
  };
}
