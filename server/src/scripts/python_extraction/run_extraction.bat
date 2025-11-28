@echo off
echo ========================================
echo UDCPR/Mumbai-DCPR Complete Extraction
echo ========================================
echo.

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo.
echo Starting extraction pipeline...
echo This may take several minutes...
echo.

python extract_all.py

echo.
if errorlevel 1 (
    echo ========================================
    echo Extraction FAILED
    echo ========================================
    echo Check extraction_log.txt for details
) else (
    echo ========================================
    echo Extraction SUCCESSFUL
    echo ========================================
    echo.
    echo Your database is now populated!
    echo Check the log file for details: extraction_log.txt
)

echo.
pause
