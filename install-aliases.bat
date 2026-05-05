@echo off
REM ============================================================================
REM Install Aliases Script for Windows
REM Sets up Git aliases from setup-aliases.bat
REM ============================================================================

setlocal enabledelayedexpansion

echo.
echo 🚀 Installing Git aliases...
echo.

REM Run the setup-aliases script
call "%~dp0setup-aliases.bat"

echo.
echo ✅ Done!
echo.
