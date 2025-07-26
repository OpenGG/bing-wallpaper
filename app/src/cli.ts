#!/usr/bin/env node
import { Command } from "commander";
import { updateCommand } from "./commands/update.js";
import { migrateCommand } from "./commands/migrate.js";
import { buildIndexCommand } from "./commands/buildIndex.js";
import { buildArchiveCommand } from "./commands/buildArchive.js";
import { uploadCommand } from "./commands/upload.js";

const program = new Command();

program
  .name("bing-wallpaper")
  .option("-d, --dir <dir>", "current directory", ".")
  .hook("preAction", async (thisCommand) => {
    const { dir } = thisCommand.opts();
    if (dir) {
      process.chdir(dir);
    }
  });

program
  .command("update")
  .description("fetch latest images")
  .action(async () => {
    await updateCommand();
  });

program
  .command("migrate")
  .description("migrate old data")
  .option("--plugin <file>", "plugin module file")
  .option("--source <src>", "data source")
  .option("-f, --force", "overwrite existing files")
  .action(async (opts) => {
    await migrateCommand({
      plugin: opts.plugin,
      source: opts.source,
      force: !!opts.force,
    });
  });

program
  .command("build-index")
  .description("generate index files")
  .action(async () => {
    await buildIndexCommand();
  });

program
  .command("build-archive")
  .description("generate README and archives")
  .action(async () => {
    await buildArchiveCommand();
  });

program
  .command("upload")
  .description("upload images to S3")
  .option("--bucket <name>", "bucket name")
  .option("--cursor <key>", "cursor key", "cursor.txt")
  .action(async (opts) => {
    await uploadCommand({ bucket: opts.bucket, cursor: opts.cursor });
  });

program.parseAsync(process.argv);
