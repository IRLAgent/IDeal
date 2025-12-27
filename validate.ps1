# Pre-Push Validation Script for PowerShell
# Run this before pushing to GitHub

Write-Host ""
Write-Host "========================================"
Write-Host "   IDeal Pre-Push Validation" -ForegroundColor Cyan
Write-Host "========================================" 
Write-Host ""

# Frontend build check
Write-Host "[1/2] Checking frontend build..." -ForegroundColor Yellow
Set-Location frontend
& npm run build
if ($LASTEXITCODE -ne 0) {
  Write-Host ""
  Write-Host "❌ Frontend build FAILED" -ForegroundColor Red
  Set-Location ..
  exit 1
}

# Frontend lint check
Write-Host ""
Write-Host "[2/2] Checking frontend linting..." -ForegroundColor Yellow
& npm run lint
if ($LASTEXITCODE -ne 0) {
  Write-Host ""
  Write-Host "❌ Frontend linting FAILED" -ForegroundColor Red
  Set-Location ..
  exit 1
}

Set-Location ..

Write-Host ""
Write-Host "========================================"
Write-Host "✨ All checks PASSED! Ready to push" -ForegroundColor Green
Write-Host "========================================" 
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  git add ."
Write-Host "  git commit -m `"Your message`""
Write-Host "  git push"
Write-Host ""
