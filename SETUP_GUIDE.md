# UDCPR Master - Setup Guide

## Quick Start

Your app is now running! 🎉

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

## What's Working Now

✅ **Frontend UI** - All 6 modules with beautiful interface
✅ **FSI Calculator** - Calculate FSI and setbacks (no database needed)
✅ **Rule Library** - Search interface ready
✅ **Compliance Check** - Upload and check compliance
✅ **AI Assistant** - Chat interface (needs OpenAI key)
✅ **Zone Finder** - Location search with map integration
✅ **Projects** - Project management interface
✅ **Authentication** - JWT-based user auth
✅ **Report Generation** - Download HTML compliance reports

## Features Implemented

### 1. UDCPR Rule Database
Sample UDCPR 2020 rules are ready to be seeded into MongoDB.

**To use:**
```bash
# Install MongoDB (if not installed)
# Windows: Download from https://www.mongodb.com/try/download/community

# Start MongoDB service
# Then run seed script:
cd server
npm run seed
```

### 2. JWT Authentication
User registration and login with role-based access control.

**API Endpoints:**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login (returns JWT token)
- `GET /api/auth/me` - Get user profile

**Example:**
```javascript
// Register
POST /api/auth/register
{
  "name": "John Architect",
  "email": "john@example.com",
  "role": "Architect",
  "organization": "ABC Architects"
}

// Login
POST /api/auth/login
{
  "email": "john@example.com"
}
```

### 3. PDF Report Generation
Generate and download compliance reports in HTML format.

**Features:**
- Professional report layout
- Color-coded compliance status
- Detailed violations and recommendations
- UDCPR clause references
- Legal disclaimer

### 4. Mapbox Integration
Interactive map for zone selection in Zone Finder.

**To enable:**
1. Get free token: https://www.mapbox.com/
2. Create `.env` file in project root:
```
VITE_MAPBOX_TOKEN=your_mapbox_token_here
```
3. Restart client: `npm run dev`

## Configuration

### Environment Variables

**Server (.env in server folder):**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/udcpr-master
OPENAI_API_KEY=your_openai_key
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
JWT_SECRET=your_jwt_secret_key
```

**Client (.env in project root):**
```
VITE_MAPBOX_TOKEN=your_mapbox_token
VITE_GOOGLE_MAPS_KEY=your_google_maps_key (optional)
```

## Testing Without External Services

You can test most features without MongoDB, OpenAI, or Mapbox:

✅ **Works without setup:**
- Home page and navigation
- FSI Calculator (uses local logic)
- Compliance Check (basic validation)
- Projects interface
- Rule Library interface

⚠️ **Needs configuration:**
- AI Assistant (needs OpenAI API key)
- Payment features (needs Razorpay)
- Map in Zone Finder (needs Mapbox token)
- Database features (needs MongoDB)

## Next Steps

### 1. Install MongoDB (Optional but Recommended)

**Windows:**
1. Download: https://www.mongodb.com/try/download/community
2. Install with default settings
3. MongoDB will run as a service automatically

**Or use MongoDB Atlas (Cloud):**
1. Sign up: https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Update `MONGODB_URI` in server/.env

### 2. Seed Database

```bash
cd server
npm run seed
```

This adds:
- 8 sample UDCPR rules
- 2 demo users

### 3. Enable AI Features

1. Get OpenAI API key: https://platform.openai.com/
2. Add to `server/.env`: `OPENAI_API_KEY=sk-...`
3. Restart server

### 4. Enable Map

1. Get Mapbox token: https://www.mapbox.com/
2. Add to `.env`: `VITE_MAPBOX_TOKEN=pk.ey...`
3. Restart client

## API Documentation

### Calculator
```
POST /api/calculator/calculate
{
  "zone": "Residential",
  "plotArea": 500,
  "roadWidth": 12,
  "landUse": "Residential",
  "buildingType": "Residential"
}
```

### Compliance Check
```
POST /api/compliance/check
FormData with:
- drawing: file (optional)
- projectData: JSON string
```

### Rules Search
```
GET /api/rules/search?query=FSI&chapter=Chapter%203
```

### Projects
```
GET /api/projects?userId=user_id
POST /api/projects
{
  "projectName": "My Project",
  "location": "Mumbai",
  "plotArea": 500,
  "userId": "user_id"
}
```

## Troubleshooting

### Server won't start
- Check if MongoDB is running (if using local MongoDB)
- Verify .env file exists in server folder
- Check port 5000 is not in use

### Client won't start
- Check port 3000 is not in use
- Clear node_modules and reinstall: `npm install`

### Map not showing
- Verify VITE_MAPBOX_TOKEN is set
- Check browser console for errors
- Restart client after adding token

### AI Assistant not working
- Add valid OpenAI API key to server/.env
- Check API key has credits
- Restart server

## Production Deployment

Before deploying to production:

1. Change JWT_SECRET to a strong random string
2. Use MongoDB Atlas for database
3. Set up proper CORS origins
4. Enable HTTPS
5. Add rate limiting
6. Set up proper error logging
7. Add input validation and sanitization
8. Implement proper password hashing (currently simplified)

## Support

For issues or questions:
- Check the README.md
- Review API endpoints in server/src/routes/
- Check browser console for frontend errors
- Check server logs for backend errors

Happy building! 🚀
