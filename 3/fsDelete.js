const fs = require('fs').promises;

fs.readdir('./folder')
  .then(dir => {
    console.log('Check the contents of the folder', dir);
    return fs.unlink('./folder/newfile.js');
  })
  .then(() => {
    console.log('Success to delete file');
    return fs.rmdir('./folder');
  })
  .then(() => {
    console.log('Success to delete folder');
  })
  .catch(err => {
    console.error(err);
  });
