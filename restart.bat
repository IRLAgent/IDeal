@echo off
REM Windows batch file wrapper for restart.ps1
powershell -ExecutionPolicy Bypass -File "%~dp0restart.ps1"
