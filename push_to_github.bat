@echo off
echo ===================================================
echo TRAVELOOP — GITHUB PUSH SCRIPT
echo ===================================================
echo.

cd /d "C:\Users\mrudu\OneDrive\Desktop\Travelloop"

echo Setting git identity...
git config user.email "mrudulmistry@gmail.com"
git config user.name "Mrudul1234"

echo Cleaning up sensitive files...
del set_vercel_env.ps1 2>nul
git rm --cached *.ps1 2>nul
git rm --cached push_log.txt 2>nul

echo Staging changes...
git add .

echo Committing changes...
git commit -m "Standard Update: Fixed Suspense and Build Config"

echo.
echo Pushing to GitHub...
git push origin main

echo.
echo ===================================================
echo DONE! Your changes are now on GitHub.
echo https://github.com/Mrudul1234/Travelloop
echo ===================================================
pause
