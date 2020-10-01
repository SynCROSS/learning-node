const string = 'abc',
  number = 1,
  boolean = true,
  obj = {
    outside: {
      inside: {
        key: 'value',
      },
    },
  };
console.time('full time');
console.log('normal log');
console.log(string, number, boolean);
console.error('Put the error message in the console.error');
console.table([
  { name: 'pjs', birth: 2003 },
  { name: 'lyw', birth: 2003 },
]);

console.dir(obj, { colors: false, depth: 2 });
console.dir(obj, { colors: true, depth: 1 });

console.time('record');
for (let i = 0; i < 10000; i++) {}
console.timeEnd('record');

const b = () => {
  console.trace('trace error');
};
const a = () => {
  b();
};

a();
console.timeEnd('full time');
