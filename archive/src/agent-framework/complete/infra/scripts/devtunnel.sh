#!/bin/bash

exe=$(which devtunnel)
if [ $? -ne 0 ]; then
  echo "Dev Tunnels CLI not found. Please install: https://learn.microsoft.com/azure/developer/dev-tunnels/get-started"
  exit 1
fi

tunnelId=""
envFile="env/.env.local"

while IFS= read -r line; do
  if [[ $line == TUNNEL_ID=* ]]; then
    tunnelId="${line#*=}"
  fi
done <"$envFile"

if [ -z "$tunnelId" ]; then
  echo "No TUNNEL_ID found. Creating tunnel..."

  echo "Logging in to Dev Tunnels..."
  devtunnel user login >/dev/null

  echo "Creating tunnel..."
  tunnel=$(devtunnel create -a --host-header unchanged)
  tunnelId=$(echo "$tunnel" | grep 'Tunnel ID' | cut -d ':' -f2 | xargs)

  echo "Creating port and access..."
  port=3978
  devtunnel port create $tunnelId -p $port
  devtunnel access create $tunnelId -p $port -a

  echo "Updating env/.env.local..."

  hostname=$(echo $tunnelId | cut -d '.' -f1)
  cluster=$(echo $tunnelId | cut -d '.' -f2)

  domain="$hostname-$port.$cluster.devtunnels.ms"
  endpoint="https://$domain"

  # read file into an array
  lines=()
  while IFS= read -r line; do
    lines+=("$line")
  done <"$envFile"

  # track which entries were found
  foundBotEndpoint=false
  foundBotDomain=false
  foundTunnelId=false

  # update lines
  for i in "${!lines[@]}"; do
    if [[ ${lines[i]} == BOT_ENDPOINT=* ]]; then
      lines[i]="BOT_ENDPOINT=$endpoint"
      foundBotEndpoint=true
    fi
    if [[ ${lines[i]} == BOT_DOMAIN=* ]]; then
      lines[i]="BOT_DOMAIN=$domain"
      foundBotDomain=true
    fi
    if [[ ${lines[i]} == TUNNEL_ID=* ]]; then
      lines[i]="TUNNEL_ID=$tunnelId"
      foundTunnelId=true
    fi
  done

  # add missing entries
  if [ "$foundBotEndpoint" = false ]; then
    lines+=("BOT_ENDPOINT=$endpoint")
  fi
  if [ "$foundBotDomain" = false ]; then
    lines+=("BOT_DOMAIN=$domain")
  fi
  if [ "$foundTunnelId" = false ]; then
    lines+=("TUNNEL_ID=$tunnelId")
  fi

  # write array to file
  printf "%s\n" "${lines[@]}" >"$envFile"

  echo "TUNNEL_ID: $tunnelId"
  echo "NOTIFICATION_ENDPOINT: $endpoint"
  echo "NOTIFICATION_DOMAIN: $domain"
fi

devtunnel host $tunnelId