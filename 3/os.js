const os = require('os');
console.log('----OS--INFO----\nos.arch():', os.arch());
console.log('os.platform():', os.platform());
console.log('os.type():', os.type());
console.log('os.uptime():', os.uptime());
console.log('os.hostname():', os.hostname());
console.log('os.release():', os.release());

console.log('------PATH------\nos.homedir():', os.homedir());
console.log('os.tmpdir():', os.tmpdir());

console.log('----CPU-INFO----\nos.cpus():', os.cpus());
console.log('os.cpus().length:', os.cpus().length);

console.log('--MEMORY--INFO--\nos.freemem():', os.freemem());
console.log('os.totalmem():', os.totalmem());
