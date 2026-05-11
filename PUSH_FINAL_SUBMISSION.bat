@echo off
setlocal enabledelayedexpansion

echo ======================================================
echo 🧭 TRAVELOOP - Hackathon Submission Push Script
echo ======================================================
echo.

:: Check for Git initialization
if not exist .git (
    echo ⚠️ Git not detected. Initializing...
    git init
    git branch -M main
)

:: Check if remote exists, if not ask user (but since it's a script, we assume 'origin' or skip)
git remote -v > nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️ No remote repository linked!
    echo Please run: git remote add origin [YOUR_GITHUB_URL]
    echo Then run this script again.
    pause
    exit /b
)

echo 📥 Pulling latest changes from remote...
git pull origin main --rebase

echo.
echo 📸 Adding files to staging...
git add .

echo.
echo 💾 Committing changes...
set /p commit_msg="Enter commit message (or press Enter for default): "
if "!commit_msg!"=="" set commit_msg="FINAL HACKATHON SUBMISSION"

git commit -m "!commit_msg!"

echo.
echo ⬆️ Pushing to GitHub (main branch)...
git push origin main

if %errorlevel% equ 0 (
    echo.
    echo ✅ SUCCESS! Your project is now updated on GitHub.
    echo 🔗 Visit your repository to verify:
    git remote -v | findstr "push"
) else (
    echo.
    echo ❌ FAILED! Please check the error messages above.
)

echo.
pause
