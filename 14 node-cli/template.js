#! /usr/bin/env node
// * You need to change package.json and type again 'npm i -g' or 'yarn global add' to execute template.js
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const type = process.argv[2];
const name = process.argv[3];
const directory = process.argv[4] || '.';

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

const App = () => {
  if (!type || !name) {
    console.error(`Usage: npx cli <html|express-router filename> [dir]`);
  } else {
    makeTemplate();
  }
};

App();
