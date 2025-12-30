#!/usr/bin/env pwsh
# Restart script for IDeal.ie - Stops and restarts both frontend and backend servers

Write-Host "🔄 IDeal.ie Restart Script" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
Write-Host ""

# Function to kill process on a specific port
function Stop-ProcessOnPort {
    param([int]$Port, [string]$Name)
    
    Write-Host "🔍 Checking for $Name on port $Port..." -ForegroundColor Yellow
    
    $process = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | 
               Select-Object -ExpandProperty OwningProcess -First 1
    
    if ($process) {
        Write-Host "   ⚠️  Found process $process running on port $Port" -ForegroundColor Red
        Write-Host "   🔪 Killing process..." -ForegroundColor Red
        Stop-Process -Id $process -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 1
        Write-Host "   ✅ Process stopped" -ForegroundColor Green
    } else {
        Write-Host "   ℹ️  No process found on port $Port" -ForegroundColor Gray
    }
    Write-Host ""
}

# Stop existing processes
Stop-ProcessOnPort -Port 5000 -Name "Backend"
Stop-ProcessOnPort -Port 3000 -Name "Frontend"

# Wait a moment for ports to be released
Write-Host "⏳ Waiting for ports to be released..." -ForegroundColor Yellow
Start-Sleep -Seconds 2
Write-Host ""

# Start Backend
Write-Host "🚀 Starting Backend Server..." -ForegroundColor Cyan
$backendPath = Join-Path $PSScriptRoot "backend"
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "Set-Location '$backendPath'; npm run dev" -WindowStyle Normal
Write-Host "   ✅ Backend starting on http://localhost:5000" -ForegroundColor Green
Write-Host ""

# Wait for backend to initialize
Write-Host "⏳ Waiting for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 3
Write-Host ""

# Start Frontend
Write-Host "🚀 Starting Frontend Server..." -ForegroundColor Cyan
$frontendPath = Join-Path $PSScriptRoot "frontend"
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "Set-Location '$frontendPath'; npm run dev" -WindowStyle Normal
Write-Host "   ✅ Frontend starting on http://localhost:3000" -ForegroundColor Green
Write-Host ""

Write-Host "✨ Both servers are starting up!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Check the new terminal windows for server output" -ForegroundColor Cyan
Write-Host "🌐 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "⚙️  Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host ""
