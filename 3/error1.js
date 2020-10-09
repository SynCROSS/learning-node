setInterval(() => {
  console.log('Start');
  try {
    throw new Error('FXXK U, Server! 👎');
  } catch (e) {
    console.error(e);
  }
}, 1000);
