Write-Host "Starting ProxyM Production Build Process..." -ForegroundColor Green

$projectRoot = $PSScriptRoot
$adminDir = Join-Path $projectRoot "admin"
$backendDir = Join-Path $projectRoot "backend"
$buildDir = Join-Path $projectRoot "build"
$outputZip = Join-Path $projectRoot "proxym-production.zip"

# Step 1: Clean previous build
Write-Host "Cleaning up previous builds..." -ForegroundColor Cyan
if (Test-Path $buildDir) { Remove-Item -Recurse -Force $buildDir }
if (Test-Path $outputZip) { Remove-Item -Force $outputZip }

New-Item -ItemType Directory -Force -Path $buildDir | Out-Null

# Step 2: Build Next.js Admin Panel
Write-Host "Building Next.js Admin Panel..." -ForegroundColor Cyan
Set-Location $adminDir
npm run build

# Step 3: Copy Laravel Backend to Build Directory
Write-Host "Copying Backend files..." -ForegroundColor Cyan
Set-Location $projectRoot
# Using robocopy to exclude node_modules, tests, storage/logs etc.
robocopy $backendDir $buildDir /E /XD node_modules tests .git .github storage\logs /XF .env .env.testing phpunit.xml

# Step 4: Move Next.js out to backend/public/admin
Write-Host "Merging Admin Panel into Backend Public Directory..." -ForegroundColor Cyan
$adminBuildDir = Join-Path $adminDir "out"
$publicAdminDir = Join-Path $buildDir "public\admin"

New-Item -ItemType Directory -Force -Path $publicAdminDir | Out-Null
Copy-Item -Path "$adminBuildDir\*" -Destination $publicAdminDir -Recurse -Force

# Step 5: Compress to Zip (Requires PowerShell 5+)
Write-Host "Compressing to $outputZip..." -ForegroundColor Cyan
Compress-Archive -Path "$buildDir\*" -DestinationPath $outputZip

# Step 6: Cleanup
Write-Host "Cleaning up temporary build folder..." -ForegroundColor Cyan
Remove-Item -Recurse -Force $buildDir

Write-Host "Build Complete! Upload 'proxym-production.zip' to Hostinger." -ForegroundColor Green
