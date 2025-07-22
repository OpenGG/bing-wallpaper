#!/usr/bin/env node
import { Command } from 'commander';
import { updateCommand } from './commands/update.js';
import { migrateCommand } from './commands/migrate.js';

const program = new Command();

program
  .name('bing-wallpaper')
  .option('-d, --dest <dir>', 'Wallpaper directory', 'wallpaper');

program
  .command('update')
  .description('fetch latest images')
  .action(async (opts, cmd) => {
    const { dest } = program.optsWithGlobals();
    await updateCommand(dest);
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
      dest,
      force: !!opts.force,
    });
  });

program.parseAsync(process.argv);
