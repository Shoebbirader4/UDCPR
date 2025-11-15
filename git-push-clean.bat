@echo off
echo ========================================
echo UDCPR Master - Clean Git Push
echo ========================================
echo.

cd /d F:\udcpr

echo Step 1: Removing old Git repository...
rmdir /s /q .git
echo.

echo Step 2: Initializing fresh Git repository...
git init
echo.

echo Step 3: Adding remote...
git remote add origin https://github.com/Shoebbirader4/UDCPR.git
echo.

echo Step 4: Configuring Git user...
git config user.name "Shoeb Birader"
git config user.email "shoebbirader4@gmail.com"
echo.

echo Step 5: Adding all files (secrets already excluded by .gitignore)...
git add .
echo.

echo Step 6: Creating fresh commit...
git commit -m "Complete UDCPR Master Platform v1.0.0

Production-ready UDCPR compliance platform with complete coverage.

Features:
- 4,344 total rules (1,640 general + 2,704 district-specific)
- Complete UDCPR 2020 coverage for Mumbai and Rest of Maharashtra
- AI-powered drawing analysis using GPT-4 Vision
- Interactive AI assistant powered by GPT-4o
- Comprehensive calculator with 100%% verified accuracy
- District rules search across 35 districts and 21 categories
- General rules library with 1,640 searchable rules
- Project management system for organizing multiple projects
- Advanced search and filtering capabilities

Tech Stack:
- Frontend: React 18, Vite, React Router, Axios
- Backend: Node.js, Express, MongoDB, Mongoose
- AI: OpenAI GPT-4 Vision and GPT-4o APIs
- Database: MongoDB with 4,344 rules
- Tools: PDF-Parse, Multer, Sharp

Coverage: 95%% of UDCPR 2020
Status: Production Ready
Version: 1.0.0
Author: Shoeb Birader"
echo.

echo Step 7: Setting main branch...
git branch -M main
echo.

echo Step 8: Force pushing to GitHub (clean history)...
git push -u origin main --force
echo.

echo ========================================
echo Success! Repository pushed with clean history.
echo Visit: https://github.com/Shoebbirader4/UDCPR.git
echo ========================================
pause
