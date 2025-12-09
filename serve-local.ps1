<#
  serve-local.ps1
  显示本机 IPv4 并在当前目录启动 Python 静态服务器 (port 8080)
  用法: 在 PowerShell 中进入 `christmas_tree` 目录后运行: .\serve-local.ps1
  如果脚本被阻止，请使用: powershell -ExecutionPolicy Bypass -File .\serve-local.ps1
#>

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $scriptDir

Write-Host "Serving directory: $scriptDir" -ForegroundColor Cyan

# 尝试从 ipconfig 提取 IPv4 地址
Write-Host "Local IPv4 addresses (non-loopback):" -ForegroundColor Cyan
$ips = @()
try{
    $ips = (ipconfig) | Select-String 'IPv4' | ForEach-Object { ($_ -split ':')[1].Trim() }
}catch{}

# 回退到 Get-NetIPAddress（某些系统没有 ipconfig 输出格式）
if(-not $ips -or $ips.Count -eq 0){
    try{
        $ips = Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -ne '127.0.0.1' -and $_.IPAddress -notlike '169.*' } | Select-Object -ExpandProperty IPAddress
    }catch{}
}

if($ips -and $ips.Count -gt 0){
    $ips | ForEach-Object { Write-Host " - $_" }
}else{
    Write-Host " - 无法检测到非回环 IPv4 地址，请检查网络连接" -ForegroundColor Yellow
}

Write-Host "";
Write-Host "Starting Python HTTP server on port 8080..." -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server." -ForegroundColor DarkYellow

# 启动服务器（前台运行，方便看到日志）
python -m http.server 8080

Write-Host "Server stopped." -ForegroundColor Cyan