const { spawn } = require('child_process');

const exec = require('child_process').spawn;

var process = spawn('python', ['test.py']);

process.stdout.on('data', data => {
  console.log(data.toString());
});
process.stderr.on('data', data => {
  console.error(data.toString());
});
