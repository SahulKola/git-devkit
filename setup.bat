@echo off
REM ============================================================================
REM Git Multi-SSH Setup Script for Windows
REM ============================================================================

setlocal enabledelayedexpansion

echo.
echo 🚀 Installing git-multi-ssh...
echo.

set "INSTALL_DIR=%USERPROFILE%\.git-multi-ssh"

if exist "%INSTALL_DIR%" (
  echo 🔄 Updating...
  cd /d "%INSTALL_DIR%"
  git pull
) else (
  echo 📦 Cloning...
  git clone https://github.com/sahulkola/git-multi-ssh.git "%INSTALL_DIR%"
  cd /d "%INSTALL_DIR%"
)

call npm install
call npm link

echo.
echo ✅ Done! Run: git-multi-ssh
echo.

pause
