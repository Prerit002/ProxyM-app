Write-Host "Starting ProxyM Android App Bundle Build..." -ForegroundColor Green

$projectRoot = $PSScriptRoot
$mobileDir = Join-Path $projectRoot "mobile"
$buildOutputFile = Join-Path $mobileDir "build\app\outputs\bundle\release\app-release.aab"
$finalOutput = Join-Path $projectRoot "ProxyM-Release.aab"

Write-Host "Navigating to mobile directory..." -ForegroundColor Cyan
Set-Location $mobileDir

Write-Host "Running flutter build appbundle..." -ForegroundColor Cyan
flutter build appbundle

if (Test-Path $buildOutputFile) {
    Write-Host "Build successful! Copying to root directory..." -ForegroundColor Green
    Copy-Item -Path $buildOutputFile -Destination $finalOutput -Force
    Write-Host "Done! You can now upload 'ProxyM-Release.aab' to the Google Play Console." -ForegroundColor Green
} else {
    Write-Host "Build failed. App bundle not found." -ForegroundColor Red
}
