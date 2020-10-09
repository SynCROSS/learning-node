process.on('uncaughtException', err => {
  console.error('Unexpected Error', err);
});

setInterval(() => {
  console.log("I'll Crash You, Server");
}, 1000);

setTimeout(() => {
  console.log('Executing...');
}, 2000);
