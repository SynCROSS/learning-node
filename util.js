const util = require('util');
const crypto = require('crypto');

const deprecated = util.deprecate((x, y) => {
  console.log(x + y);
}, 'This function is deprecated.');
deprecated(1, 1);

const randomBytesPromise = util.promisify(crypto.randomBytes);
randomBytesPromise(64)
  .then(buf => {
    console.log(buf.toString('base64'));
  })
  .catch(error => {
    console.log(error);
  });
