# 🧪 Drawing Analysis Testing Guide

## Quick Start Testing

### 1. Prerequisites Check

```bash
# Verify all dependencies are installed
cd server
npm install

# Check if uploads directory exists
ls uploads/
```

### 2. Environment Setup

```bash
# Copy .env.example to .env if not done
cp .env.example server/.env

# Edit server/.env and add your OpenAI API key
OPENAI_API_KEY=sk-your-actual-openai-key-here
```

### 3. Start the Application

```bash
# Terminal 1: Start backend
cd server
npm run dev

# Terminal 2: Start frontend
cd client
npm run dev
```

### 4. Access the Application

Open browser: `http://localhost:3000/compliance`

---

## 🎯 Test Scenarios

### Test 1: Basic Drawing Upload (No AI)

**Purpose**: Test file upload without AI analysis

**Steps**:
1. Go to Compliance Check page
2. Fill in manual project data:
   - Proposed FSI: 1.5
   - Permissible FSI: 2.0
3. Click "Run Compliance Check"
4. Should see: "Compliant" result

**Expected Result**: ✅ Pass with no violations

---

### Test 2: Drawing Upload with AI Analysis

**Purpose**: Test GPT-4 Vision integration

**Steps**:
1. Prepare a test drawing (PDF/JPG/PNG):
   - Simple floor plan with dimensions
   - Clear plot boundaries
   - Visible setback lines
   - Parking spaces marked

2. Upload the drawing file

3. Fill in project data:
   - Proposed FSI: 1.5
   - Permissible FSI: 2.0
   - Required setbacks: 5m front, 3m rear, 2m sides

4. Click "Run Compliance Check"

5. Wait 5-10 seconds for AI analysis

**Expected Result**:
- ✅ Blue "AI Drawing Analysis" card appears
- ✅ Shows extracted: Plot Area, Built-up Area, FSI, Parking
- ✅ Shows setback measurements
- ✅ "View Full AI Analysis" expandable section
- ✅ Compliance result with "AI Analyzed" badge

---

### Test 3: File Format Support

**Purpose**: Test different file formats

**Test Files**:
- ✅ PDF: Architectural plan
- ✅ JPG: Photo of drawing
- ✅ PNG: Digital drawing
- ✅ DWG: CAD file (if available)

**Steps**: Upload each format and verify AI analysis works

---

### Test 4: Large File Handling

**Purpose**: Test file size limits

**Steps**:
1. Upload file < 20MB: ✅ Should work
2. Upload file > 20MB: ❌ Should show error

**Expected**: Files are automatically resized if needed

---

### Test 5: FSI Violation Detection

**Purpose**: Test AI violation detection

**Steps**:
1. Upload drawing with high FSI
2. Set Permissible FSI: 1.0
3. Run check

**Expected Result**:
- ❌ "Non-Compliant" status
- 🔴 FSI violation shown
- 💡 Recommendations provided

---

### Test 6: Setback Violation Detection

**Purpose**: Test setback compliance

**Steps**:
1. Upload drawing with small setbacks
2. Set Required setbacks: 10m all sides
3. Run check

**Expected Result**:
- ❌ Setback violations detected
- 🔴 Each violation listed separately
- 💡 Recommendations to increase setbacks

---

### Test 7: Error Handling

**Purpose**: Test graceful error handling

**Test Cases**:

**A. No OpenAI Key**:
- Remove OPENAI_API_KEY from .env
- Upload drawing
- Expected: Falls back to manual validation

**B. Invalid File Type**:
- Upload .txt or .doc file
- Expected: Error message about file type

**C. Network Error**:
- Disconnect internet
- Upload drawing
- Expected: Error message, falls back to manual

---

## 🔍 Manual Testing Checklist

### UI Components

- [ ] Upload section shows "AI Analysis" badge
- [ ] File input accepts PDF, JPG, PNG, DWG
- [ ] File name and size displayed after selection
- [ ] "AI will extract..." message shown
- [ ] Upload button is clickable
- [ ] Loading state during analysis

