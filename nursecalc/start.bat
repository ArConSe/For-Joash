@echo off
REM ============================================================
REM  NurseCalc - one-click START (just run the app, no update)
REM  Double-click this file to open the app.
REM ============================================================
cd /d "%~dp0"

echo.
echo ============================================
echo   Starting NurseCalc
echo   Open this in your browser:  http://localhost:5173
echo   Leave this window open. Press Ctrl+C to stop.
echo ============================================
echo.

call npm run dev

echo.
echo NurseCalc stopped.
pause
