# MongoDB Setup Guide for UDCPR Master

## Option 1: MongoDB Atlas (Cloud - Recommended for Quick Start)

### Step 1: Create Free Account
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up with email or Google account
3. Choose "Free" tier (M0 Sandbox - 512MB storage)

### Step 2: Create Cluster
1. After login, click "Build a Database"
2. Choose "FREE" shared cluster
3. Select cloud provider (AWS recommended) and region (Mumbai/ap-south-1 for India)
4. Cluster name: "udcpr-cluster" (or any name)
5. Click "Create"

### Step 3: Create Database User
1. Security → Database Access → Add New Database User
2. Authentication Method: Password
3. Username: `udcpr_admin`
4. Password: Generate secure password (save it!)
5. Database User Privileges: "Read and write to any database"
6. Click "Add User"

### Step 4: Whitelist IP Address
1. Security → Network Access → Add IP Address
2. Click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production, use specific IP addresses
3. Click "Confirm"

### Step 5: Get Connection String
1. Go to "Database" → Click "Connect" on your cluster
2. Choose "Connect your application"
3. Driver: Node.js, Version: 5.5 or later
4. Copy connection string, it looks like:
   ```
   mongodb+srv://udcpr_admin:<password>@udcpr-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password
6. Add database name before the `?`:
   ```
   mongodb+srv://udcpr_admin:YOUR_PASSWORD@udcpr-cluster.xxxxx.mongodb.net/udcpr-master?retryWrites=true&w=majority
   ```

### Step 6: Update .env File
```bash
# In server/.env
MONGODB_URI=mongodb+srv://udcpr_admin:YOUR_PASSWORD@udcpr-cluster.xxxxx.mongodb.net/udcpr-master?retryWrites=true&w=majority
```

### Step 7: Seed Database
```bash
cd server
npm run seed
```

You should see:
```
Connecting to MongoDB...
Connected to MongoDB
Clearing existing rules...
Inserting 30 UDCPR rules...
Rules inserted successfully!
Creating sample users...
Sample users created!

✅ Database seeded successfully!
Total rules: 30
Total users: 2
```

---

## Option 2: Local MongoDB Installation (Windows)

### Step 1: Download MongoDB
1. Go to https://www.mongodb.com/try/download/community
2. Version: Latest (7.0+)
3. Platform: Windows
4. Package: MSI
5. Click "Download"

### Step 2: Install MongoDB
1. Run the downloaded .msi file
2. Choose "Complete" installation
3. Install MongoDB as a Service: ✓ (checked)
4. Service Name: MongoDB
5. Data Directory: C:\Program Files\MongoDB\Server\7.0\data
6. Log Directory: C:\Program Files\MongoDB\Server\7.0\log
7. Install MongoDB Compass: ✓ (optional GUI tool)
8. Click "Install"

### Step 3: Verify Installation
Open Command Prompt and run:
```bash
mongod --version
```

You should see MongoDB version information.

### Step 4: Start MongoDB Service
MongoDB should start automatically as a Windows service.

To check:
```bash
# Check service status
sc query MongoDB

# Start service if not running
net start MongoDB

# Stop service
net stop MongoDB
```

### Step 5: Update .env File
```bash
# In server/.env
MONGODB_URI=mongodb://localhost:27017/udcpr-master
```

### Step 6: Seed Database
```bash
cd server
npm run seed
```

---

## Option 3: MongoDB Compass (GUI Tool)

If you installed MongoDB Compass:

1. Open MongoDB Compass
2. Connection String:
   - Atlas: Use the connection string from Atlas
   - Local: `mongodb://localhost:27017`
3. Click "Connect"
4. You'll see your databases
5. After seeding, you should see:
   - Database: `udcpr-master`
   - Collections: `rules`, `users`, `projects`

---

## Verify Database Connection

### Method 1: Check Server Logs
When you start the server, you should see:
```
Server running on port 5000
MongoDB connected
```

If you see "MongoDB connection error", check:
- Connection string is correct
- Password doesn't have special characters (or is URL-encoded)
- IP is whitelisted (for Atlas)
- MongoDB service is running (for local)

### Method 2: Test API Endpoint
```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Search rules (after seeding)
curl http://localhost:5000/api/rules/search?query=FSI
```

### Method 3: Use MongoDB Compass
1. Connect to your database
2. Navigate to `udcpr-master` database
3. Check `rules` collection - should have 30 documents
4. Check `users` collection - should have 2 documents

---

## Troubleshooting

### Error: "MongoServerError: bad auth"
- Check username and password in connection string
- Ensure password is URL-encoded if it contains special characters
- Verify database user has correct permissions

### Error: "MongooseServerSelectionError: connect ECONNREFUSED"
- For local: MongoDB service not running
  ```bash
  net start MongoDB
  ```
- For Atlas: Check network access whitelist

### Error: "MongooseServerSelectionError: Could not connect to any servers"
- For Atlas: Check internet connection
- Verify connection string is correct
- Check if IP is whitelisted

### Connection String Special Characters
If your password has special characters, URL-encode them:
- `@` → `%40`
- `:` → `%3A`
- `/` → `%2F`
- `?` → `%3F`
- `#` → `%23`

Example:
```
Password: Pass@123
Encoded: Pass%40123
```

---

## Database Schema

### Rules Collection
```javascript
{
  chapter: String,
  section: String,
  clause: String,
  summary: String,
  fullText: String,
  keywords: [String],
  category: String,
  applicableZones: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### Users Collection
```javascript
{
  name: String,
  email: String (unique),
  role: String (Architect/StructuralEngineer/Developer/Authority),
  subscriptionStatus: String (free/pro/enterprise),
  organization: String,
  subscriptionExpiry: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Projects Collection
```javascript
{
  projectName: String,
  location: String,
  zoneType: String,
  plotArea: Number,
  roadWidth: Number,
  FSI: Number,
  setbacks: {
    front: Number,
    rear: Number,
    side1: Number,
    side2: Number
  },
  remarks: String,
  userId: ObjectId (ref: User),
  complianceStatus: String (pending/pass/fail),
  complianceReport: Object,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Next Steps After Setup

1. **Seed the database**: `npm run seed`
2. **Test rule search**: Visit http://localhost:3000/rules
3. **Create a project**: Visit http://localhost:3000/projects
4. **Test calculator**: Visit http://localhost:3000/calculator

---

## Production Considerations

For production deployment:

1. **Use MongoDB Atlas** (managed service)
2. **Enable authentication** (already configured)
3. **Whitelist specific IPs** (not 0.0.0.0/0)
4. **Enable SSL/TLS** (Atlas has this by default)
5. **Set up backups** (Atlas automated backups)
6. **Monitor performance** (Atlas monitoring tools)
7. **Use connection pooling** (already configured in Mongoose)
8. **Set up replica sets** (Atlas does this automatically)

---

## Support

If you encounter issues:
1. Check server logs for error messages
2. Verify .env file configuration
3. Test connection string in MongoDB Compass
4. Check MongoDB Atlas dashboard for connection attempts
5. Review this guide's troubleshooting section
