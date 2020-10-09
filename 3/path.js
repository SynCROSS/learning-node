const path = require('path');

const string = __filename;

console.log('path.sep:', path.sep);
console.log('path.delmiter:', path.delmiter);
console.log('---------------------------');
console.log('path.dirname():', path.dirname(string));
console.log('path.extname():', path.extname(string));
console.log('path.basename():', path.basename(string));
console.log(
  'path.basename - extname:',
  path.basename(string, path.extname(string)),
);
console.log('---------------------------');
console.log('path.parse():', path.parse(string));
console.log(
  'path.format():',
  path.format({ dir: 'D:\\learning-node', name: 'path', ext: '.js' }),
);
console.log('path.normalize():', path.normalize('D://learning-node\\path.js'));
console.log('---------------------------');
console.log('path.isAbsolute(D:\\):', path.isAbsolute('D:\\'));
console.log('path.isAbsolute(./home):', path.isAbsolute('./home'));
console.log('---------------------------');
console.log(
  'path.relative():',
  path.relative('D:\\learning-node\\path.js', 'D:\\'),
);
// console.log('path.join():', path.join(__dirname, '..','..',);
