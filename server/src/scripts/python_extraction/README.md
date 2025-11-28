# UDCPR/Mumbai-DCPR Python Extraction System

Complete extraction pipeline to parse DOCX files and populate MongoDB database with structured rules.

## 📋 Overview

This system extracts **every single line** from both UDCPR and Mumbai-DCPR DOCX files and imports them into your MongoDB database with proper structure, categorization, and metadata.

## 🎯 What Gets Extracted

### From Both Documents:
- ✅ **All Chapters** - Complete chapter structure with titles
- ✅ **All Sections** - Section numbers and headings
- ✅ **All Clauses/Rules** - Every regulation with full text
- ✅ **All Tables** - FSI tables, parking requirements, setback tables, etc.
- ✅ **All Annexures** - Heritage classifications, abbreviations, etc.
- ✅ **Numerical Data** - FSI values, setbacks, heights, parking requirements
- ✅ **Zone Classifications** - R1, R2, C1, C2, I1, etc.
- ✅ **District Applicability** - Which districts each rule applies to

### Automatic Classification:
- 📂 **27 Categories** - FSI, Setback, Height, Parking, Heritage, TDR, etc.
- 🏷️ **Smart Tags** - Auto-generated searchable tags
- 🗺️ **Zone Mapping** - Applicable zones for each rule
- 📍 **District Mapping** - General vs district-specific rules
- 🔢 **Numerical Extraction** - Automatic extraction of values

## 🚀 Quick Start

### Step 1: Setup (One-time)

```bash
cd server/src/scripts/python_extraction
setup.bat
```

This will:
- Check Python installation
- Create virtual environment
- Install all required packages

### Step 2: Run Extraction

```bash
run_extraction.bat
```

This will:
- Parse both DOCX files completely
- Classify all rules
- Import everything to MongoDB
- Generate detailed logs

### Step 3: Verify

Check the output:
- `extraction_log.txt` - Detailed execution log
- `extracted/extracted_rules.json` - Backup JSON file
- MongoDB database - All rules imported

## 📁 File Structure

```
python_extraction/
├── config.py                 # Configuration and patterns
├── docx_parser.py           # DOCX parsing logic
├── rule_classifier.py       # Rule categorization
├── database_importer.py     # MongoDB import
├── extract_all.py           # Main pipeline
├── requirements.txt         # Python dependencies
├── setup.bat               # Setup script
├── run_extraction.bat      # Execution script
└── README.md              # This file
```

## 🔧 Configuration

Edit `config.py` to customize:

### Extraction Patterns
```python
CHAPTER_PATTERNS = [
    r'^CHAPTER\s+([IVX\d]+)[:\s\-]+(.+?)$',
    # Add more patterns
]
```

### Category Keywords
```python
CATEGORY_KEYWORDS = {
    'FSI': ['floor space index', 'fsi', 'far'],
    'Setback': ['setback', 'margin', 'open space'],
    # Add more categories
}
```

### MongoDB Connection
```python
MONGODB_URI = 'mongodb://localhost:27017/udcpr-master'
```

## 📊 Database Schema

### General Rules Collection (`rules`)
```javascript
{
  chapter: String,           // "III", "IV", etc.
  section: String,           // "1", "2", etc.
  clause: String,            // "3.1", "4.2.1", etc.
  reference: String,         // "III.1.3.1" (unique)
  title: String,             // Rule title
  summary: String,           // Short summary (500 chars)
  fullText: String,          // Complete rule text
  category: String,          // FSI, Setback, Height, etc.
  subcategory: String,       // Base FSI, Premium FSI, etc.
  applicableZones: [String], // R1, R2, C1, etc.
  applicableDistricts: [],   // Empty for general rules
  isGeneral: Boolean,        // true for general rules
  tags: [String],            // Searchable tags
  numericalData: Object,     // Extracted values
  status: String,            // Active, Superseded, etc.
  source: String,            // UDCPR or Mumbai-DCPR
  createdAt: Date,
  updatedAt: Date
}
```

### District Rules Collection (`districtrules`)
```javascript
{
  district: String,          // Mumbai, Pune, Thane, etc.
  region: String,            // Konkan, Pune, Nashik, etc.
  chapter: String,
  section: String,
  clause: String,
  reference: String,
  summary: String,
  fullText: String,
  category: String,
  applicableZones: [String],
  // ... similar to general rules
}
```

## 🎨 Categories

The system automatically classifies rules into 27 categories:

