#!/usr/bin/env sh
set -eu
if [ -f /usr/share/nginx/html/config.js.template ]; then
  echo "Generating runtime config.js from ENV..."
  envsubst < /usr/share/nginx/html/config.js.template > /usr/share/nginx/html/config.js
fi
