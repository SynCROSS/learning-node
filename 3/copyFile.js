const fs = require('fs').promises;

fs.copyFile('readme3.txt', 'writeme4.txt')
  .then(() => {
    console.log('Copied Successfully');
  })
  .catch(error => {
    console.error(error);
  });
