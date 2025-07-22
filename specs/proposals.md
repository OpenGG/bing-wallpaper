# Proposed Refactor

The new implementation replaces the Deno based scripts with a Node.js project
(located in `app/`).  All commands are executed through a single CLI entry
`src/cli.ts` using `npx tsx src/cli.ts <command>`.

## Technology Stack

- **TypeScript** for all source code
- **pnpm** for dependency management
- **Biom**e for code formatting and linting
- **Vitest** for unit tests
- **AWS SDK (S3)** for uploading images (provider agnostic)
- **axios** for HTTP requests
- **gray-matter** for Markdown with YAML front‑matter

## Architecture

```
app/
  src/
    cli.ts              # command dispatcher
    commands/
      update.ts         # fetch and store today's images
      migrate.ts        # migrate existing markdown files
    lib/
      bing.ts           # call Bing API
      url.ts            # convert preview/download urls
    repositories/
      wallpaperRepository.ts
```

### Wallpaper Repository
Responsible for writing markdown files.  Each file contains a YAML front matter
section storing the original Bing API payload together with calculated URLs.
The body of the file is the same as before so existing readers continue to work.

### Commands
- **update** – fetches the latest 10 images and writes them using the repository.
- **migrate** – converts the old `wallpaper` folder into the new front‑matter
  format in place or to a separate directory.

Additional commands (uploading, archive generation) can be added later using the
same pattern.

## Testing & CI

`pnpm lint`, `pnpm typecheck` and `pnpm test` ensure code quality.  Vitest tests
are colocated with source files.  The existing GitHub workflows can be updated to
call the CLI instead of Deno scripts.
