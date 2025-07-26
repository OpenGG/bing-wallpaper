# Current Workflow Analysis

The repository stores daily Bing wallpapers and uses several Deno based scripts
and shell utilities. The structure is summarised below:

```
wallpaper/               # daily markdown files
archive/                 # monthly archive markdown
scripts/                 # various helper scripts
.github/workflows/       # CI jobs
```

## Daily Update

`scripts/cron.ts` fetches the latest images from the Bing API. For every entry
it builds preview/download URLs and writes a markdown file to
`wallpaper/<year>/<month>/<day>.md` using `scripts/lib/template.ts`. This file
only contains plain Markdown without any metadata.

`scripts/cron.sh` simply runs the above TypeScript file using Deno. In the main
CI workflow (`.github/workflows/main.yml`) this script runs on schedule. After
fetching images the workflow executes `buildIndex.sh` and
`buildArchive.sh`.

- `buildIndex.sh` rebuilds `wallpaper/all.txt` and `<year>/<month>/all.txt` which
  hold a list of paths and 4K image links. It also updates `current.txt` with
  the most recent entry.
- `buildArchive.sh` truncates the "Latest wallpapers" section in the project
  README and appends the newest items from `wallpaper/all.txt`.

Finally `uploadImages.sh` iterates over `wallpaper/all.txt`, downloads each image
and uploads it to Cloudflare R2 using the `wrangler` CLI. A `cursor.txt` file in
the bucket tracks progress so already uploaded images are skipped. Every image
is checked with ImageMagick to detect corruption before uploading.

## Image Validation

`.github/workflows/check.yml` runs manually and uses the scripts in
`scripts/checkImages`. These scripts download objects from R2 and validate them
again with ImageMagick. The check is implemented using Deno and a shell helper
`checkImage.sh`.

## Legacy Scripts

Several `scripts/legacy*` folders contain one-off migration utilities used to
convert historical data sources. They parse third‑party JSON/Markdown datasets
and output files using the same template as the daily script. Our refactor keeps
this idea via a plugin system so new migrations can be added easily.

## Mac Helper

The `mac/` directory provides a small installer script for macOS. It sets up a
scheduled task which periodically downloads the latest wallpaper and sets it as
the desktop background.

## Summary

All automation relies heavily on Deno and shell scripts. Markdown files store
only basic information so important metadata from the Bing API is lost.
Uploading is tightly coupled to Cloudflare's R2 via the `wrangler` CLI.
