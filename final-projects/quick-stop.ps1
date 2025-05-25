Write-Host "Stopping all services quickly..." -ForegroundColor Yellow

# Stop frontend if running
Write-Host "Stopping frontend..." -ForegroundColor Cyan
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force

# Stop Docker containers quickly
Write-Host "Stopping Docker containers..." -ForegroundColor Cyan
docker-compose down --timeout 5

# Alternative: Force stop specific containers
Write-Host "Force stopping specific containers..." -ForegroundColor Cyan
docker stop $(docker ps -q) --time 2 2>$null

Write-Host "All services stopped!" -ForegroundColor Green
Read-Host "Press Enter to continue..." 