@echo off
echo ==========================================
echo   Deploying NueaKubPom to GitHub (Fix)
echo ==========================================

:: 1. Force Configure Identity (Local Only) so Git doesn't complain
echo [1/8] Configuring Git Identity (Local)...
git config --local user.email "admin@nueakubpom.com"
git config --local user.name "NueaKubPom Admin"

echo [2/8] Initializing Git...
git init

echo [3/8] Adding files...
git add .
:: Check step: List status
git status

echo [4/8] Committing changes...
git commit -m "Update: Dark Luxury Theme & QR Generator App"

echo [5/8] Setting branch to main...
:: This ensures the current branch is named 'main'
git branch -M main

echo [6/8] Configuring Remote...
:: Try to add, then ensure URL is correct
git remote add origin git@github.com:NueaKubPom/nueakubpom.github.io.git
git remote set-url origin git@github.com:NueaKubPom/nueakubpom.github.io.git

echo [7/8] Pull (Rebase)...
:: In case remote has changes, pull them first to invoke a merge/rebase
:: Avoiding conflicts by forcing update in simple scenarios, or pulling safely
git pull origin main --rebase

echo [8/8] Pushing to GitHub...
:: If this is the VERY first push, --set-upstream sets up tracking
git push -u origin main

echo.
echo ==========================================
echo   Done! If you see errors, please copy them or screenshot.
echo ==========================================
pause
