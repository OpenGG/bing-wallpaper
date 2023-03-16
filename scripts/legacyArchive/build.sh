#!/usr/bin/env bash

# https://github.com/xndcn/bing-wallpaper-archive

rm -f ./tmp/temp.txt
find ./tmp -iname '*.json'|xargs -n1 sh -c 'cat $0 >> ./tmp/temp.txt; echo "" >> ./tmp/temp.txt; echo "----" >> ./tmp/temp.txt'

deno run --allow-all ./scripts/legacyArchive/build.ts
