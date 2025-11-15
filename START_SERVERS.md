# How to Start UDCPR Servers

## Problem: PowerShell Execution Policy
Windows PowerShell is blocking npm commands due to execution policy restrictions.

## Solution: Multiple Methods

### Method 1: Use Batch Files (Easiest)

**Option A: Double-click these files:**
- `start-server.bat` - Starts the backend server
- `start-client.bat` - Starts the frontend client

**Option B: Run from Command Prompt (cmd):**
```cmd
# Terminal 1 - Backend
start-server.bat

# Terminal 2 - Frontend  
start-client.bat
```

### Method 2: Use Node Directly

**Terminal 1 - Backend:**
```bash
cd server
node src/index.js
```

**Terminal 2 - Frontend:**
```bash
cd client
npx vite
```

### Method 3: Fix PowerShell Execution Policy (Permanent Fix)

**Run PowerShell as Administrator and execute:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then you can use npm normally:
```bash
# Terminal 1
cd server
npm run dev

# Terminal 2
cd client
npm run dev
```

### Method 4: Use CMD Instead of PowerShell

Open **Command Prompt (cmd)** instead of PowerShell:

**Terminal 1:**
```cmd
cd server
npm run dev
```

**Terminal 2:**
```cmd
cd client
npm run dev
```

## Verify Servers Are Running

### Backend (Port 5000)
You should see:
```
Server running on port 5000
✅ MongoDB connected
```

Test: http://localhost:5000

### Frontend (Port 5173)
You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

Test: http://localhost:5173

## Current Status

✅ **Backend is running** on port 5000
- MongoDB connected
- 2,704 rules loaded
- All 35 districts covered
- All 21 categories available

⏳ **Frontend needs to be started**

## Quick Test

Once both servers are running, go to:
http://localhost:5173/district-rules

Then test:
1. Select "Aurangabad" → See 84 rules
2. Select "Affordable Housing" → See 5 rules
3. Select "FSI" → See 23 rules
4. Try other districts and categories!

## Troubleshooting

**If backend won't start:**
- Check MongoDB is running
- Check `.env` file exists in server folder
- Check port 5000 is not in use

**If frontend won't start:**
- Check Node.js is installed: `node --version`
- Check npm is installed: `npm --version`
- Try: `cd client && npx vite`

**If npm commands don't work:**
- Use Method 1 (batch files) or Method 2 (node directly)
- Or fix PowerShell policy with Method 3
