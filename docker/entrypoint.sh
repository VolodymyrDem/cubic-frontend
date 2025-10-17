#!/bin/sh
set -e

# Default values
: "${APP_BASE_PATH:=/}"
: "${API_BASE_URL:=}"

# Generate runtime config (config.js) from environment variables
envsubst '
	$APP_BASE_PATH
	$API_BASE_URL
' < /config.template.js > "/usr/share/nginx/html/config.js"

# Start nginx
exec nginx -g 'daemon off;'