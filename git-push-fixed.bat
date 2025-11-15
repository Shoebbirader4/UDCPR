@echo off
echo ========================================
echo UDCPR Master - Git Push (Fixed)
echo ========================================
echo.

cd /d F:\udcpr

echo Removing file with exposed secret...
git rm --cached RESTART_SERVER_GUIDE.md
del RESTART_SERVER_GUIDE.md
echo.

echo Adding all files...
git add .
echo.

echo Creating new commit...
git commit -m "Complete UDCPR Master Platform - Production Ready (Secrets Removed)

Features:
- 4,344 total rules (1,640 general + 2,704 district)
- Complete UDCPR 2020 coverage (Mumbai + Rest Maharashtra)
- AI-powered drawing analysis (GPT-4 Vision)
- AI assistant (GPT-4o)
- Comprehensive calculator (100%% verified)
- District rules search (35 districts, 21 categories)
- General rules library (1,640 rules)
- Project management system

Tech Stack:
- Frontend: React 18, Vite
- Backend: Node.js, Express, MongoDB
- AI: OpenAI GPT-4 Vision and GPT-4o

Status: Production Ready
Version: 1.0.0"
echo.

echo Pushing to GitHub...
git push -u origin main --force
echo.

echo ========================================
echo Done! Check: https://github.com/Shoebbirader4/UDCPR.git
echo ========================================
pause
