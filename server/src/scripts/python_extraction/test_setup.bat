@echo off
echo ========================================
echo Testing Python Extraction Setup
echo ========================================
echo.

echo [1/5] Checking Python installation...
python --version
if errorlevel 1 (
    echo    ❌ FAIL: Python not found
    echo    Install from: https://www.python.org/
    goto :error
) else (
    echo    ✅ PASS: Python found
)

echo.
echo [2/5] Checking MongoDB connection...
python -c "from pymongo import MongoClient; client = MongoClient('mongodb://localhost:27017/', serverSelectionTimeoutMS=2000); client.server_info(); print('   ✅ PASS: MongoDB connected')" 2>nul
if errorlevel 1 (
    echo    ❌ FAIL: MongoDB not running
    echo    Start with: net start MongoDB
    goto :error
)

echo.
echo [3/5] Checking UDCPR DOCX file...
if exist "..\..\data\UDCPR Updated 30.01.25 with earlier provisions & corrections_compressed.docx" (
    echo    ✅ PASS: UDCPR file found
) else (
    echo    ❌ FAIL: UDCPR file not found
    goto :error
)

echo.
echo [4/5] Checking Mumbai-DCPR DOCX file...
if exist "..\..\data\MUBAI-DCPR.docx" (
    echo    ✅ PASS: Mumbai-DCPR file found
) else (
    echo    ❌ FAIL: Mumbai-DCPR file not found
    goto :error
)

echo.
echo [5/5] Checking Python packages...
if exist "venv\Scripts\activate.bat" (
    call venv\Scripts\activate.bat
    python -c "import docx, pymongo, dotenv; print('   ✅ PASS: All packages installed')" 2>nul
    if errorlevel 1 (
        echo    ❌ FAIL: Packages not installed
        echo    Run: setup.bat
        goto :error
    )
) else (
    echo    ⚠️  WARNING: Virtual environment not found
    echo    Run: setup.bat
    goto :error
)

echo.
echo ========================================
echo ✅ ALL CHECKS PASSED!
echo ========================================
echo.
echo You're ready to run extraction:
echo    run_extraction.bat
echo.
goto :end

:error
echo.
echo ========================================
echo ❌ SETUP INCOMPLETE
echo ========================================
echo.
echo Please fix the issues above and try again.
echo.

:end
pause
