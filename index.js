const { odd, even } = require('./var');
const checkNum = require('./func');

const checkStrOddOrEven = str => {
  if (str.length % 2) {
    return odd;
  }
  return even;
};
console.log(checkNum(10));
console.log(checkStrOddOrEven('hello'));
