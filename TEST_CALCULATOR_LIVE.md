# Test Calculator Live

## How to Test the Enhanced Calculator

### 1. Start Both Servers

**Terminal 1 - Backend:**
```bash
cd server
npm start
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

### 2. Open Calculator

Navigate to: `http://localhost:3000/calculator`

### 3. Test Scenarios

#### Scenario 1: Mumbai City with Premium FSI
**Input:**
- District: Mumbai City
- Zone: Residential
- Plot Area: 1000 sq.m
- Road Width: 12m
- Land Use: Residential
- Floors: 7
- Dwelling Units: 20
- Carpet Area per Unit: 75 sq.m

**Expected Results:**
- ✅ Basic FSI: 1.33
- ✅ Road Bonus: +0.2
- ✅ Current FSI: 1.53
- ✅ Premium FSI: 1.33 (shown in comparison table)
- ✅ Built-up Basic: 1530 sq.m
- ✅ Built-up with Premium: 2860 sq.m
- ✅ Ancillary Areas: ~245 sq.m
- ✅ Total Constructible: ~1775 sq.m
- ✅ Parking: 40 ECS

#### Scenario 2: Pune with TDR
**Input:**
- District: Pune
- Zone: Residential
- Plot Area: 1500 sq.m
- Road Width: 12m
- Land Use: Residential
- Floors: 6
- Dwelling Units: 24
- Carpet Area per Unit: 80 sq.m

**Expected Results:**
- ✅ Basic FSI: 1.0
- ✅ Road Bonus: +0.2
- ✅ Current FSI: 1.2
- ✅ TDR Available: 0.8 FSI (shown in comparison table)
- ✅ Built-up Basic: 1800 sq.m
- ✅ Built-up with TDR: 3000 sq.m
- ✅ Ancillary Areas: ~285 sq.m
- ✅ Total Constructible: ~2085 sq.m
- ✅ Parking: 48 ECS

#### Scenario 3: Wide Road (Setback Cap Test)
**Input:**
- District: Aurangabad
- Zone: Residential
- Plot Area: 500 sq.m
- Road Width: 30m (very wide)
- Land Use: Residential
- Floors: 4

**Expected Results:**
- ✅ Front Setback: 6m (CAPPED, not 9m)
- ✅ Plot remains buildable
- ✅ Note about setback cap shown

#### Scenario 4: TOD Zone
**Input:**
- District: Nagpur
- Zone: Mixed
- Plot Area: 1200 sq.m
- Road Width: 18m
- Land Use: Mixed
- Floors: 8
- TOD: ✓ (checked)

**Expected Results:**
- ✅ TOD Bonus: +1.0 FSI
- ✅ Higher total FSI
- ✅ TDR also available (plot > 1000)

### 4. What to Look For

#### In Summary Cards:
- ✅ Current FSI displayed
- ✅ Built-up Area displayed
- ✅ **Total Constructible** displayed (NEW)
- ✅ Max Height displayed
- ✅ Parking displayed

#### In FSI Comparison Table (NEW):
- ✅ Three rows showing different scenarios
- ✅ Basic FSI marked as "FREE"
- ✅ Premium FSI marked as "Purchasable"
- ✅ TDR marked as "TDR Purchase" (if eligible)
- ✅ Additional area calculated for each

#### In FSI Breakdown Card:
- ✅ Basic FSI shown separately
- ✅ Road Bonus shown separately
- ✅ Premium FSI shown with description
- ✅ TDR shown with description (if eligible)
- ✅ All notes displayed

#### In Ancillary Areas Card (NEW):
- ✅ Staircase & Lift (10%)
- ✅ Mumty (15 sq.m)
- ✅ Water Tanks (2%)
- ✅ Services (3%)
- ✅ Total Ancillary sum
- ✅ **Total Constructible** highlighted
- ✅ Formula shown: FSI + Ancillary

#### In Setbacks Card:
- ✅ All four setbacks shown
- ✅ Notes about caps (if wide road)
- ✅ Floor-based side setbacks

### 5. Visual Checks

#### Colors:
- 🟣 Purple gradient: Current FSI
- 🔴 Pink gradient: Built-up Area
- 🔵 Blue gradient: Total Constructible (NEW)
- 🟡 Yellow gradient: Max Height
- 🟢 Green gradient: Parking

#### Layout:
- ✅ Responsive grid layout
- ✅ Cards properly aligned
- ✅ Table scrollable on mobile
- ✅ All text readable

#### Functionality:
- ✅ Calculate button works
- ✅ Loading state shows
- ✅ Results appear after calculation
- ✅ All fields update correctly
- ✅ Checkboxes (TOD, Heritage) work

### 6. Edge Cases to Test

#### Small Plot:
- Plot Area: 200 sq.m
- Should show: No TDR, smaller ancillary areas

#### Large Plot:
- Plot Area: 2500 sq.m
- Should show: TDR eligible, larger ancillary areas

#### No Road Bonus:
- Road Width: 9m (< 12m)
- Should show: Road Bonus = 0

#### Maximum Floors:
- Leave floors empty
- Should use: Max floors from height calculation

### 7. Browser Testing

Test in:
- ✅ Chrome
- ✅ Firefox
- ✅ Edge
- ✅ Safari (if available)

### 8. Mobile Testing

Test on:
- ✅ Mobile view (responsive)
- ✅ Tablet view
- ✅ Desktop view

### 9. API Testing (Optional)

Use Postman or curl:

```bash
curl -X POST http://localhost:5000/api/calculator/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "district": "Mumbai City",
    "zone": "Residential",
    "plotArea": 1000,
    "roadWidth": 12,
    "landUse": "Residential",
    "floors": 7,
    "dwellingUnits": 20,
    "carpetAreaPerUnit": 75
  }'
```

Should return JSON with all enhanced fields.

### 10. Success Criteria

✅ All calculations mathematically correct  
✅ FSI breakdown clearly visible  
✅ Premium FSI shown separately  
✅ TDR calculations detailed  
✅ Ancillary areas calculated  
✅ Total constructible area shown  
✅ Setback caps applied  
✅ UI responsive and clear  
✅ No console errors  
✅ All districts work correctly

---

## Quick Test Checklist

- [ ] Backend server running
- [ ] Frontend server running
- [ ] Calculator page loads
- [ ] Can enter all inputs
- [ ] Calculate button works
- [ ] Summary cards show correct values
- [ ] FSI comparison table appears (when applicable)
- [ ] FSI breakdown shows all components
- [ ] Ancillary areas card appears
- [ ] Total constructible area calculated
- [ ] Setbacks capped at 6m for wide roads
- [ ] TDR shown for plots > 1000 sq.m
- [ ] Premium FSI shown where applicable
- [ ] All notes and descriptions clear
- [ ] No errors in browser console
- [ ] Works on mobile view

**If all checked:** ✅ Implementation successful!
