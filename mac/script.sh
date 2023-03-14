#!/usr/bin/env bash

set -e

curl --doh-url https://dns.alidns.com/dns-query \
  https://raw.githubusercontent.com/OpenGG/bing-wallpaper/master/mac/main.sh \
  | bash -s -- "$@"
