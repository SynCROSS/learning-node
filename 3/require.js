console.log("'require' doesn't have to be at the top.");

module.exports = 'find me if you can.';

require('./var');

console.log('require.cache:', require.cache);
console.log('require.main:', require.main);
console.log(require.main === module);
console.log(require.main.filename);
