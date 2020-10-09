const timeout = setTimeout(() => {
  console.log('After 1.5second');
}, 1500);
const interval = setInterval(() => {
  console.log('Execute each second');
}, 1000);
const timeout2 = setTimeout(() => {
  console.log("Didn't execute");
}, 3000);
setTimeout(() => {
  clearTimeout(timeout2);
  clearInterval(interval);
}, 2500);

const immediate = setImmediate(() => {
  console.log('Execute immediately');
});
const immediate2 = setImmediate(() => {
  console.log("Didn't execute");
});
clearImmediate(immediate2);
