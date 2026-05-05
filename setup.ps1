# ============================================================================
# Git Multi-SSH Setup Script for Windows (PowerShell)
# ============================================================================

Write-Host "`n🚀 Installing git-multi-ssh...`n" -ForegroundColor Green

$installDir = Join-Path $env:USERPROFILE ".git-multi-ssh"

if (Test-Path $installDir) {
    Write-Host "🔄 Updating..." -ForegroundColor Yellow
    Set-Location $installDir
    & git pull
} else {
    Write-Host "📦 Cloning..." -ForegroundColor Yellow
    & git clone https://github.com/sahulkola/git-multi-ssh.git $installDir
    Set-Location $installDir
}

Write-Host "Installing dependencies..." -ForegroundColor Yellow
& npm install
& npm link

Write-Host "`n✅ Done! Run: git-multi-ssh`n" -ForegroundColor Green
