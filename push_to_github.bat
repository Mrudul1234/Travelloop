@echo off
echo ===================================================
echo TRAVELOOP — GITHUB PUSH SCRIPT
echo ===================================================
echo.

cd /d "C:\Users\mrudu\OneDrive\Desktop\Travelloop"

echo Cleaning up local Git history...
rd /s /q .git 2>nul
git init

echo Setting git identity...
git config user.email "mrudulmistry@gmail.com"
git config user.name "Mrudul1234"

echo Cleaning up sensitive files...
del set_vercel_env.ps1 2>nul

echo Staging files...
git add .

echo Committing clean build...
git commit -m "Initial Clean Build"

echo.
echo Attempting to Force Push to GitHub...
git remote add origin https://github.com/Mrudul1234/Travelloop >> push_log.txt 2>&1
git branch -M main >> push_log.txt 2>&1
git push -u origin main --force >> push_log.txt 2>&1

echo.
echo ===================================================
echo DONE! Check push_log.txt if you see any errors.
echo https://github.com/Mrudul1234/Travelloop
echo ===================================================
pause
