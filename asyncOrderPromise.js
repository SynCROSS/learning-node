const fs = require('fs').promises;

console.log('Start!');
fs.readFile('./readme.txt')
  .then(data => {
    console.log(data.toString(), 'once');
    return fs.readFile('./readme.txt');
  })
  .then(data => {
    console.log(data.toString(), 'twice');
    return fs.readFile('./readme.txt');
  })
  .then(data => {
    console.log(data.toString(), 'three times');
    console.log('END!');
  })
  .catch(err => {
    console.error(err);
  });
