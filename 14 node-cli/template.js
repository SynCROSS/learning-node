#! /usr/bin/env node
// * You need to change package.json and type again 'npm i -g' or 'yarn global add' to execute template.js
// * npx cli to execute this
const fs = require('fs');
const path = require('path');
const readline = require('readline');

let rl;
let type = process.argv[2];
let name = process.argv[3];
let directory = process.argv[4] || '.';

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
    console.error(error);
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
    console.error('That File Already Exists');
  } else {
    fs.writeFileSync(dir, template);
    console.log(dir, 'added!');
  }
};

const makeTemplate = () => {
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
      console.log(`You Must Type 'html' or 'express-router'`);
      break;
  }
};

const dirAnswer = answer => {
  directory = answer?.trim() || '.';
  rl.close();
  makeTemplate();
};

const nameAnswer = answer => {
  if (!answer || !answer.trim()) {
    console.clear();
    console.log('You Must Type the Name!');
    return rl.question('Filename:', nameAnswer);
  }
  name = answer;
  return rl.question(
    'Directory to Save(Default is Current Directory):',
    dirAnswer,
  );
};

const typeAnswer = answer => {
  if (answer !== 'html' && answer !== 'express-router') {
    console.clear();
    console.log(`'type' must be 'html' or 'express-router'`);
    return rl.question('Template(html/express-touter):', typeAnswer);
  }
  type = answer;
  return rl.question('Filename:', nameAnswer);
};

const App = () => {
  if (!type || !name) {
    rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    console.clear();
    return rl.question('Template(html/express-touter):', typeAnswer);
  } else {
    makeTemplate();
  }
};

App();
