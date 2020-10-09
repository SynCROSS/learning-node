let i = 1;
setInterval(() => {
  if (i === 5) {
    console.log('Exit!');
    process.exit();
  }
  console.log(i);
  i++;
}, 1000);
