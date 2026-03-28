#!/bin/sh

cat <<EOF > /app/public/config.js
window.__CONFIG__ = {
  VITE_API_BASE_URL: "${VITE_API_BASE_URL:-}"
};
EOF

cron

exec ./app "$@"
