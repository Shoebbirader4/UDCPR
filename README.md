# 🏛️ UDCPR Master - Complete UDCPR 2020 Compliance Platform

**AI-Powered UDCPR Compliance Platform for Maharashtra**

A comprehensive web application providing complete coverage of UDCPR 2020 regulations with AI-powered analysis, automated calculations, and intelligent search capabilities.

---

## 🎯 Features

### 📚 Complete UDCPR Coverage
- **4,344 Total Rules** from official UDCPR 2020 documents
- **1,640 General Rules** (Mumbai + Rest of Maharashtra)
- **2,704 District-Specific Rules** across 35 districts
- **21 Categories** covering all aspects of urban development

### 🤖 AI-Powered Features
- **GPT-4 Vision** - Automatic drawing analysis
- **GPT-4o Chat** - Interactive UDCPR assistant
- **Automated Compliance Checking** - Instant violation detection

### 🧮 Comprehensive Calculator
- FSI calculations with all bonuses (TOD, TDR, Heritage)
- Setback requirements (front, rear, sides)
- Parking calculations (ECS)
- Height restrictions
- Built-up area calculations
- **100% Mathematically Verified**

### 🔍 Advanced Search
- Search 4,344 rules instantly
- Filter by district, category, keywords
- District-specific variations
- General UDCPR reference

### 📁 Project Management
- Save multiple projects
- Track compliance status
- Organize work efficiently

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- OpenAI API key (for AI features)

### Installation

```bash
# 1. Clone repository
git clone https://github.com/Shoebbirader4/UDCPR.git
cd UDCPR

# 2. Install server dependencies
cd server
npm install

# 3. Install client dependencies
cd ../client
npm install

# 4. Configure environment (create server/.env)
MONGODB_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_api_key
PORT=5000

# 5. Seed database
cd server
node src/scripts/importExtractedUDCPR.js
node src/scripts/seedAllCategories.js

# 6. Start servers
# Terminal 1
cd server && npm run dev

# Terminal 2
cd client && npm run dev
```

### Access
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

---

## 📊 Platform Statistics

```
Total Rules:              4,344
├─ General Rules:         1,640
│  ├─ Mumbai:             698
│  └─ Rest Maharashtra:   942
└─ District Rules:        2,704
   ├─ Districts:          35
   └─ Categories:         21

Coverage:                 95% of UDCPR 2020
Accuracy:                 100% (Calculator verified)
```

---

## 🎨 Tech Stack

**Frontend:** React 18, React Router, Axios, Vite  
**Backend:** Node.js, Express, MongoDB, Mongoose  
**AI:** OpenAI GPT-4 Vision, GPT-4o  
**Tools:** PDF-Parse, Multer, Sharp

---

## 📖 Main Features

### 1. District Rules (`/district-rules`)
Search 2,704 district-specific regulations across 35 districts

### 2. Rule Library (`/rules`)
Search 1,640 general UDCPR rules from Mumbai & Rest Maharashtra

### 3. Calculator (`/calculator`)
Calculate FSI, setbacks, parking, height - 100% accurate

### 4. AI Compliance Check (`/compliance`)
Upload drawings (JPG/PNG) for automated analysis

### 5. AI Assistant (`/ai-assistant`)
Chat with GPT-4o about UDCPR regulations

### 6. My Projects (`/projects`)
Save and manage multiple building projects

---

## 📝 Documentation

- `COMPLETE_IMPLEMENTATION_SUMMARY.md` - Full implementation details
- `CALCULATOR_VERIFICATION_COMPLETE.md` - Calculator tests
- `DRAWING_ANALYSIS_GUIDE.md` - Drawing analysis guide
- `START_SERVERS.md` - Server startup guide

---

## 🤝 Contributing

Contributions welcome! Please submit a Pull Request.

---

## 📄 License

MIT License

---

## 👥 Author

Shoeb Birader

---

**Status: ✅ Production Ready**  
**Version: 1.0.0**  
**Last Updated: 2024**