1. **FSI** - Floor Space Index regulations
2. **Setback** - Margin and open space requirements
3. **Height** - Building height restrictions
4. **Parking** - Vehicle parking requirements
5. **Heritage** - Heritage building conservation
6. **TDR** - Transferable Development Rights
7. **Amenity** - Recreational and amenity spaces
8. **Environmental** - Environmental regulations
9. **Safety** - Safety requirements
10. **Accessibility** - Accessibility for disabled
11. **CRZ** - Coastal Regulation Zone
12. **TOD** - Transit Oriented Development
13. **Affordable Housing** - EWS/LIG housing
14. **Mixed Use** - Mixed-use developments
15. **Special Buildings** - Assembly, institutional
16. **Land Use** - Land use regulations
17. **Zoning** - Zoning classifications
18. **Infrastructure** - Infrastructure requirements
19. **Social Infrastructure** - Schools, hospitals
20. **Redevelopment** - Redevelopment schemes
21. **Regularization** - Unauthorized construction
22. **Building Requirements** - General building rules
23. **Structural** - Structural requirements
24. **Fire Safety** - Fire safety regulations
25. **Procedures** - Application procedures
26. **Penalties** - Violations and penalties
27. **General** - General provisions

## 🔍 Extraction Features

### Smart Pattern Matching
- Recognizes multiple chapter/section formats
- Handles Roman numerals (I, II, III, IV)
- Handles decimal numbering (1.1, 1.2.3)
- Extracts nested clauses

### Numerical Data Extraction
- FSI values (1.0, 1.5, 2.0, etc.)
- Setbacks in meters (3m, 4.5m, etc.)
- Heights in meters
- Parking space requirements
- Plot areas

### Zone Detection
- Residential zones (R1-R4)
- Commercial zones (C1-C8)
- Industrial zones (I1-I3)
- Mixed zones (M1-M3)
- Special zones

### District Detection
- All 36 Maharashtra districts
- Mumbai-specific rules
- Regional variations

## 📈 Expected Output

### UDCPR Document
- **~12,000+ rules** extracted
- **~100+ tables** captured
- **~50+ annexures** identified

### Mumbai-DCPR Document
- **~11,000+ rules** extracted
- **~80+ tables** captured
- **~40+ annexures** identified

### Total Database
- **~23,000+ rules** in database
- **Fully categorized** and tagged
- **Searchable** by category, zone, district
- **Structured** for calculator integration

## 🐛 Troubleshooting

### Python Not Found
```bash
# Install Python 3.8+ from https://www.python.org/
# Make sure to check "Add Python to PATH" during installation
```

### Package Installation Fails
```bash
# Upgrade pip first
python -m pip install --upgrade pip

# Then install requirements
pip install -r requirements.txt
```

### MongoDB Connection Error
```bash
# Check if MongoDB is running
net start MongoDB

# Verify connection string in config.py
MONGODB_URI = 'mongodb://localhost:27017/udcpr-master'
```

### DOCX Files Not Found
```bash
# Ensure files are in correct location:
# server/src/data/UDCPR Updated 30.01.25 with earlier provisions & corrections_compressed.docx
# server/src/data/MUBAI-DCPR.docx
```

## 📝 Logs and Output

### extraction_log.txt
Complete execution log with:
- Parsing progress
- Classification statistics
- Import results
- Error messages (if any)

### extracted/extracted_rules.json
Backup JSON file with all extracted data:
- All rules with full text
- All tables
- All annexures
- Metadata and statistics

## 🔄 Re-running Extraction

To re-extract (e.g., after updating DOCX files):

1. Clean database first:
```bash
cd server
npm run clean-db
```

2. Run extraction again:
```bash
cd src/scripts/python_extraction
run_extraction.bat
```

## ✅ Verification

After extraction, verify the data:

### Check Database
```bash
cd server
npm run check-rules
```

### Test API
```bash
# Start server
npm run dev

# Test search endpoint
curl http://localhost:5000/api/rules/search?query=FSI
```

### Check Frontend
```bash
# Start client
cd client
npm run dev

# Visit http://localhost:3000/rules
```

## 🎯 Next Steps

After successful extraction:

1. ✅ **Verify Data** - Check a few rules manually
2. ✅ **Test Search** - Try searching for different terms
3. ✅ **Test Calculator** - Verify calculator uses correct rules
4. ✅ **Test Filters** - Check category and zone filters
5. ✅ **Deploy** - Ready for production!

## 📞 Support

If you encounter issues:
1. Check `extraction_log.txt` for error details
2. Verify DOCX files are in correct location
3. Ensure MongoDB is running
4. Check Python version (3.8+)

## 🎉 Success Indicators

You'll know extraction succeeded when you see:

```
✅ EXTRACTION COMPLETE!
📊 DATABASE TOTALS:
   General rules: ~20,000+
   District rules: ~3,000+
   Total rules: ~23,000+
```

Your database is now fully populated and ready to use!
