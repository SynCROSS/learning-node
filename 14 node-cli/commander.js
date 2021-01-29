#!/usr/bin/env node
const { program } = require('commander');
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');

const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>

</body>
</html>
`;

const express_routerTemplate = `const express = require('express');
const router = express.Router();

router.get('/', (req,res, next) => {
  try {
    res.send('ok');
  } catch (error) {
    console.error(error);
    next(error);
  }
});
`;

const isExistingFolder = dir => {
  try {
    fs.accessSync(
      dir,
      fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK,
    );
    return true;
  } catch (error) {
    return false;
  }
};

const mkdir = dir => {
  const dirname = path
    .relative('.', path.normalize(dir))
    .split(path.sep)
    .filter(p => !!p);
  dirname.forEach((d, idx) => {
    const pathBuilder = dirname.slice(0, idx + 1).join(path.sep);

    if (!isExistingFolder(pathBuilder)) {
      fs.mkdirSync(pathBuilder);
    }
  });
};

const checkAndWriteFile = (dir = '', template = '') => {
  if (isExistingFolder(dir)) {
    console.error(chalk.bold.rgb(220, 20, 60)('That File Already Exists'));
  } else {
    fs.writeFileSync(dir, template);
    console.log(chalk.green(dir, 'added!'));
  }
};

const makeTemplate = (type, name, directory) => {
  mkdir(directory);

  let pathToFile = '';

  switch (type) {
    case 'html':
      pathToFile = path.join(directory, `${name}.${type}`);
      checkAndWriteFile(pathToFile, htmlTemplate);
      break;
    case 'express-router':
      pathToFile = path.join(directory, `${name}.js`);
      checkAndWriteFile(pathToFile, express_routerTemplate);
      break;
    default:
      console.log(
        chalk.bold.rgb(220, 20, 60)(`You Must Type 'html' or 'express-router'`),
      );
      break;
  }
};

program.version('0.0.1', '-v, --version').name('cli');

program
  .command('template <type>')
  .usage('<type> --filename [filename] --path [path]')
  .description('Create the Template')
  .alias('tmpl')
  .option('-n, --filename [filename]', 'Enter the Filename: ', 'index')
  .option('-d, --directory [path]', 'Enter the Directory to Create: ', '.')
  .action((type, options) => {
    makeTemplate(type, options.filename, options.directory);
  });

program
  .action((cmd, args) => {
    if (args) {
      console.log();
      console.log(chalk.bold.rgb(220, 20, 60)(`Can't Find the Command.`));
      program.help();
    } else {
      inquirer
        .prompt([
          {
            type: 'list',
            name: 'type',
            message: 'Choose the templates:',
            choices: ['html', 'express-router'],
          },
          {
            type: 'input',
            name: 'name',
            message: 'Enter the Filename',
            default: 'index',
          },
          {
            type: 'input',
            name: 'directory',
            message: 'Where is the Directory to Save?',
            default: '.',
          },
          {
            type: 'confirm',
            name: 'confirm',
            message: 'Are You Ready to Proceed? [y/n]',
          },
        ])
        .then(answers => {
          if (answers.confirm) {
            makeTemplate(answers.type, answers.name, answers.directory);
            console.log(chalk.green('Done :)'));
          }
        });
    }
  })
  .parse(process.argv);
