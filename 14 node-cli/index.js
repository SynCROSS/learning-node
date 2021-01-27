#! /usr/bin/env node
// * npx cli  to execute this
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Is Javascript the Best [y/n]: ', answer => {
  switch (answer) {
    case 'y':
      console.log('I recommend you try the typescript.');
      rl.close();
      break;
    case 'n':
      console.log('Right, JS is not the best');
      rl.close();
      break;
    default:
      rl.close();
      break;
  }
});
