#!/usr/bin/env bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

cd app

if [ ! -d node_modules ]; then
  pnpm install
fi

pnpm run cli -d "$SCRIPT_DIR" "$@"
