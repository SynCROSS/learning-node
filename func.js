const { odd, even } = require('./var');
const checkOddOrEven = num => {
  if (num % 2) {
    return odd;
  }
  return even;
};
module.exports = checkOddOrEven;
