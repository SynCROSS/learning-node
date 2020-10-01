const fs = require('fs');

console.log('Start!');
fs.readFile('./readme2.txt', (err, data) => {
  if (err) {
    throw err;
  }
  console.log(data.toString(), 'once');
  fs.readFile('./readme2.txt', (err, data) => {
    if (err) {
      throw err;
    }
    console.log(data.toString(), 'twice');
    fs.readFile('./readme2.txt', (err, data) => {
      if (err) {
        throw err;
      }
      console.log(data.toString(), 'three times');
      console.log('END!');
    });
  });
});
