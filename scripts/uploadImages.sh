#!/usr/bin/env bash

set -e

trap "echo; exit" INT

readonly BUCKET=bing-wallpaper
readonly CURSOR_FILE=cursor.txt
readonly TEMP_FILE=temp.jpg

mkdir -p tmp

cd tmp

sort -n ../wallpaper/all.txt > all.txt

rm -f $CURSOR_FILE

echo "Get cursor from remote: $BUCKET/$CURSOR_FILE"
wrangler r2 object get "$BUCKET/$CURSOR_FILE" --file $CURSOR_FILE || true

cursor="$(cat $CURSOR_FILE)"

# cursor="2022/07/10"

saveCursor() {
  local updateCursor

  updateCursor="$(cat $CURSOR_FILE)"

  if [[ "$cursor" == "$updateCursor" ]]; then
    echo "Skip update cursor"
  else
    echo "Cursor: $(cat $CURSOR_FILE)"
    echo "Upload: cursor to remote: $BUCKET/$CURSOR_FILE"

    wrangler r2 object put "$BUCKET/$CURSOR_FILE" --file $CURSOR_FILE
  fi
}

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

  # echo $out
  # echo "checkImage: $code"

  if [[ "$code" != "0" ]]; then
    IMAGE_CORRUPT="$out"
    return 0
  fi

  corrupt=$(echo "$out" | grep -i corrupt || [[ $? == 1 ]])

  # echo "$corrupt"

  if [[ -n "$corrupt" ]]; then
    IMAGE_CORRUPT="$corrupt"
    return 0
  fi

  IMAGE_CORRUPT=""
  return 0
}

echo "Cursor: $cursor"

while IFS="" read -r p || [ -n "$p" ]
do
  source=$(echo "$p"|sed 's/^.* //')
  date=$(echo "$p"|sed 's/\.md .*$//')
  target=$(echo "$source"|sed 's/.*[?|&]id=//'|sed 's/&.*//')
  target="$date/$target"

  # echo "Dealing $date"

  if [[ "$date" > "$cursor" ]]; then
    echo "Dealing $date"

    rm -f $TEMP_FILE

    echo "Download $source => $TEMP_FILE"
    curl --fail --speed-limit 1024 "$source" -o $TEMP_FILE || break

    echo "Check image corrupt"
    IMAGE_CORRUPT=""

    # mv $TEMP_FILE xx.jpg
    # dd bs=1M count=1 if=xx.jpg of=$TEMP_FILE

    checkImage $TEMP_FILE

    if [[ -z "$IMAGE_CORRUPT" ]]; then
      echo "Image valid, upload $TEMP_FILE => $BUCKET/$target"
      wrangler r2 object put "$BUCKET/$target" --file $TEMP_FILE || break

      echo "$date" > $CURSOR_FILE

      if [[ "$date" == *1 ]]; then
        saveCursor
      fi
    else
      echo "Image corrupt: $IMAGE_CORRUPT"
      break
    fi
  # else
  #   echo "Ignore"
  fi
done < all.txt

saveCursor
