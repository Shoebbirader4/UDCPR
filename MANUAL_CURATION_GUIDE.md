# Manual Curation Guide for UDCPR Rules

## 🎯 Overview

The PDF extraction has successfully extracted **1,075 potential rules** from the official UDCPR PDFs:
- **Mumbai**: 11 rules from 261 pages
- **Rest of Maharashtra**: 1,064 rules from 491 pages

However, **automated extraction is approximate** and requires manual review and refinement.

---

## 📊 Extraction Results

### Files Created
1. **`server/src/data/extracted/mumbai-raw.txt`** - Full text from Mumbai PDF (627,189 characters)
2. **`server/src/data/extracted/mumbai-rules.json`** - 11 extracted Mumbai rules
3. **`server/src/data/extracted/rest-maharashtra-raw.txt`** - Full text from Rest of Maharashtra PDF (1,123,088 characters)
4. **`server/src/data/extracted/rest-maharashtra-rules.json`** - 1,064 extracted rules

---

## 🔍 What Was Extracted

The extraction tool identified rules based on patterns:
- **FSI patterns**: "FSI shall be", "Floor Space Index = "
- **Setback patterns**: "setback shall be", "marginal distance minimum"
- **Height patterns**: "height shall not exceed", "maximum height"
- **Parking patterns**: "parking required", "ECS per"

### Sample Extracted Rule (Mumbai)
```json
{
  "district": "Mumbai City",
  "region": "Konkan",
  "clause": "12.6.1",
  "category": "FSI",
  "text": "...FSI in TOD zone shall be 4.00...",
  "matches": ["FSI in TOD zone shall be 4.00"]
}
```

---

## ✅ Manual Curation Process

### Step 1: Review Raw Text Files

**Open the raw text files to understand the document structure:**

```bash
# Mumbai raw text
server/src/data/extracted/mumbai-raw.txt

# Rest of Maharashtra raw text
server/src/data/extracted/rest-maharashtra-raw.txt
```

**Look for:**
- Chapter headings
- Section numbers
- Clause numbers
- Tables
- Definitions
- Regulations

### Step 2: Review Extracted Rules JSON

**Open the JSON files:**

```bash
# Mumbai rules
server/src/data/extracted/mumbai-rules.json

# Rest of Maharashtra rules
server/src/data/extracted/rest-maharashtra-rules.json
```

**For each rule, verify:**
- ✅ Clause number is correct
- ✅ Category is appropriate (FSI, Setback, Height, Parking, etc.)
- ✅ Text is complete and readable
- ✅ District assignment is correct
- ✅ Region is correct

### Step 3: Refine and Structure Rules

**Create properly structured rules in:**
`server/src/data/curated/`

**Example: `server/src/data/curated/mumbai-fsi-rules.json`**

```json
[
  {
    "district": "Mumbai City",
    "region": "Konkan",
    "planningAuthority": "MCGM",
    "municipalityType": "Municipal Corporation",
    
    "chapter": "Chapter 12",
    "section": "Section 6",
    "clause": "12.6.1",
    "subClause": "",
    
    "summary": "FSI in Transit Oriented Development (TOD) Zones",
    "fullText": "The FSI in TOD zone shall be 4.00. This applies to areas within 500m radius of railway stations and metro stations as designated in the Development Plan.",
    
    "category": "FSI",
    "subCategory": "TOD",
    "applicableZones": ["TOD", "R1", "R2", "C1"],
    "applicableAreas": ["Urban"],
    
    "keywords": ["FSI", "TOD", "transit oriented development", "railway station", "metro"],
    "tags": ["Mumbai", "TOD", "FSI", "4.0"],
    
    "isDistrictSpecific": true,
    "isRegionalVariation": false,
    
    "officialReference": "UDCPR 2020 - Mumbai Specific Regulations",
    "effectiveFrom": "2020-04-01",
    "status": "Active",
    
    "notes": "Applies only to designated TOD zones as per Development Plan",
    "examples": [
      "Plot within 500m of Dadar Railway Station",
      "Plot within 500m of Andheri Metro Station"
    ],
    
    "calculations": {
      "baseFSI": 4.0,
      "additionalFSI": "May be granted through TDR",
      "maxFSI": "Subject to planning authority approval"
    }
  }
]
```

### Step 4: Organize by Category

**Create separate files for each category:**

```
server/src/data/curated/
├── mumbai/
│   ├── fsi-rules.json
│   ├── setback-rules.json
│   ├── height-rules.json
│   ├── parking-rules.json
│   ├── tod-rules.json
│   └── special-rules.json
├── pune/
│   ├── fsi-rules.json
│   ├── setback-rules.json
│   └── ...
├── nagpur/
│   └── ...
└── ...
```

---

## 📝 Rule Structure Template

### Required Fields
```json
{
  "district": "District Name",
  "region": "Region Name",
  "planningAuthority": "Authority Name",
  "chapter": "Chapter X",
  "section": "Section Y",
  "clause": "X.Y.Z",
  "summary": "Brief description",
  "fullText": "Complete rule text",
  "category": "FSI|Setback|Height|Parking|etc",
  "status": "Active"
}
```

### Recommended Fields
```json
{
  "subClause": "Sub-clause if any",
  "subCategory": "Specific sub-category",
  "applicableZones": ["R1", "R2", "C1"],
  "applicableAreas": ["Urban", "Rural"],
  "municipalityType": "Municipal Corporation",
  "keywords": ["keyword1", "keyword2"],
  "tags": ["tag1", "tag2"],
  "isDistrictSpecific": true,
  "officialReference": "GR Number or notification",
  "effectiveFrom": "2020-04-01",
  "notes": "Additional notes",
  "examples": ["Example 1", "Example 2"]
}
```

