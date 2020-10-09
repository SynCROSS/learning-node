const fs = require('fs');

const writeStream = fs.createWriteStream('./writeme2.txt');
writeStream.on('finish', () => {
  console.log('Writing Complete.');
});

writeStream.write('Write this text\n');
writeStream.write('Write it again');
writeStream.end();
