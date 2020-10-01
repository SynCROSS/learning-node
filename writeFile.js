const fs = require('fs').promises;

fs.writeFile('./writeme.txt', 'writeme', 'utf8')
  .then(() => {
    return fs.readFile('./writeme.txt', 'utf8');
  })
  .then(data => {
    console.log(data.toString());
  })
  .catch(err => {
    console.error(err);
  });
