#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/drop8-test}"
PORT="${PORT:-2567}"

sudo apt-get update
sudo apt-get install -y curl ca-certificates rsync git build-essential

if ! command -v node >/dev/null 2>&1 || [ "$(node -p "Number(process.versions.node.split('.')[0])" 2>/dev/null || echo 0)" -lt 22 ]; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi

sudo corepack enable
sudo npm install -g pm2

sudo mkdir -p "$APP_DIR"
sudo chown "$USER":"$USER" "$APP_DIR"

sudo ufw allow OpenSSH || true
sudo ufw allow "$PORT"/tcp || true

pm2 startup systemd -u "$USER" --hp "$HOME" || true

echo "DROP8 EC2 bootstrap complete. App directory: $APP_DIR, port: $PORT"
