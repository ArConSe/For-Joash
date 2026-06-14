@echo off
REM ============================================================
REM  NurseCalc - one-click UPDATE + RUN
REM  Double-click this file to fetch the latest changes and
REM  start the app. (Works from anywhere - it jumps to its own
REM  folder automatically.)
REM ============================================================
cd /d "%~dp0"

echo.
echo ============================================
echo   NurseCalc - getting the latest version
echo ============================================
echo.

REM Always track the development branch so a plain pull can't miss the work.
set NC_BRANCH=claude/modest-brahmagupta-hp9hko

git fetch origin
git checkout %NC_BRANCH%
git pull origin %NC_BRANCH%
if errorlevel 1 (
  echo.
  echo [!] Could not download updates.
  echo     Check your internet connection and try again.
  echo.
  pause
  exit /b 1
)

echo.
echo Installing any new pieces (this is quick if nothing changed)...
call npm install

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
