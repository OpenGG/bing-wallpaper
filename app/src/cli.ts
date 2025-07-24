#!/usr/bin/env node
import { Command } from 'commander';
import { join } from 'node:path';
import { updateCommand } from './commands/update.js';
import { migrateCommand } from './commands/migrate.js';
import { buildIndexCommand } from './commands/buildIndex.js';
import { buildArchiveCommand } from './commands/buildArchive.js';

const program = new Command();

program
  .name('bing-wallpaper')
  .option('-d, --dest <dir>', 'Wallpaper directory', 'wallpaper');

program
  .command('update')
  .description('fetch latest images')
  .action(async () => {
    await updateCommand();
  });

program
  .command('migrate')
  .description('migrate old data')
  .option('--plugin <file>', 'plugin module file')
  .option('--source <src>', 'data source')
  .option('-f, --force', 'overwrite existing files')
  .action(async (opts) => {
    const { dest } = program.optsWithGlobals();
    await migrateCommand({
      plugin: opts.plugin,
      source: opts.source,
      force: !!opts.force,
    });
  });

program
  .command('build-index')
  .description('generate index files')
  .action(async () => {
    await buildIndexCommand();
  });

program
  .command('build-archive')
  .description('generate README and archives')
  .action(async () => {
    await buildArchiveCommand();
  });

program.parseAsync(process.argv);
