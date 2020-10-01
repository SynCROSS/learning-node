const fs = require('fs');

console.log('Start!');
let data = fs.readFileSync('./readme2.txt');
console.log(data.toString(), 'once');
data = fs.readFileSync('./readme2.txt');
console.log(data.toString(), 'twice');
data = fs.readFileSync('./readme2.txt');
console.log(data.toString(), 'three times');
console.log('END!');
