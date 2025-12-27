@echo off
REM Quick validation script - run before pushing to GitHub

echo.
echo ========================================
echo   IDeal Pre-Push Validation
echo ========================================
echo.

REM Frontend checks
echo [1/2] Checking frontend build...
cd frontend
call npm run build
if errorlevel 1 (
  echo.
  echo ❌ Frontend build FAILED
  cd ..
  exit /b 1
)

echo.
echo [2/2] Checking frontend linting...
call npm run lint
if errorlevel 1 (
  echo.
  echo ❌ Frontend linting FAILED
  cd ..
  exit /b 1
)

cd ..

echo.
echo ========================================
echo ✨ All checks PASSED! Ready to push
echo ========================================
echo.
echo Next steps:
echo   git add .
echo   git commit -m "Your message"
echo   git push
echo.
