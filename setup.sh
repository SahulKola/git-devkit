#!/bin/bash

set -e

echo "🚀 Installing git-multi-ssh..."

INSTALL_DIR="$HOME/.git-multi-ssh"

if [ -d "$INSTALL_DIR" ]; then
  echo "🔄 Updating..."
  cd "$INSTALL_DIR"
  git pull
else
  echo "📦 Cloning..."
  git clone https://github.com/sahulkola/git-multi-ssh.git "$INSTALL_DIR"
  cd "$INSTALL_DIR"
fi

npm install
npm link

echo "✅ Done! Run: git-multi-ssh"