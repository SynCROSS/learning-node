const http = require('http');
const fs = require('fs/promises');
const url = require('url');
const qs = require('querystring');

const parseCookies = (cookie = '') =>
  cookie
    .split(';')
    .map(c => c.split('='))
    .reduce((acc, [k, c]) => {
      acc[k.trim()] = decodeURIComponent(c);
      return acc;
    }, {});

http
  .createServer(async (req, res) => {
    const cookies = parseCookies(req.headers.cookie);

    if (req.url.startsWith('/login')) {
      const { query } = url.parse(req.url);
      const { name } = qs.parse(query);
      const expires = new Date();
      expires.setMinutes(expires.getMinutes() + 5);
      res.writeHead(302, {
        Location: '/',
        'Set-Cookie': `name=${encodeURIComponent(
          name,
        )}; Expires=${expires.toGMTString()}; HttpOnly; Path=/`,
      });
      res.end();
    } else if (cookies.name) {
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(`Hello ${cookies.name}`);
    } else {
      try {
        const data = await fs.readFile('./cookie2.html');
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(data);
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end(e.message);
      }
    }
  })
  .listen(8080, () => {
    console.log('Server is Waiting on Port 8080!');
  });
