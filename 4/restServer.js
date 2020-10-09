const http = require('http');
const fs = require('fs/promises');

const users = {};

http
  .createServer(async (req, res) => {
    try {
      console.log(req.method, req.url);
      if (req.method === 'GET') {
        if (req.url === '/') {
          const data = await fs.readFile('./restFront.html');
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          return res.end(data);
        } else if (req.url === '/about') {
          const data = await fs.readFile('./about.html');
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          return res.end(data);
        } else if (req.url === '/users') {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          return res.end(JSON.stringify(users));
        }
        try {
          const data = await fs.readFile(`.${req.url}`);
          return res.end(data);
        } catch (e) {}
      } else if (req.method === 'POST') {
        if (req.url === '/user') {
          let body = '';
          // * Receive body in requests in stream format.
          req.on('data', data => {
            body += data;
          });
          return req.on('end', () => {
            console.log('POST Body:', body);
            const { name } = JSON.parse(body);
            const id = Date.now();
            users[id] = name;
            res.writeHead(201);
            res.end('Registration Successful!');
          });
        }
      } else if (req.method === 'PUT') {
        if (req.url.startsWith('/user/')) {
          const key = req.url.split('/')[2];
          let body = '';
          req.on('data', data => {
            body += data;
          });
          return req.on('end', () => {
            console.log('PUT body:', body);
            users[key] = JSON.parse(body).name;
            return res.end(JSON.stringify(users));
          });
        }
      } else if (req.method === 'DELETE') {
        if (req.url.startsWith('/user/')) {
          const key = req.url.split('/')[2];
          delete users[key];
          return res.end(JSON.stringify(users));
        }
      }
      res.writeHead(404);
      return res.end('NOT FOUND');
    } catch (e) {
      console.error(e);
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end(e.message);
    }
  })
  .listen(8080, () => {
    console.log('Server is Waiting on Port 8080!');
  });
