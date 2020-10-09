const fs = require('fs').promises;
const constants = require('fs').constants;

fs.access('./folder', constants.F_OK | constants.W_OK | constants.R_OK)
  .then(() => {
    return Promise.reject('Folder is Already Exist');
  })
  .catch(err => {
    if (err.code === 'ENOENT') {
      console.log('No Folder');
      return fs.mkdir('./folder');
    }
    return Promise.reject(err);
  })
  .then(() => {
    console.log('Success to make Folder');
    return fs.open('./folder/file.js', 'w');
  })
  .then(fd => {
    console.log('Success to make an empty file.', fd);
    fs.rename('./folder/file.js', './folder/newfile.js');
  })
  .then(() => {
    console.log('Success to rename');
  })
  .catch(err => {
    console.error(err);
  });
