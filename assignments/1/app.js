const http = require('http');

const server = http.createServer((req, res) => {
  const { url, method } = req;
  res.setHeader('Content-Type', 'text/html');

  if (url === '/') {
    res.write(
      '<html><body><form action="/create-user" method="POST"><input type="text" name="username"><button type="submit">Create</button></form></body></html>'
    );
    return res.end();
  }
  if (url === '/users') {
    res.write('<html><body><ul><li>User1</li></ul></body></html>');
    return res.end();
  }
  if (url === '/create-user' && method === 'POST') {
    const body = [];
    req.on('data', chunk => {
      body.push(chunk);
    });
    req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString();
      const username = parsedBody.split('=')[1];
      console.log('The user is: ', username);
      res.statusCode = 302;
      res.setHeader('Location', '/');
      return res.end();
    });
  }
});

server.listen(3000);
