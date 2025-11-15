# UDCPR Master - Quick Start Guide

## 🚀 Your App is Already Running!

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

## ✅ What Works Right Now (No Setup Needed)

1. **Home Page** - Beautiful UI with all modules
2. **FSI Calculator** - Calculate FSI and setbacks instantly
3. **Compliance Check** - Basic validation and report generation
4. **All UI Pages** - Navigate through all features

## 📦 What You Have

### 30 Comprehensive UDCPR Rules Ready to Load:
- ✅ FSI regulations for Residential, Commercial, Mixed-use
- ✅ Setback requirements (front, side, rear)
- ✅ Height restrictions based on road width
- ✅ Parking requirements (Residential, Commercial, Industrial)
- ✅ Heritage zone regulations (Grade I & II)
- ✅ TDR (Transferable Development Rights) rules
- ✅ Amenity space requirements
- ✅ CRZ (Coastal Regulation Zone) restrictions
- ✅ Green building requirements
- ✅ Fire safety and structural requirements
- ✅ Universal accessibility guidelines
- ✅ Affordable housing regulations

## 🎯 Next Step: Enable Database (5 Minutes)

### Option A: MongoDB Atlas (Cloud - Easiest)

1. **Create Free Account**: https://www.mongodb.com/cloud/atlas/register
2. **Create Cluster**: Choose FREE tier, region: Mumbai
3. **Create User**: Username: `udcpr_admin`, generate password
4. **Whitelist IP**: Allow access from anywhere (0.0.0.0/0)
5. **Get Connection String**: 
   ```
   mongodb+srv://udcpr_admin:YOUR_PASSWORD@cluster.xxxxx.mongodb.net/udcpr-master?retryWrites=true&w=majority
   ```
6. **Update server/.env**:
   ```
   MONGODB_URI=your_connection_string_here
   ```
7. **Seed Database**:
   ```bash
   cd server
   npm run seed
   ```

**Detailed instructions**: See `MONGODB_SETUP.md`

### Option B: Local MongoDB (If you prefer local)

1. Download: https://www.mongodb.com/try/download/community
2. Install with default settings
3. Connection string is already set: `mongodb://localhost:27017/udcpr-master`
4. Seed database: `cd server && npm run seed`

## 🧪 Test Your Setup

```bash
# Test database connection
cd server
npm run test-db

# If successful, seed the database
npm run seed
```

## 🎨 Features Overview

### 1. Rule Library
- Search 30 UDCPR rules by keyword
- Filter by chapter, section, category
- View full text and applicable zones
- **Status**: UI ready, needs database

### 2. FSI & Setback Calculator
- Calculate permissible FSI based on zone and road width
- Auto-calculate setbacks (front, side, rear)
- Get maximum height limits
- TDR availability check
- **Status**: ✅ Fully working (no database needed)

### 3. AI Compliance Check
- Upload drawings (PDF/DWG)
- Input project parameters
- Get detailed compliance report
- Download HTML report
- **Status**: ✅ Working, AI needs OpenAI key

### 4. Design Assistant (AI Chat)
- Ask questions about UDCPR rules
- Get expert advice on compliance
- Suggest layout ideas
- **Status**: UI ready, needs OpenAI API key

### 5. Zone Finder
- Interactive map (Mapbox)
- Click to select location
- Get zone information and applicable rules
- **Status**: UI ready, needs Mapbox token

### 6. Projects
- Create and manage projects
- Save project parameters
- Track compliance status
- **Status**: UI ready, needs database

## 🔑 Optional API Keys

### OpenAI (for AI Assistant)
1. Get key: https://platform.openai.com/
2. Add to `server/.env`: `OPENAI_API_KEY=sk-...`
3. Cost: ~$0.002 per chat message

### Mapbox (for Zone Finder Map)
1. Get free token: https://www.mapbox.com/
2. Add to `.env`: `VITE_MAPBOX_TOKEN=pk.ey...`
3. Free tier: 50,000 map loads/month

### Razorpay (for Payments)
1. Sign up: https://razorpay.com/
2. Get test keys from dashboard
3. Add to `server/.env`

## 📊 Current Database Schema

Once you set up MongoDB, you'll have:

### Rules (30 documents)
- Chapters 3-12 of UDCPR 2020
- Searchable by keywords
- Categorized by type (FSI, Setback, Parking, etc.)

### Users (2 demo users)
- Demo Architect (Pro subscription)
- Demo Engineer (Free subscription)

### Projects (Empty, ready for your data)
- Store project details
- Track compliance status
- Save calculations

## 🎯 Recommended Setup Order

1. **Now**: Use the app as-is (Calculator works!)
2. **5 min**: Set up MongoDB Atlas (enable all database features)
3. **2 min**: Add Mapbox token (enable interactive map)
4. **Optional**: Add OpenAI key (enable AI chat)
5. **Later**: Add Razorpay for payment testing

## 💡 Tips

- **No MongoDB?** Calculator and UI still work perfectly
- **Testing?** Use demo data in the UI
- **Production?** Follow security checklist in README.md
- **Stuck?** Check MONGODB_SETUP.md for detailed troubleshooting

## 📱 Try It Now

1. Open http://localhost:3000
2. Click "FSI & Setback Calculator"
3. Enter:
   - Zone: Residential
   - Plot Area: 500
   - Road Width: 12
4. Click "Calculate"
5. See instant results! ✨

## 🚀 What's Next?

After setting up MongoDB:
1. Search actual UDCPR rules
2. Create and save projects
3. Generate compliance reports
4. Use AI assistant for queries

## 📚 Documentation

- `README.md` - Full project documentation
- `MONGODB_SETUP.md` - Detailed database setup
- `SETUP_GUIDE.md` - Complete feature guide
- `QUICK_START.md` - This file

## 🆘 Need Help?

1. Check if servers are running (they should be!)
2. Visit http://localhost:3000 (should load immediately)
3. Try the calculator (works without any setup)
4. For database features, follow MongoDB Atlas setup above

---

**You're all set!** The app is running and ready to use. Set up MongoDB when you're ready to unlock all features. 🎉
