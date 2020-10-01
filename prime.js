const primes = [];

const generatePrimes = (start, range) => {
  let isPrime = true;
  const end = start + range;
  for (let i = start; i < end; i++) {
    for (let j = 2; j < Math.sqrt(end); j++) {
      if (i !== j && i % j === 0) {
        isPrime = false;
        break;
      }
    }
    if (isPrime) {
      primes.push(i);
    }
    isPrime = true;
  }
};
console.time('prime');
generatePrimes(2, 10000000);
console.timeEnd('prime');
console.log('Count:', primes.length);
