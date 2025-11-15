# Drawing Analysis Guide - AI Compliance Check

## Current Status

### ✅ Fully Supported Formats
- **JPG/JPEG** - Best for photos of drawings or exported images
- **PNG** - Best for high-quality screenshots or exports

### ⚠️ Coming Soon
- **PDF** - Requires PDF-to-image conversion library
- **DWG** - Requires AutoCAD file converter

## How to Use AI Drawing Analysis

### For JPG/PNG Files (Ready Now!)

1. **Go to:** http://localhost:3000/compliance

2. **Upload your drawing:**
   - Click "Choose File"
   - Select JPG or PNG file
   - Max size: 20MB

3. **Enter project details:**
   - Proposed FSI
   - Permissible FSI
   - Setbacks (if known)

4. **Click "Run Compliance Check"**

5. **AI will extract:**
   - Plot dimensions and area
   - Building footprint
   - Built-up area
   - FSI calculation
   - Setback measurements
   - Parking spaces
   - Number of floors
   - Any visible violations

### For DWG Files (Workaround)

Since DWG files are binary AutoCAD files, they need to be converted first:

**Method 1: Export from AutoCAD**
1. Open your DWG file in AutoCAD
2. Go to: File → Export → Image
3. Choose format: JPG or PNG
4. Set resolution: High (300 DPI or more)
5. Save and upload the exported image

**Method 2: Use AutoCAD Screenshot**
1. Open DWG in AutoCAD
2. Zoom to fit the entire drawing
3. Take a high-resolution screenshot
4. Save as PNG
5. Upload to UDCPR platform

**Method 3: Print to PDF, then convert**
1. Open DWG in AutoCAD
2. Print to PDF
3. Use online tool to convert PDF to JPG
4. Upload the JPG

### For PDF Files (Workaround)

**Method 1: Convert PDF to Image**
1. Use online tool: pdf2jpg.net or similar
2. Select first page (usually the plan)
3. Download as JPG
4. Upload to platform

**Method 2: Screenshot**
1. Open PDF in viewer
2. Zoom to fit
3. Take screenshot
4. Save as PNG
5. Upload

## What AI Can Extract

### From Good Quality Drawings:

✅ **Plot Details:**
- Plot dimensions (length × width)
- Total plot area
- Plot shape
- Road width (if marked)

✅ **Building Details:**
- Building footprint
- Built-up area per floor
- Total built-up area
- Number of floors
- Building height (if marked)

✅ **Setbacks:**
- Front setback distance
- Rear setback distance
- Side setbacks (left & right)
- All in meters

✅ **FSI Calculation:**
- Automatic FSI = Built-up ÷ Plot Area
- Shows calculation steps

✅ **Parking:**
- Number of parking spaces
- Parking type (open/covered)
- Parking area

✅ **Other Features:**
- Amenity spaces
- Open spaces
- Special features

### Requirements for Best Results:

📐 **Drawing Quality:**
- Clear, high-resolution image
- All dimensions visible
- Scale mentioned
- Proper labels

📏 **Dimensions:**
- Plot boundaries marked
- Building dimensions shown
- Setbacks indicated
- Scale bar or ratio

🏗️ **Details:**
- Floor plan clearly visible
- Parking areas marked
- Amenity spaces labeled
- North direction (helpful)

## Example Workflow

### Scenario: Residential Building Compliance Check

**Step 1: Prepare Drawing**
```
Original: building_plan.dwg (AutoCAD file)
↓
Export from AutoCAD as: building_plan.jpg (300 DPI)
↓
File size: 2.5 MB ✓
```

**Step 2: Upload & Analyze**
```
Upload: building_plan.jpg
AI Processing: ~30 seconds
Result: Extracted data + Analysis
```

**Step 3: AI Extracts**
```
Plot Area: 500 sq.m
Built-up Area: 750 sq.m
Calculated FSI: 1.5
Setbacks:
  - Front: 4.5m
  - Rear: 3m
  - Sides: 3m each
Parking: 10 spaces
Floors: 5
```

**Step 4: Compliance Check**
```
Compare with UDCPR:
✓ FSI: 1.5 ≤ 2.0 (Permissible)
✗ Front Setback: 4.5m < 5m (Required)
✓ Parking: 10 ≥ 10 (Required)

Result: 1 violation found
Recommendation: Increase front setback to 5m
```

## Error Messages & Solutions

### "DWG files must be converted to PDF, JPG, or PNG"
**Solution:** Export your DWG as image from AutoCAD

### "PDF support coming soon"
**Solution:** Convert PDF to JPG using online tool

### "Failed to prepare image for analysis"
**Solution:** 
- Check file is not corrupted
- Ensure file size < 20MB
- Try converting to PNG

### "Drawing analysis failed"
**Solution:**
- Ensure drawing is clear and readable
- Check all dimensions are visible
- Try higher resolution image
- Manually enter data if AI fails

## Tips for Best Results

### 1. Image Quality
- Use 300 DPI or higher
- Ensure text is readable
- Avoid blurry images
- Good contrast (black lines on white)

### 2. Drawing Preparation
- Include scale bar or ratio
- Mark all dimensions clearly
- Label all spaces
- Show setback lines

### 3. File Format
- JPG: Good for photos, smaller file size
- PNG: Better quality, larger file size
- Avoid: Compressed or low-quality images

### 4. What to Include
- Site plan with plot boundaries
- Building footprint clearly marked
- Dimension lines visible
- Parking layout shown
- Setback measurements indicated

## Future Enhancements

### Coming Soon:
- ✨ Direct PDF support (no conversion needed)
- ✨ DWG file support (direct AutoCAD reading)
- ✨ Multi-page PDF analysis
- ✨ 3D model analysis
- ✨ Automatic violation detection
- ✨ Side-by-side comparison with UDCPR
- ✨ Annotated output with highlights

### Planned Features:
- Batch processing (multiple drawings)
- Drawing comparison (before/after)
- Automatic report generation
- Export to PDF with annotations
- Integration with AutoCAD plugin

## Technical Details

### AI Model
- **Model:** GPT-4o (GPT-4 with vision)
- **Provider:** OpenAI
- **Capabilities:** Image understanding, text extraction, calculation
- **Accuracy:** High for clear, well-labeled drawings

### Processing
- **Max file size:** 20MB
- **Processing time:** 20-60 seconds
- **Image optimization:** Automatic resizing if needed
- **Output:** Structured JSON + Natural language

### Limitations
- Cannot read very small text
- Requires clear dimension markings
- May miss unlabeled features
- Best with standard architectural drawings

## Support

### If AI Analysis Fails:
1. Check drawing quality
2. Try different image format
3. Manually enter data in form
4. Contact support with drawing sample

### For Best Support:
- Provide clear error message
- Share drawing (if possible)
- Describe what was expected
- Include project context

## Conclusion

The AI Drawing Analysis feature is **fully functional for JPG/PNG files** and provides accurate extraction of:
- Plot and building dimensions
- FSI calculations
- Setback measurements
- Parking counts
- Compliance violations

For DWG and PDF files, simple conversion to JPG/PNG enables full functionality.

**Ready to use now with image files!** 🎉