### AI Analysis Display

- [ ] Blue card with "🤖 AI Drawing Analysis" header
- [ ] "GPT-4 Vision" badge visible
- [ ] Plot Area card shows value
- [ ] Built-up Area card shows value
- [ ] Calculated FSI card shows value
- [ ] Parking Spaces card shows value
- [ ] Setbacks section shows all 4 sides
- [ ] "View Full AI Analysis" expandable works
- [ ] Full analysis text is readable

### Compliance Results

- [ ] Status shows "Compliant" or "Non-Compliant"
- [ ] "AI Analyzed" badge appears when AI used
- [ ] Violations listed with severity badges
- [ ] Recommendations shown
- [ ] Download report button works

---

## 🐛 Troubleshooting

### Issue: "OpenAI API key not configured"

**Solution**:
```bash
# Check .env file
cat server/.env | grep OPENAI

# Should show:
OPENAI_API_KEY=sk-...

# If not, add it:
echo "OPENAI_API_KEY=sk-your-key-here" >> server/.env

# Restart server
```

---

### Issue: "Failed to prepare image for analysis"

**Possible Causes**:
1. File is corrupted
2. File format not supported by Sharp
3. File too large

**Solution**:
- Try different file format (JPG works best)
- Reduce file size
- Check server logs for details

---

### Issue: AI analysis returns "Not visible in drawing"

**Causes**:
- Drawing quality too low
- Dimensions not clearly marked
- Scale not visible
- Text too small

**Solution**:
- Use high-resolution drawings (300+ DPI)
- Ensure dimensions are clearly labeled
- Include scale information
- Make text readable

---

### Issue: Inaccurate measurements

**Causes**:
- Drawing scale unclear
- Dimensions ambiguous
- Multiple scales on same drawing

**Solution**:
- Clearly mark scale (1:100, 1:50, etc.)
- Label all dimensions
- Use consistent units (meters)
- Avoid hand-drawn sketches

---

### Issue: Upload fails silently

**Check**:
```bash
# Verify uploads directory exists
ls -la server/uploads/

# Check permissions
chmod 755 server/uploads/

# Check server logs
# Look for multer errors
```

---

## 📊 Performance Testing

### Response Time Benchmarks

| Operation | Expected Time |
|-----------|--------------|
| File Upload | < 1 second |
| Image Processing | 1-2 seconds |
| AI Analysis | 5-10 seconds |
| Total | 6-13 seconds |

### Load Testing

```bash
# Test with multiple concurrent uploads
# Use tools like Apache Bench or k6

# Example: 10 concurrent requests
ab -n 10 -c 10 -p drawing.pdf http://localhost:5000/api/compliance/check
```

---

## 🧪 API Testing with cURL

### Test Drawing Analysis Endpoint

```bash
# Analyze drawing only
curl -X POST http://localhost:5000/api/compliance/analyze-drawing \
  -F "drawing=@test-drawing.pdf" \
  -F 'context={"district":"Mumbai","zone":"Residential"}'
```

### Test Full Compliance Check

```bash
# Full compliance check with drawing
curl -X POST http://localhost:5000/api/compliance/check \
  -F "drawing=@test-drawing.pdf" \
  -F 'projectData={"proposedFSI":1.5,"permissibleFSI":2.0}'
```

---

## 🎨 Creating Test Drawings

### Recommended Test Drawing Features

**Minimum Requirements**:
- Clear plot boundary
- Building footprint
- At least 2 dimension lines
- Scale notation (e.g., "1:100")
- North arrow

**Ideal Test Drawing**:
- All plot dimensions labeled
- Building dimensions on all sides
- Setback lines clearly marked
- Parking spaces outlined
- Floor count indicated
- Area calculations shown
- Scale bar included

### Sample Drawing Specifications

