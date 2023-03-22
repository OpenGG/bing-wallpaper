#!/usr/bin/env bash

set -e

checkImage() {
  local img
  local out
  local code
  local corrupt

  IMAGE_CORRUPT=""

  img="$1"

  set +e
  out=$(identify -verbose "$img" 2>&1)
  code="$?"
  set -e

#   echo $out
#   echo "checkImage: $code"

  if [[ "$code" != "0" ]]; then
    IMAGE_CORRUPT="$out"
    return 0
  fi

  corrupt=$(echo "$out" | grep -i corrupt || [[ $? == 1 ]])

#   echo "$corrupt"

  if [[ -n "$corrupt" ]]; then
    IMAGE_CORRUPT="$corrupt"
    return 0
  fi

  IMAGE_CORRUPT=""
  return 0
}

IMAGE_CORRUPT=""

# echo $1

checkImage $1

if [[ -z "$IMAGE_CORRUPT" ]]; then
  exit 0
else
  exit 1
fi
