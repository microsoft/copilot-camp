$exe = where.exe devtunnel.exe
if ("" -eq $exe) {
  Write-Host "Dev Tunnels CLI not found. Please install: https://learn.microsoft.com/azure/developer/dev-tunnels/get-started"
  exit
}

$tunnelId = ""
$envFile = ".\env\.env.local"
$envFileContent = Get-Content $envFile
$envFileContent | ForEach-Object {
  if ($_ -like "TUNNEL_ID=*") {
    $tunnelId = $_.Split("=")[1].Trim()
  }
}

if ("" -eq $tunnelId) {
  Write-Host "No TUNNEL_ID found. Creating tunnel..."

  Write-Host "Logging in to Dev Tunnels..."
  devtunnel user login > $null
    
  Write-Host "Creating tunnel..."
  $tunnel = devtunnel.exe create -a --host-header unchanged
  $tunnelId = $tunnel -split '\r?\n' | Select-String 'Tunnel ID' | ForEach-Object { ($_ -split ':')[1].Trim() }
    
  Write-Host "Creating port and access..."
  $port = 7071
  devtunnel port create $tunnelId -p $port > $null
  devtunnel access create $tunnelId -p $port -a > $null
    
  Write-Host "Updating env\.env.local..."

  $foundTunnelId = $false

  $updatedContent = $envFileContent | ForEach-Object {
    $line = $_
    if ($line -like "TUNNEL_ID=*") {
      $line = "TUNNEL_ID=$tunnelId"
      $foundTunnelId = $true
    }
    $line
  }

  # Add missing entries
  if (-not $foundTunnelId) {
    $updatedContent += "TUNNEL_ID=$tunnelId"
  }

  $updatedContent | Set-Content $envFile

  Write-Host "TUNNEL_ID: $tunnelId"
}

devtunnel.exe host $tunnelId