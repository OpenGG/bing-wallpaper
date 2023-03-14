# Bing Wallpaper

> :sparkles: This repository includes Bing wallpapers and utilizes a GitHub Action to crawl them daily.

## Auto set wallpaper for mac

```bash
# Install schedule task to fetch bing wallpaper automatically.

curl --doh-url https://dns.alidns.com/dns-query \
  https://raw.githubusercontent.com/OpenGG/bing-wallpaper/master/mac/script.sh \
  | bash -s -- "install"

# Set wallpaper right away.
~/.io.github.opengg.bing-wallpaper/script.sh run
  
```