```
Plot: 20m x 25m = 500 sq.m
Building: 15m x 18m = 270 sq.m
Floors: 2
Total Built-up: 540 sq.m
FSI: 540/500 = 1.08

Setbacks:
- Front: 5m
- Rear: 3m
- Side 1: 2m
- Side 2: 2m

Parking: 2 spaces (4m x 5m each)
```

---

## 📈 Accuracy Validation

### How to Verify AI Accuracy

1. **Manual Measurement**:
   - Measure dimensions manually
   - Calculate FSI manually
   - Compare with AI results

2. **Tolerance Levels**:
   - Dimensions: ±5% acceptable
   - Areas: ±3% acceptable
   - FSI: ±0.05 acceptable

3. **Quality Factors**:
   - Drawing resolution: 300+ DPI
   - Text clarity: Readable at 100% zoom
   - Line quality: Clean, not pixelated
   - Scale: Clearly marked

---

## 🚀 Production Deployment Checklist

### Before Going Live

- [ ] OpenAI API key configured
- [ ] File upload limits set (20MB)
- [ ] Uploads directory has write permissions
- [ ] Error handling tested
- [ ] Fallback to manual validation works
- [ ] File cleanup scheduled (delete old uploads)
- [ ] API rate limits configured
- [ ] Monitoring and logging enabled
- [ ] Cost tracking setup for OpenAI usage
- [ ] User documentation prepared

### Security Considerations

- [ ] File type validation enabled
- [ ] File size limits enforced
- [ ] Uploaded files scanned for malware
- [ ] Temporary files deleted after processing
- [ ] API keys stored securely (not in code)
- [ ] HTTPS enabled in production
- [ ] CORS configured properly

---

## 💰 Cost Monitoring

### Track OpenAI Usage

```javascript
// Add to drawing analysis service
console.log('OpenAI Usage:', {
  promptTokens: response.usage.prompt_tokens,
  completionTokens: response.usage.completion_tokens,
  totalTokens: response.usage.total_tokens,
  estimatedCost: (response.usage.total_tokens / 1000000) * 5
});
```

### Monthly Budget Planning

| Usage Level | Drawings/Month | Estimated Cost |
|-------------|----------------|----------------|
| Light | 100 | $2 |
| Medium | 500 | $10 |
| Heavy | 2,000 | $40 |
| Enterprise | 10,000 | $200 |

---

## 📞 Support & Debugging

### Enable Debug Logging

```javascript
// In drawingAnalysisService.js
console.log('Drawing analysis started:', {
  filePath,
  fileSize: fs.statSync(filePath).size,
  context: projectContext
});
```

### Common Log Messages

✅ **Success**:
```
Analyzing drawing: uploads/drawing-123456.pdf
Drawing analysis complete
```

❌ **Errors**:
```
Error preparing image: File not found
Drawing analysis error: OpenAI API key not configured
Failed to parse analysis: Invalid JSON
```

---

## 🎯 Success Criteria

### Feature is Working When:

1. ✅ File uploads successfully
2. ✅ AI analysis completes in < 15 seconds
3. ✅ Extracted data displayed correctly
4. ✅ Violations detected accurately
5. ✅ Recommendations are relevant
6. ✅ Report downloads successfully
7. ✅ Error handling works gracefully
8. ✅ UI is responsive and clear
9. ✅ Cost per analysis < $0.05
10. ✅ User feedback is positive

---

## 📚 Next Steps After Testing

1. **Gather User Feedback**:
   - Test with real architects
   - Collect accuracy reports
   - Note common issues

2. **Optimize Prompts**:
   - Improve extraction accuracy
   - Add more specific instructions
   - Handle edge cases better

3. **Enhance Features**:
   - Batch processing
   - Drawing comparison
   - 3D model support
   - CAD file parsing

4. **Scale Infrastructure**:
   - Add caching
   - Implement queuing
   - Load balancing
   - CDN for file storage

---

**Testing Status**: Ready for comprehensive testing! 🚀

Start with Test 1 and work through all scenarios to ensure everything works perfectly.
