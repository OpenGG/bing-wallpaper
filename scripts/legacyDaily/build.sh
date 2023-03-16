#!/usr/bin/env bash

rm -f temp.txt
find ../origin/en-US/ -iname '*.json'|xargs -n1 sh -c 'cat $0 >> temp.txt; echo "" >> temp.txt'

deno run --allow-all ./scripts/legacyDaily/build.ts
