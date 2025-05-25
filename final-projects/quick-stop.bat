@echo off
echo Stopping all services quickly...

REM Stop frontend if running
echo Stopping frontend...
taskkill /f /im node.exe 2>nul

REM Stop Docker containers quickly
echo Stopping Docker containers...
docker-compose down --timeout 5

REM Kill any remaining processes
echo Cleaning up remaining processes...
taskkill /f /im docker.exe 2>nul
taskkill /f /im dockerd.exe 2>nul

echo All services stopped!
pause 