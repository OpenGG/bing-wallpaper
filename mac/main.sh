#!/usr/bin/env bash

set -e

readonly PROJECT_NAME="io.github.opengg.bing-wallpaper"

readonly LOCAL_BASE="$HOME/.$PROJECT_NAME"

readonly LOCAL_PLIST="$LOCAL_BASE/$PROJECT_NAME.plist"

readonly LOCAL_TXT="$LOCAL_BASE/current.txt"

readonly TMP_BASE="/tmp/$PROJECT_NAME"
readonly TMP_IMG="$TMP_BASE/download.jpg"

readonly REMOTE_BASE="https://raw.githubusercontent.com/OpenGG/bing-wallpaper/master"

readonly REMOTE_CURRENT="$REMOTE_BASE/wallpaper/current.txt?_=$(date +%Y%m%d)"

readonly REMOTE_SCRIPT="$REMOTE_BASE/mac/script.sh?_=$(date +%Y%m%d)"

readonly LOCAL_SCRIPT="$LOCAL_BASE/script.sh"

readonly MONITOR="0" # 0 means all monitors

readonly CURL="curl --silent --doh-url https://dns.alidns.com/dns-query"

readonly COMMAND="$1"

install() {
    mkdir -p $LOCAL_BASE
    mkdir -p $TMP_BASE

    echo "| Download script from $REMOTE_SCRIPT to $LOCAL_SCRIPT"

    $CURL "$REMOTE_SCRIPT" -o "$LOCAL_SCRIPT"

    chmod +x "$LOCAL_SCRIPT"

    echo "| Generating $LOCAL_PLIST"
    cat > $LOCAL_PLIST <<- EOM
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple Computer//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>$PROJECT_NAME</string>
    <key>OnDemand</key>
    <true/>
    <key>ProgramArguments</key>
    <array>
        <string>/bin/bash</string>
        <string>$LOCAL_SCRIPT</string>
        <string>run</string>
    </array>
    <key>EnvironmentVariables</key>
    <dict>
        <key>PATH</key>
        <string>/usr/local/bin:/usr/local/sbin:/usr/bin:/bin:/usr/sbin:/sbin</string>
    </dict>
     <key>StandardErrorPath</key>
    <string>$TMP_BASE/task.err</string>
    <key>StandardOutPath</key>
    <string>$TMP_BASE/task.out</string>
    <key>StartInterval</key>
    <integer>3600</integer>
	<key>RunAtLoad</key>
	<true/>
</dict>
</plist>
EOM

    echo "| Uninstalling $LOCAL_PLIST"
    launchctl bootout gui/`id -u` "$LOCAL_PLIST" 2>/dev/null || true

    echo "| Installing $LOCAL_PLIST"
    launchctl bootstrap gui/`id -u` "$LOCAL_PLIST"

    echo "| The installation was successful. Please execute the following command to set the wallpaper immediately:"
    echo ""
    echo "  ~/.$PROJECT_NAME/script.sh run"
    echo ""
}

uninstall() {
    echo "| Uninstalling $LOCAL_PLIST"

    launchctl bootout gui/`id -u` "$LOCAL_PLIST" 2>/dev/null
}

run() {
    mkdir -p $TMP_BASE
    mkdir -p $LOCAL_BASE
    rm -f $TMP_IMG

    echo "| Get current image from $REMOTE_CURRENT"

    readonly REMOTE_IMG_CONTENT=$($CURL "$REMOTE_CURRENT")
    readonly REMOTE_IMG=$(echo "$REMOTE_IMG_CONTENT"|sed 's/.* http/http/')

    CURRENT_IMG=""

    if [ -e "$LOCAL_TXT" ]; then
        CURRENT_IMG=$(cat "$LOCAL_TXT")
    fi

    if [ "$CURRENT_IMG" == "$REMOTE_IMG" ]; then
        echo "| Image not changed, skipping"
    else
        echo "| Download remote image from $REMOTE_IMG, saving to $TMP_IMG"

        $CURL "$REMOTE_IMG" -o "$TMP_IMG"

        readonly HASH=$(openssl md5 "$TMP_IMG"|perl -pe 's/.*=\s*//')

        readonly TMP_IMG_HASH="$TMP_BASE/$HASH.jpg"

        echo "| Move $TMP_IMG to $TMP_IMG_HASH"
        mv "$TMP_IMG" "$TMP_IMG_HASH"

        echo "| Set desktop background to $TMP_IMG_HASH"

        osascript -e 'tell application "System Events" to tell every desktop to set picture to "'$TMP_IMG_HASH'"'

        echo "| Saving to $LOCAL_TXT"
        echo $REMOTE_IMG > $LOCAL_TXT

        echo "| Removing temp file: $TMP_IMG_HASH"
        rm $TMP_IMG_HASH

        echo "| Success"
    fi
}

if [ "$COMMAND" == "install" ]; then
    install
elif [ "$COMMAND" == "uninstall" ]; then
    uninstall
elif [ "$COMMAND" == "run" ]; then
    run
else
    echo "| Error: unknown command"
fi
