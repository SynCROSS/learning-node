const cluster = require('cluster');
const http = require('http');

const numCPU = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`Master Process Id: ${process.pid}`);
  for (let i = 0; i < numCPU; i++) {
    cluster.fork();
  }
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} is terminated.`);
    console.log(`code: ${code}\nsignal: ${signal}`);
    // cluster.fork(); // ! Very Bad Idea. Find an Another Way.
  });
} else {
  http
    .createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.write('<h1>Hello Node!</h1>');
      res.end('<p>Hello Cluster!</p>');
      setTimeout(() => {
        process.exit(1);
      }, 1000);
    })
    .listen(8080);
  console.log(`Worker ${process.pid} is started.`);
}
