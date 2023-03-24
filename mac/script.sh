#!/usr/bin/env bash

set -e

readonly SCRIPT_URL=https://raw.githubusercontent.com/OpenGG/bing-wallpaper/master/mac/main.sh

readonly SCRIPT_PATH=/tmp/io.github.opengg.bing-wallpaper.sh

readonly DOH_URL=https://dns.alidns.com/dns-query

curl \
  --fail \
  --speed-limit 1024 \
  --doh-url "$DOH_URL" \
  -o "$SCRIPT_PATH" \
  "$SCRIPT_URL"

bash "$SCRIPT_PATH" "$@"

rm "$SCRIPT_PATH"
