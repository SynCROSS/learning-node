#!/usr/bin/enc/ node
const { program } = require('commander');

program.version('0.0.1', '-v, --version').name('cli');

program
  .command('template <type>')
  .usage('<type> --filename [filename] --path [path]')
  .description('Create the Template')
  .alias('tmpl')
  .option('-n, --filename [filename]', 'Enter the Filename: ', 'index')
  .option('-d, --directory [path]', 'Enter the Directory to Create: ', '.')
  .action((type, options) => {
    console.log(type, options.filename, options.directory);
  });

program.command('*', { hidden: true }).action(() => {
  console.log(`Can't Find the Command`);
  program.help();
});

program.parse(process.argv);
