const crypto = require('crypto');

const pass = 'pass',
  salt = 'salt',
  start = Date.now();
crypto.pbkdf2(pass, salt, 10000000, 128, 'sha512', () => {
  console.log('1:', Date.now() - start);
});
crypto.pbkdf2(pass, salt, 10000000, 128, 'sha512', () => {
  console.log('2:', Date.now() - start);
});
crypto.pbkdf2(pass, salt, 10000000, 128, 'sha512', () => {
  console.log('3:', Date.now() - start);
});
crypto.pbkdf2(pass, salt, 10000000, 128, 'sha512', () => {
  console.log('4:', Date.now() - start);
});
crypto.pbkdf2(pass, salt, 10000000, 128, 'sha512', () => {
  console.log('5:', Date.now() - start);
});
crypto.pbkdf2(pass, salt, 10000000, 128, 'sha512', () => {
  console.log('6:', Date.now() - start);
});
crypto.pbkdf2(pass, salt, 10000000, 128, 'sha512', () => {
  console.log('7:', Date.now() - start);
});
crypto.pbkdf2(pass, salt, 10000000, 128, 'sha512', () => {
  console.log('8:', Date.now() - start);
});
