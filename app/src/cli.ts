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
  .command('migrate <src>')
  .description('migrate old data')
  .action(async (src: string) => {
    const { dest } = program.optsWithGlobals();
    await migrateCommand(src, dest);
  });

program.parseAsync(process.argv);