### Advanced Fields
```json
{
  "calculations": {
    "formula": "Description of calculation",
    "parameters": ["param1", "param2"]
  },
  "tables": {
    "tableName": "Table data"
  },
  "relatedClauses": ["3.2.1", "4.1.2"],
  "supersedes": "Previous clause reference",
  "variations": "Description of variations"
}
```

---

## 🛠️ Curation Tools

### Option 1: Manual JSON Editing

1. Open JSON file in VS Code or text editor
2. Review each rule
3. Refine and structure
4. Save to curated folder

### Option 2: Spreadsheet Method

1. Export JSON to CSV
2. Open in Excel/Google Sheets
3. Review and edit in spreadsheet
4. Export back to JSON

### Option 3: Use MongoDB Compass

1. Import extracted rules to temporary collection
2. Review and edit in Compass
3. Export refined rules
4. Import to main collection

---

## 📋 Curation Checklist

For each rule, verify:

### Content Accuracy
- [ ] Clause number matches PDF
- [ ] Full text is complete
- [ ] No truncation or corruption
- [ ] Tables are properly formatted
- [ ] References are correct

### Classification
- [ ] District is correct
- [ ] Region is correct
- [ ] Category is appropriate
- [ ] Applicable zones are listed
- [ ] Municipality type is correct

### Metadata
- [ ] Planning authority is correct
- [ ] Effective date is accurate
- [ ] Official reference is included
- [ ] Status is set (Active/Superseded)
- [ ] Keywords are comprehensive

### Quality
- [ ] Summary is clear and concise
- [ ] Full text is readable
- [ ] Examples are provided (if applicable)
- [ ] Calculations are documented (if applicable)
- [ ] Related clauses are linked

---

## 🚀 Import Curated Rules

### Step 1: Place Curated Files

Put your curated JSON files in:
```
server/src/data/curated/
```

### Step 2: Run Import Script

```bash
cd server
npm run import-curated
```

### Step 3: Verify in Database

```bash
npm run test-db
```

Or use MongoDB Compass to view the `districtrules` collection.

---

## 📊 Priority Districts

Focus curation efforts on these high-priority districts first:

### Phase 1 (Immediate)
1. **Mumbai City** - 11 rules extracted
2. **Mumbai Suburban** - Shared with Mumbai City
3. **Pune** - Major IT hub
4. **Nagpur** - Second capital
5. **Nashik** - Industrial center

### Phase 2 (Short-term)
6. Thane
7. Aurangabad
8. Solapur
9. Kolhapur
10. Amravati

### Phase 3 (Long-term)
11-36. Remaining districts

---

## 🎯 Quality Standards

### Minimum Requirements
- Clause number must be accurate
- Full text must be complete
- Category must be assigned
- District and region must be correct

### Good Quality
- All required fields filled
- Keywords comprehensive
- Examples provided
- Notes added where helpful

### Excellent Quality
- All fields complete
- Calculations documented
- Tables properly formatted
- Related clauses linked
- Official references included
- Verification notes added

---

## 📈 Progress Tracking

### Current Status
- ✅ PDFs extracted (752 pages total)
- ✅ 1,075 potential rules identified
- ⚠️ Manual curation needed
- ⏳ Import to database pending

### Curation Progress
Track your progress:
```
Mumbai City: 0/11 rules curated (0%)
Pune: 0/200 rules curated (0%)
Nagpur: 0/150 rules curated (0%)
...
Total: 0/1075 rules curated (0%)
```

---

## 💡 Tips for Efficient Curation

### 1. Start with Clear Rules
Begin with rules that have clear clause numbers and complete text.

### 2. Use Find & Replace
For common corrections across multiple rules.

### 3. Create Templates
Use the rule structure template for consistency.

### 4. Batch by Category
Curate all FSI rules together, then all setback rules, etc.

### 5. Cross-Reference PDF
Keep the original PDF open for verification.

### 6. Document Uncertainties
Add notes for rules that need verification.

### 7. Peer Review
Have another person review curated rules.

---

## 🔍 Common Issues and Solutions

### Issue: Truncated Text
**Solution**: Refer to raw text file or PDF for complete text

### Issue: Incorrect Clause Number
**Solution**: Cross-reference with PDF table of contents

### Issue: Unclear Category
**Solution**: Read full context in PDF, assign best-fit category

### Issue: Multiple Districts
**Solution**: Create separate rule entries for each district

### Issue: Tables in Text
**Solution**: Format as structured data in `tables` field

---

## 📞 Support

### For Curation Help
1. Review this guide
2. Check sample curated rules
3. Refer to original PDFs
4. Consult UDCPR 2020 official document

### For Technical Issues
1. Check JSON syntax
2. Validate against schema
3. Test import with small dataset
4. Review error logs

---

## 🎉 Next Steps

1. **Review Extracted Files** - Understand what was captured
2. **Start with Mumbai** - Curate 11 Mumbai rules first
3. **Test Import** - Import curated rules to database
4. **Verify** - Check in UI and database
5. **Expand** - Continue with other districts
6. **Iterate** - Refine process based on learnings

---

**Your extracted rules are ready for curation!** Start with the Mumbai rules (only 11) to test the process, then expand to other districts.

**Remember**: Quality over quantity. It's better to have 100 accurate, well-structured rules than 1,000 approximate ones.
