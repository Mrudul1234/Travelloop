@echo off
setlocal enabledelayedexpansion
title 🧭 Travelloop Final Submission Sync

:: Set colors for terminal if supported
echo ======================================================
echo    🚀 TRAVELLOOP HACKATHON FINAL SUBMISSION SYNC
echo ======================================================
echo.

:: 1. Initial Checks
echo [1/4] Checking environment...
if not exist .git (
    echo ⚠️ Git repository not found. Initializing...
    git init
    git branch -M main
)

:: 2. Remote Verification
git remote -v | findstr "origin" > nul
if %errorlevel% neq 0 (
    echo ❌ No GitHub remote found!
    echo.
    set /p remote_url="Please paste your GitHub Repository URL: "
    git remote add origin !remote_url!
    echo ✅ Remote 'origin' added.
)

:: 3. Pull & Sync (Safety first)
echo.
echo [2/4] Syncing with GitHub...
git pull origin main --rebase --quiet
if %errorlevel% neq 0 (
    echo ⚠️ Warning: Pull failed. This might be a new repo. Continuing...
)

:: 4. Add & Commit
echo.
echo [3/4] Staging and Committing changes...
git add .

:: Check if there are changes to commit
git diff --cached --quiet
if %errorlevel% equ 0 (
    echo ✅ No new changes to commit.
) else (
    echo.
    echo 📝 Preparing final commit...
    git commit -m "🚀 FINAL HACKATHON SUBMISSION: Travelloop v1.0 (AI Itineraries, Budgeting, and Explore) ✨🗺️"
)

:: 5. Final Push
echo.
echo [4/4] Uploading to GitHub...
git push origin main
if %errorlevel% equ 0 (
    echo.
    echo ======================================================
    echo    ✅ SUCCESS! Your submission is now live.
    echo ======================================================
) else (
    echo.
    echo ❌ PUSH FAILED. Please check your internet or permissions.
)

echo.
echo Press any key to exit.
pause > nul
